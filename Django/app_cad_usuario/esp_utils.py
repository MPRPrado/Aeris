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
            nome=f"ESP Demo - {usuario.nome}",
            tipo="DEMO"
        )
        
        # Gera dados fictícios dos últimos 30 dias
        gerar_dados_ficticios(esp_ficticio.esp_id, usuario)
        
        return esp_ficticio
    except Usuario.DoesNotExist:
        return None

def gerar_dados_ficticios(esp_id, usuario):
    """Gera 180 leituras fictícias (6 por dia x 30 dias)"""
    
    for i in range(180):
        timestamp = datetime.now() - timedelta(hours=i*4)
        
        # MQ2 (Butano) - 800 a 2500 ppm
        DadosSensor_mq2.objects.create(
            usuario=usuario,
            c4h10_ppm=random.randint(800, 2500),
            dispositivo_id=esp_id,
            timestamp=timestamp
        )
        
        # MQ7 (CO) - 500 a 9000 ppm
        DadosSensor_mq7.objects.create(
            usuario=usuario,
            co_ppm=random.randint(500, 9000),
            dispositivo_id=esp_id,
            timestamp=timestamp
        )
        
        # MQ135 (NH3) - 10 a 350 ppm
        DadosSensor_mq135.objects.create(
            usuario=usuario,
            nh3_ppm=random.randint(10, 350),
            dispositivo_id=esp_id,
            timestamp=timestamp
        )

def criar_esp_real():
    """Identifica ESP real pelo ID específico"""
    ESP_REAL_ID = "ESP_REAL_AERIS_2025"
    return ESP_REAL_ID

def cadastrar_esp_real(usuario_id, esp_mac_address):
    """Cadastra ESP real com MAC address"""
    try:
        usuario = Usuario.objects.get(id_usuario=usuario_id)
        
        # Cria ESP real
        esp_real = DispositivoESP.objects.create(
            usuario=usuario,
            esp_id=esp_mac_address,  # Usa MAC como ID
            nome=f"ESP Real - {usuario.nome}",
            tipo="REAL"
        )
        
        return esp_real
    except Usuario.DoesNotExist:
        return None