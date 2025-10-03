import json
import numpy as np
import math
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import DadosSensor_mq2
from .utils import gerar_relatorio
from alertas import enviar_alerta_email


# Mostrar dados no HTML
def mostrar_dados(request):
    dispositivo = request.GET.get('dispositivo', 'ESP32_MQ2')
    
    leituras = DadosSensor_mq2.objects.filter(
        dispositivo_id=dispositivo
    ).exclude(
        dispositivo_id__icontains='ficticio'
    ).order_by('-id')[:50]

    dados_formatados = [
        {
            'butano': f"{dado.c4h10_ppm:.1f}",
            'disp': dado.dispositivo_id,
            'id': dado.id
        } for dado in leituras
    ]

    dispositivos = DadosSensor_mq2.objects.exclude(
        dispositivo_id__icontains='ficticio'
    ).values_list('dispositivo_id', flat=True).distinct()

    context = {
        'dados': dados_formatados,
        'total_registros': leituras.count(),
        'dispositivo_atual': dispositivo,
        'dispositivos': list(dispositivos),
    }
    return render(request, 'mq2/dadosmq2.html', context)


# Mostrar relatório
def mostrar_relatorio(request):
    relatorio = gerar_relatorio()
    context = {'relatorio': relatorio}
    return render(request, 'mq2/relatorio.html', context)

# API para relatório (JSON)
def relatorio_api(request):
    usuario_id = request.GET.get('usuario_id')
    relatorio = gerar_relatorio(usuario_id)
    return JsonResponse(relatorio)

# API para dados do sensor filtrados por dispositivo
@csrf_exempt
def dados_api(request):
    dispositivo = request.GET.get('dispositivo', 'ESP32_MQ2')
    page_size = int(request.GET.get('page_size', 100))
    
    dados = DadosSensor_mq2.objects.filter(
        dispositivo_id=dispositivo
    ).exclude(
        dispositivo_id__icontains='ficticio'
    ).order_by('-timestamp')[:page_size]
    
    dados_json = [{
        'c4h10_ppm': dado.c4h10_ppm,
        'timestamp': dado.timestamp.isoformat(),
        'dispositivo_id': dado.dispositivo_id
    } for dado in dados]
    
    return JsonResponse({
        'results': dados_json,
        'count': len(dados_json),
        'dispositivo_filtrado': dispositivo
    })


# API para listar dispositivos disponíveis
@csrf_exempt
def dispositivos_api(request):
    dispositivos = DadosSensor_mq2.objects.exclude(
        dispositivo_id__icontains='ficticio'
    ).values_list('dispositivo_id', flat=True).distinct()
    
    return JsonResponse({
        'dispositivos': list(dispositivos)
    })


