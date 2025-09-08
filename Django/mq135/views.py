import json
import numpy as np
import pandas as pd
from sklearn import linear_model
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import DadosSensor

SCIENTIFIC_LIBS_AVAILABLE = True

dados_recebidos_lista = []
#receber sensor
@csrf_exempt
def receber_dados(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'CO2_ppm' not in data:
                return JsonResponse({'status': 'erro', 'mensagem': 'Campo CO2_ppm não encontrado'}, status=400)

            co2_ppm = float(data['CO2_ppm'])
            if co2_ppm <= 0 or co2_ppm > 10000:
                return JsonResponse({'status': 'erro', 'mensagem': 'Valor de CO2 fora do range válido'}, status=400)

            sensor_data = DadosSensor.objects.create(
                co2_ppm=co2_ppm,
                dispositivo_id=data.get('device_id', 'ESP32_MQ135')
            )
            dados_recebidos_lista.append(sensor_data)
            return JsonResponse({
                'status': 'ok',
                'mensagem': 'Dados recebidos e salvos',
                'id': sensor_data.id,
                'co2_ppm': co2_ppm,
                'timestamp': sensor_data.timestamp.isoformat()
            })

        except (ValueError, json.JSONDecodeError):
            return JsonResponse({'status': 'erro', 'mensagem': 'JSON inválido ou valor inválido'}, status=400)

    return JsonResponse({'status': 'erro', 'mensagem': 'Método não permitido'}, status=405)

#PrevisãoMensal
def prever_dados_mensal(request, contador):
    if not SCIENTIFIC_LIBS_AVAILABLE:
        return _previsao_simples(contador)
    
    # Calcular dia atual
    dia_atual = contador // 4
    dias_totais = 30
    dias_faltantes = dias_totais - dia_atual

    if dias_faltantes <= 0:
        return JsonResponse({'status': 'ok', 'mensagem': 'Previsão mensal já concluída'}, status=200)

    # Buscar todas as leituras do sensor no banco
    leituras = DadosSensor.objects.all().order_by('timestamp')
    if leituras.count() < 4:
        return JsonResponse({'status': 'erro', 'mensagem': 'Leituras insuficientes para previsão.'}, status=400)

    # Converter queryset para DataFrame
    df = pd.DataFrame.from_records(leituras.values('timestamp', 'co2_ppm'))
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values('timestamp')

    # Criar coluna 'dia' baseada na ordem das leituras (cada 4 leituras = 1 dia)
    df['dia'] = (np.arange(len(df)) // 4) + 1

    # Calcular média PPM por dia
    df_dias = df.groupby('dia')['co2_ppm'].mean().reset_index()

    # Variáveis para regressão
    X = df_dias['dia'].values.reshape(-1, 1)
    y = df_dias['co2_ppm'].values.reshape(-1, 1)

    # Treinar modelo de regressão linear
    modelo = linear_model.LinearRegression()
    modelo.fit(X, y)

    # Preparar previsões para os dias futuros
    dias_para_prever = np.arange(dia_atual + 1, dias_totais + 1).reshape(-1, 1)
    previsoes = modelo.predict(dias_para_prever).flatten()

    # Montar lista de previsões
    resultado = [{'dia': int(dia), 'previsao_ppm': float(ppm)} for dia, ppm in zip(dias_para_prever.flatten(), previsoes)]
    print("Previsões dos próximos dias:", resultado)

    return JsonResponse({
        'status': 'ok',
        'dia_atual': dia_atual,
        'dias_totais': dias_totais,
        'previsoes': resultado
    })

def _previsao_simples(contador):
    """Previsão básica sem bibliotecas científicas"""
    dia_atual = contador // 4
    dias_totais = 30
    
    if dia_atual >= dias_totais:
        return JsonResponse({'status': 'ok', 'mensagem': 'Previsão mensal já concluída'}, status=200)
    
    # Buscar leituras recentes
    leituras = DadosSensor.objects.all().order_by('-timestamp')[:20]
    if leituras.count() < 4:
        return JsonResponse({'status': 'erro', 'mensagem': 'Leituras insuficientes para previsão.'}, status=400)
    
    # Calcular média simples das últimas leituras
    media_co2 = sum(l.co2_ppm for l in leituras) / len(leituras)
    
    # Gerar previsões simples baseadas na média
    resultado = []
    for dia in range(dia_atual + 1, dias_totais + 1):
        # Variação simples baseada no dia
        variacao = (dia - dia_atual) * 0.5  # pequena variação
        previsao = media_co2 + variacao
        resultado.append({'dia': dia, 'previsao_ppm': round(previsao, 1)})
    
    return JsonResponse({
        'status': 'ok',
        'dia_atual': dia_atual,
        'dias_totais': dias_totais,
        'previsoes': resultado,
        'metodo': 'previsao_simples'
    })

#HTML 
def mostrar_dados(request):
    leituras = DadosSensor.objects.all().order_by('-id')[:50]  # últimas 50 leituras

    dados_formatados = [
        {
            'co2': f"{dado.co2_ppm:.1f}",
            'disp': dado.dispositivo_id,
            'id': dado.id
        } for dado in leituras
    ]

    context = {
        'dados': dados_formatados,
        'total_registros': DadosSensor.objects.count(),
    }
    return render(request, 'wifi/dados.html', context)

def relatorio_view(request):
    from .utils import gerar_relatorio
    from django.utils import timezone
    from datetime import timedelta
    import random
    
    # Criar dados de teste se não existirem
    if DadosSensor.objects.count() == 0:
        for i in range(35):
            for j in range(4):
                data = timezone.now() - timedelta(days=i, hours=j*6)
                co2_valor = random.uniform(400, 1200)
                DadosSensor.objects.create(
                    co2_ppm=co2_valor,
                    timestamp=data,
                    dispositivo_id='ESP32_MQ135'
                )
    
    relatorio = gerar_relatorio()
    return render(request, 'mq135/relatorio.html', {'relatorio': relatorio})
