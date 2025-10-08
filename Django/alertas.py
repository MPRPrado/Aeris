from django.core.mail import send_mail
from django.conf import settings

def enviar_alerta_email(valor_ppm, sensor_tipo, usuario_email):
    """
    Envia email de alerta quando sensor passa do nível médio
    """
    # Definir limites por sensor
    limites = {
        'mq2': 5000,   # Butano
        'mq7': 8000,   # Monóxido de Carbono  
        'mq135': 1300   # CO2
    }
    
    limite = limites.get(sensor_tipo, 0)
    
    # Só envia se passou do limite
    if valor_ppm > limite:
        try:
            send_mail(
                subject=f'🚨 ALERTA AERIS: {sensor_tipo.upper()} - Nível Alto Detectado',
                message=f'''
                ATENÇÃO! Concentração elevada detectada:
                
                Sensor: {sensor_tipo.upper()}
                Valor atual: {valor_ppm} ppm
                Limite seguro: {limite} ppm
                
                Recomendamos verificar a ventilação do ambiente imediatamente.
                
                Sistema AERIS
                ''',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[usuario_email],
                fail_silently=False,
            )
            print(f"✅ Email de alerta enviado para {usuario_email}")
            return True
        except Exception as e:
            print(f"❌ Erro ao enviar email: {e}")
            return False
    
    return False  # Não enviou (valor dentro do limite)