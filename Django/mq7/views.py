from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import DadosSensor_mq7
from .utils import gerar_relatorio, obter_dados_mensais_completos
from .pdf_utils import gerar_pdf_relatorio

# Mostrar dados no HTML
def mostrar_dados(request):
    dispositivo = request.GET.get('dispositivo', 'ESP32_MQ7')
    
    leituras = DadosSensor_mq7.objects.filter(
        dispositivo_id=dispositivo
    ).exclude(
        dispositivo_id__icontains='ficticio'
    ).order_by('-id')[:50]

    dados_formatados = [
        {
            'CO': f"{dado.co_ppm:.1f}",
            'disp': dado.dispositivo_id,
            'id': dado.id
        } for dado in leituras
    ]

    dispositivos = DadosSensor_mq7.objects.exclude(
        dispositivo_id__icontains='ficticio'
    ).values_list('dispositivo_id', flat=True).distinct()

    context = {
        'dados': dados_formatados,
        'total_registros': leituras.count(),
        'dispositivo_atual': dispositivo,
        'dispositivos': list(dispositivos),
    }
    return render(request, 'mq7/dadosmq7.html', context)


# Mostrar relatório
def mostrar_relatorio(request):
    relatorio = gerar_relatorio()
    context = {'relatorio': relatorio}
    return render(request, 'mq7/relatorio.html', context)

# API para relatório (JSON)
def relatorio_api(request):
    usuario_id = request.GET.get('usuario_id')
    relatorio = gerar_relatorio(usuario_id)
    if isinstance(relatorio, str):
        return JsonResponse({'message': relatorio})
    return JsonResponse(relatorio)

# Download PDF do relatório
def download_pdf(request):
    usuario_id = request.GET.get('usuario_id')
    buffer = gerar_pdf_relatorio(usuario_id)
    
    response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="relatorio_mq7.pdf"'
    return response



