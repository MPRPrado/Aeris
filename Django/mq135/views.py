import json
import numpy as np
import math
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import DadosSensor_mq135
from .utils import gerar_relatorio



# Mostrar dados no HTML
def mostrar_dados(request):
    leituras = DadosSensor_mq135.objects.all().order_by('-id')[:50]  # últimas 50 leituras

    dados_formatados = [
        {
            'nh3': f"{dado.nh3_ppm:.1f}",
            'disp': dado.dispositivo_id,
            'id': dado.id
        } for dado in leituras
    ]

    context = {
        'dados': dados_formatados,
        'total_registros': DadosSensor_mq135.objects.count(),
    }
    return render(request, 'mq135/dadosmq135.html', context)


# Mostrar relatório
def mostrar_relatorio(request):
    relatorio = gerar_relatorio()
    context = {'relatorio': relatorio}
    return render(request, 'mq135/relatorio.html', context)

# API para relatório (JSON)
def relatorio_api(request):
    relatorio = gerar_relatorio()
    return JsonResponse(relatorio)


