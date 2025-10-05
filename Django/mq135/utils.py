import numpy as np
from datetime import timedelta
from django.utils import timezone
from django.db import DatabaseError
from .models import DadosSensor_mq135 as DadosSensor

def gerar_relatorio(usuario_id=None):
    try:   
        # Sem previsão ML - apenas dados reais
        
        # Pegar últimas leituras para cálculos reais (6 leituras = 1 dia)
        if usuario_id:
            dados = list(DadosSensor.objects.filter(usuario_id=usuario_id).order_by('-timestamp')[:1080].values_list("co2_ppm", flat=True))  # 180 dias
        else:
            dados = list(DadosSensor.objects.all().order_by('-timestamp')[:1080].values_list("co2_ppm", flat=True))  # 180 dias
        
        if len(dados) < 168:  # 28 dias * 6 leituras
            return "Sem dados suficientes."
        
        # Dividir em grupos para cálculos (4 semanas = 28 dias = 168 leituras)
        dados_recentes = dados[:168]  # últimas 4 semanas
        dados_anteriores = dados[168:336] if len(dados) >= 336 else dados[168:]  # 4 semanas anteriores
        
        media_recentes = np.mean(dados_recentes)
        media_anteriores = np.mean(dados_anteriores) if dados_anteriores else media_recentes
        
        # Calcular variação percentual
        if media_anteriores > 0:
            variacao_4_semanas = abs(((media_anteriores - media_recentes) / media_anteriores) * 100)
        else:
            variacao_4_semanas = 0
        
        # Variação início do mês (30 dias = 180 leituras)
        if len(dados) >= 360:  # 60 dias
            dados_mes_atual = dados[:180]  # últimos 30 dias
            dados_mes_anterior = dados[180:360]  # 30 dias anteriores
            media_mes_atual = np.mean(dados_mes_atual)
            media_mes_anterior = np.mean(dados_mes_anterior)
            if media_mes_anterior > 0:
                variacao_inicio_mes = abs(((media_mes_anterior - media_mes_atual) / media_mes_anterior) * 100)
            else:
                variacao_inicio_mes = 0
        else:
            variacao_inicio_mes = variacao_4_semanas
            
        # Aumento segunda semana (7 dias = 42 leituras)
        if len(dados) >= 84:  # 14 dias
            dados_primeira_semana = dados[:42]  # última semana
            dados_segunda_semana = dados[42:84]  # semana anterior
            media_primeira = np.mean(dados_primeira_semana)
            media_segunda = np.mean(dados_segunda_semana)
            if media_primeira > 0:
                aumento_segunda_semana = abs(((media_segunda - media_primeira) / media_primeira) * 100)
            else:
                aumento_segunda_semana = 0
        else:
            aumento_segunda_semana = variacao_4_semanas
        
        # Calcular previsão simples baseada na tendência
        tendencia = (variacao_4_semanas + variacao_inicio_mes) / 2
        previsao_min = tendencia * 0.6
        previsao_max = tendencia * 1.4
        
        return {
            "variacao_4_semanas": int(variacao_4_semanas),
            "variacao_inicio_mes": int(variacao_inicio_mes),
            "aumento_segunda_semana": int(aumento_segunda_semana),
            "previsao_min": int(previsao_min),
            "previsao_max": int(previsao_max)
        }
        
    except DatabaseError:
        return {"erro": "Erro ao acessar dados do banco."}