import numpy as np
from datetime import timedelta
from django.utils import timezone
from django.db import DatabaseError
from .models import DadosSensor_mq135 as DadosSensor

def obter_dados_mensais_completos(usuario_id=None):
    """Retorna dados mensais completos (4500 registros) ou None se não houver mês completo"""
    try:
        # Obter total de registros
        if usuario_id:
            total_registros = DadosSensor.objects.filter(usuario_id=usuario_id).count()
        else:
            total_registros = DadosSensor.objects.count()
        
        # Se não há registros suficientes para um mês completo, retorna None
        if total_registros < 180:
            return None
        
        # Calcular qual mês completo mostrar
        mes_completo = (total_registros // 180)
        inicio_mes = (mes_completo - 1) * 180
        fim_mes = mes_completo * 180
        
        # Buscar os 180 dados do mês mais recente completo
        if usuario_id:
            dados = list(DadosSensor.objects.filter(usuario_id=usuario_id)
                        .order_by('-id')[inicio_mes:fim_mes]
                        .values('id', 'nh3_ppm', 'timestamp'))
        else:
            dados = list(DadosSensor.objects.all()
                        .order_by('-id')[inicio_mes:fim_mes]
                        .values('id', 'nh3_ppm', 'timestamp'))
        
        return {
            'dados': dados,
            'mes_numero': mes_completo,
            'total_registros': total_registros
        }
        
    except DatabaseError:
        return None

def gerar_relatorio(usuario_id=None):
    try:
        # Usar dados mensais completos para relatório
        resultado_mensal = obter_dados_mensais_completos(usuario_id)
        
        if not resultado_mensal:
            return "Aguardando dados suficientes para gerar relatório mensal completo."
        
        dados_valores = [item['nh3_ppm'] for item in resultado_mensal['dados']]
        
        if len(dados_valores) < 180:
            return "Sem dados suficientes para relatório mensal."
        
        # Dividir mês em semanas (180 / 4 = 45 por semana)
        semana1 = dados_valores[:45]
        semana2 = dados_valores[45:90]
        semana3 = dados_valores[90:135]
        semana4 = dados_valores[135:180]
        
        media_semana1 = np.mean(semana1)
        media_semana2 = np.mean(semana2)
        media_semana3 = np.mean(semana3)
        media_semana4 = np.mean(semana4)
        
        # Calcular variações
        variacao_4_semanas = abs(((media_semana1 - media_semana4) / media_semana1) * 100) if media_semana1 > 0 else 0
        
        # Primeira vs segunda quinzena
        primeira_quinzena = dados_valores[:90]
        segunda_quinzena = dados_valores[90:180]
        media_primeira_quinzena = np.mean(primeira_quinzena)
        media_segunda_quinzena = np.mean(segunda_quinzena)
        
        variacao_inicio_mes = abs(((media_primeira_quinzena - media_segunda_quinzena) / media_primeira_quinzena) * 100) if media_primeira_quinzena > 0 else 0
        
        # Segunda semana vs primeira
        aumento_segunda_semana = abs(((media_semana2 - media_semana1) / media_semana1) * 100) if media_semana1 > 0 else 0
        
        # Previsões
        tendencia = (variacao_4_semanas + variacao_inicio_mes) / 2
        previsao_min = tendencia * 0.6
        previsao_max = tendencia * 1.4
        
        return {
            "variacao_4_semanas": int(variacao_4_semanas),
            "variacao_inicio_mes": int(variacao_inicio_mes),
            "aumento_segunda_semana": int(aumento_segunda_semana),
            "previsao_min": int(previsao_min),
            "previsao_max": int(previsao_max),
            "mes_numero": resultado_mensal['mes_numero'],
            "total_registros": resultado_mensal['total_registros']
        }
        
    except DatabaseError:
        return {"erro": "Erro ao acessar dados do banco."}