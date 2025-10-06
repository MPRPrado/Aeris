import random
from datetime import datetime, timedelta
from .models import Usuario, DispositivoESP
from mq2.models import DadosSensor_mq2
from mq7.models import DadosSensor_mq7
from mq135.models import DadosSensor_mq135

def funcao_cad_esp(usuario_id):
    """Cria ESP fictício e gera dados para demonstração"""
    try:
        usuario = Usuario.objects.get(id_usuario=usuario_id)
        
        # Permite múltiplos ESPs por usuário
        # Verifica quantos ESPs o usuário já tem
        count_esps = DispositivoESP.objects.filter(usuario=usuario).count()
        if count_esps >= 5:  # Limite de 5 ESPs por usuário
            return None
        
        # Cria ESP fictício
        esp_ficticio = DispositivoESP.objects.create(
            usuario=usuario,
            esp_id=f"ESP_DEMO_{usuario_id}_{random.randint(1000,9999)}",
            nome=f"ESP Demo - ETE FMC",
            tipo="DEMO"
        )
        
        # ESP criado sem dados fictícios no banco
        # Dados de demonstração serão gerados apenas no frontend
        
        return esp_ficticio
    except Usuario.DoesNotExist:
        return None

def gerar_dados_ficticios_frontend():
    """Gera dados fictícios apenas para o frontend (não salva no banco)"""
    dados_demo = []
    
    for dia in range(1, 31):  # 30 dias
        # MQ2 (Butano) - 800 a 2500 ppm
        mq2_valor = random.randint(800, 2500)
        
        # MQ7 (CO) - 500 a 9000 ppm  
        mq7_valor = random.randint(500, 9000)
        
        # MQ135 (NH3) - 10 a 350 ppm
        mq135_valor = random.randint(10, 350)
        
        dados_demo.append({
            'dia': dia,
            'mq2': mq2_valor,
            'mq7': mq7_valor, 
            'mq135': mq135_valor
        })
    
    return dados_demo

# Função antiga comentada para não salvar no banco
# def gerar_dados_ficticios(esp_id, usuario):
#     """REMOVIDO - Não gera mais dados no banco para não atrapalhar dados reais"""
#     pass

def criar_esp_real():
    """Identifica ESP real pelo ID específico"""
    ESP_REAL_ID = "ESP_REAL_AERIS_2025"
    return ESP_REAL_ID

def cadastrar_esp_real(usuario_id, esp_mac_address):
    """Cadastra ESP real com MAC address"""
    try:
        usuario = Usuario.objects.get(id_usuario=usuario_id)
        
        esp_real = DispositivoESP.objects.create(
            usuario=usuario,
            esp_id=esp_mac_address,  # Usa MAC como ID
            nome=f"ESP Real - {usuario.nome}",
            tipo="REAL"
        )
        
        return esp_real
    except Usuario.DoesNotExist:
        return None