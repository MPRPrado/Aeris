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
    usuario_id = request.GET.get('usuario_id')
    if usuario_id:
        leituras = DadosSensor_mq2.objects.filter(usuario_id=usuario_id).order_by('-id')[:50]
    else:
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
    usuario_id = request.GET.get('usuario_id')
    relatorio = gerar_relatorio(usuario_id)
    return JsonResponse(relatorio)

# API para dados do sensor por usuário
def dados_api(request):
    usuario_id = request.GET.get('usuario_id')
    if not usuario_id:
        return JsonResponse({'error': 'usuario_id obrigatório'}, status=400)
    
    dados = DadosSensor_mq2.objects.filter(usuario_id=usuario_id).order_by('-timestamp')[:100]
    dados_json = [{
        'valor': dado.c4h10_ppm,
        'timestamp': dado.timestamp.isoformat(),
        'dispositivo': dado.dispositivo_id
    } for dado in dados]
    
    return JsonResponse({'dados': dados_json})


