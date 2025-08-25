from django.shortcuts import render
from django.http import JsonResponse
# Importa o decorador que desativa a verificação de CSRF
# (útil para receber dados de dispositivos que não usam navegador)
from django.views.decorators.csrf import csrf_exempt
import json

dados_recebidos_lista = []
# Desativa CSRF para essa função (importante para receber dados de fora, como do ESP32)
@csrf_exempt
def receber_dados(request):
    # Verifica se o método da requisição é POST
    if request.method == 'POST':
        try:
            # Converte o corpo da requisição (request.body) de JSON para um dicionário Python
            data = json.loads(request.body.decode('utf-8'))
            
            # Mostra os dados no terminal do servidor (não aparece no navegador)
            print("Dados recebidos:", data)
            
            # Salva os dados na lista para mostrar no template depois
            dados_recebidos_lista.append(data)
            
            # Retorna uma resposta JSON indicando sucesso
            return JsonResponse({'status': 'ok', 'mensagem': 'Dados recebidos com sucesso'})
        except json.JSONDecodeError:
            # Se o JSON estiver inválido, retorna erro 400 com mensagem
            return JsonResponse({'status': 'erro', 'mensagem': 'JSON inválido'}, status=400)
    
    # Caso a requisição não seja POST, retorna erro 405 (método não permitido)
    return JsonResponse({'status': 'erro', 'mensagem': 'Método não permitido'}, status=405)

# View para mostrar os dados na página HTML
def mostrar_dados(request):
    # Renderiza o template 'wifi/dados.html' e passa a lista de dados
    # 'dados' será a variável que o template poderá acessar
    return render(request, 'dados.html', {'dados': dados_recebidos_lista})