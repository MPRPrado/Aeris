import json
import numpy as np
import pandas as pd
import math
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from sklearn import linear_model
from .models import DadosSensor_mq135
from .utils import gerar_relatorio


# Receber dados do sensor
#@csrf_exempt
#def receber_dados(request):
#    if request.method == 'POST':
#        try:
#            data = json.loads(request.body.decode('utf-8'))
#
#            if 'Rs' not in data:
#                return JsonResponse({'status': 'erro', 'mensagem': 'Campo Rs não encontrado'}, status=400)
#
#            Rs = float(data['Rs'])
#            if Rs <= 0:
#                return JsonResponse({'status': 'erro', 'mensagem': 'Valor Rs inválido'}, status=400)
#
#            # Calibração (ajuste conforme necessário)
#            R0 = 165526.45      
#            A_CO2 = 116.6020682    
#            B_CO2 = -2.769034857         
#
#            ratio = Rs / R0
#            ppm = A_CO2 * math.pow(ratio, B_CO2)
#
#            sensor_data = DadosSensor_mq135.objects.create(
#                co2_ppm=ppm,
#                dispositivo_id=data.get('device_id', 'ESP32_MQ135')
#            )
#
#            return JsonResponse({
#                'status': 'ok',
#                'mensagem': 'Dados recebidos e salvos',
#                'id': sensor_data.id,
#                'co2_ppm': ppm,
#                'timestamp': sensor_data.timestamp.isoformat()
#            })
#
#        except (ValueError, json.JSONDecodeError):
#            return JsonResponse({'status': 'erro', 'mensagem': 'JSON inválido ou valor inválido'}, status=400)
#
#    return JsonResponse({'status': 'erro', 'mensagem': 'Método não permitido'}, status=405)




# Mostrar dados mensais no HTML
def mostrar_dados(request):
    from datetime import datetime, timedelta
    from django.db.models import Avg, Count
    
    # Pegar dados dos últimos 30 dias
    data_limite = timezone.now() - timedelta(days=30)
    leituras = DadosSensor_mq135.objects.filter(timestamp__gte=data_limite).order_by('timestamp')
    
    # Agrupar por dia (6 leituras = 1 dia)
    dados_mensais = []
    leituras_list = list(leituras)
    
    for i in range(0, len(leituras_list), 6):
        grupo_dia = leituras_list[i:i+6]
        if grupo_dia:
            dia_numero = (i // 6) + 1
            media_nh3 = sum(l.nh3_ppm for l in grupo_dia) / len(grupo_dia)
            dados_mensais.append({
                'dia': dia_numero,
                'media_nh3': f"{media_nh3:.1f}",
                'total_leituras': len(grupo_dia)
            })
    
    # Limitar a 30 dias
    dados_mensais = dados_mensais[:30]

    context = {
        'dados_mensais': dados_mensais,
        'total_registros': DadosSensor_mq135.objects.count(),
    }
    return render(request, 'wifi/dados.html', context)


# Mostrar relatório
def mostrar_relatorio(request):
    relatorio = gerar_relatorio()
    context = {'relatorio': relatorio}
    return render(request, 'mq135/relatorio.html', context)

# API para relatório (JSON)
def relatorio_api(request):
    relatorio = gerar_relatorio()
    return JsonResponse(relatorio)


