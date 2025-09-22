import numpy as np
import pandas as pd
from datetime import timedelta
from django.utils import timezone
from django.db import DatabaseError
from sklearn import linear_model
from .models import DadosSensor_mq2 as DadosSensor

def gerar_relatorio():
    try:
        # Pegar últimas 180 leituras
        dados = list(DadosSensor.objects.all().order_by('-timestamp')[:180].values_list("c4h10_ppm", flat=True))
        
        if len(dados) < 60:
            return "Sem dados suficientes."
        
        # Dividir em grupos para cálculos
        dados_recentes = dados[:60]
        dados_anteriores = dados[60:120] if len(dados) >= 120 else dados[60:]
        
        media_recentes = np.mean(dados_recentes)
        media_anteriores = np.mean(dados_anteriores) if dados_anteriores else media_recentes
        
        variacao_4_semanas = abs(((media_anteriores - media_recentes) / media_anteriores) * 100) if media_anteriores != 0 else 0
        
        if len(dados) >= 180:
            dados_mes_atual = dados[:90]
            dados_mes_anterior = dados[90:180]
            media_mes_atual = np.mean(dados_mes_atual)
            media_mes_anterior = np.mean(dados_mes_anterior)
            variacao_inicio_mes = abs(((media_mes_anterior - media_mes_atual) / media_mes_anterior) * 100) if media_mes_anterior != 0 else 0
        else:
            variacao_inicio_mes = variacao_4_semanas
            
        if len(dados) >= 60:
            dados_primeira_semana = dados[:30]
            dados_segunda_semana = dados[30:60]
            media_primeira = np.mean(dados_primeira_semana)
            media_segunda = np.mean(dados_segunda_semana)
            aumento_segunda_semana = abs(((media_segunda - media_primeira) / media_primeira) * 100) if media_primeira != 0 else 0
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