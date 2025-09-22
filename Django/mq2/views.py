import json
import numpy as np
import pandas as pd
import math
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from sklearn import linear_model
from .models import DadosSensor_mq2
from .utils import gerar_relatorio

# Receber dados do sensor MQ-2
#@csrf_exempt
#def receber_dados(request):
#    if request.method == 'POST':
#        try:
#           data = json.loads(request.body.decode('utf-8'))
#
#           if 'Rs' not in data:
#               return JsonResponse({'status': 'erro', 'mensagem': 'Campo Rs não encontrado'}, status=400)
#
#           Rs = float(data['Rs'])
#           if Rs <= 0:
#               return JsonResponse({'status': 'erro', 'mensagem': 'Valor Rs inválido'}, status=400)
#
#           # Calibração para Butano (C4H10)
#           R0 = 32830.0
#           A_BUTANO = 97.0
#           B_BUTANO = -0.46
#
#           ratio = Rs / R0
#           ppm = A_BUTANO * math.pow(ratio, B_BUTANO)
#
#           sensor_data = DadosSensor_mq2.objects.create(
#               c4h10_ppm=ppm,
#               dispositivo_id=data.get('device_id', 'ESP32_MQ2')
#           )
#           return JsonResponse({
#                'status': 'ok',
#                'mensagem': 'Dados recebidos e salvos',
#                'id': sensor_data.id,
#               'butano_ppm': ppm,
#                'timestamp': sensor_data.timestamp.isoformat()
#            })
#
#        except (ValueError, json.JSONDecodeError):
#            return JsonResponse({'status': 'erro', 'mensagem': 'JSON inválido ou valor inválido'}, status=400)
#
#    return JsonResponse({'status': 'erro', 'mensagem': 'Método não permitido'}, status=405)


# Previsão mensal de dados MQ-2
def prever_dados_mensal(request, contador):
    # Calcular dia atual
    dia_atual = contador // 6
    dias_totais = 30
    dias_faltantes = dias_totais - dia_atual

    if dias_faltantes <= 0:
        return JsonResponse({'status': 'ok', 'mensagem': 'Previsão mensal já concluída'}, status=200)

    # Buscar todas as leituras
    leituras = DadosSensor_mq2.objects.all().order_by('timestamp')

    if leituras.count() < 6:
        return JsonResponse({'status': 'erro', 'mensagem': 'Leituras insuficientes para previsão.'}, status=400)

    # Converter queryset para DataFrame
    df = pd.DataFrame.from_records(leituras.values('timestamp', 'c4h10_ppm'))
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')

    # Criar coluna 'dia' (cada 6 leituras = 1 dia)
    df['dia'] = (np.arange(len(df)) // 6) + 1

    # Calcular média PPM por dia
    df_dias = df.groupby('dia')['c4h10_ppm'].mean().reset_index()

    # Regressão linear
    X = df_dias['dia'].values.reshape(-1, 1)
    y = df_dias['c4h10_ppm'].values.reshape(-1, 1)

    modelo = linear_model.LinearRegression()
    modelo.fit(X, y)

    # Previsões
    dias_para_prever = np.arange(dia_atual + 1, dias_totais + 1).reshape(-1, 1)
    previsoes = modelo.predict(dias_para_prever).flatten()
    
    # Limitar previsões para não serem negativas
    previsoes = np.maximum(previsoes, 0)

    resultado = [{'dia': int(dia), 'previsao_ppm': float(ppm)} for dia, ppm in zip(dias_para_prever.flatten(), previsoes)]

    return JsonResponse({
        'status': 'ok',
        'dia_atual': dia_atual,
        'dias_totais': dias_totais,
        'previsoes': resultado
    })


# Mostrar dados no HTML
def mostrar_dados(request):
    leituras = DadosSensor_mq2.objects.all().order_by('-id')[:50]  # últimas 50 leituras

    dados_formatados = [
        {
            'butano': f"{dado.c4h10_ppm:.1f}",  # corrigido
            'disp': dado.dispositivo_id,
            'id': dado.id
        } for dado in leituras
    ]

    context = {
        'dados': dados_formatados,
        'total_registros': DadosSensor_mq2.objects.count(),
    }
    return render(request, 'mq2/dadosmq2.html', context)


# Mostrar relatório
def mostrar_relatorio(request):
    relatorio = gerar_relatorio()
    context = {'relatorio': relatorio}
    return render(request, 'mq2/relatorio.html', context)

# API para relatório (JSON)
def relatorio_api(request):
    relatorio = gerar_relatorio()
    return JsonResponse(relatorio)


