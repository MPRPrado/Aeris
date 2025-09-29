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


