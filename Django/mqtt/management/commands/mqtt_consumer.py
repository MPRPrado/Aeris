from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import math
from mq135.models import DadosSensor_mq135
from mq2.models import DadosSensor_mq2
from mq7.models import DadosSensor_mq7
from alertas import enviar_alerta_email

MQTT_SERVER = "localhost"   # ajuste para o IP do seu broker
MQTT_PORT = 1883

def on_connect(client, userdata, flags, rc):
    print("Conectado ao broker MQTT")
    #client.subscribe("sensores/mq135")
    client.subscribe("sensores/mq2")
    #client.subscribe("sensores/mq7")

def on_message(client, userdata, msg):
    payload = msg.payload.decode().strip()
    print(f"[{msg.topic}] {payload}")
    try:
        ppm = float(payload)

        if msg.topic == "sensores/mq135":
            DadosSensor_mq135.objects.create(
                nh3_ppm=ppm,
                dispositivo_id="ESP32_MQ135"
            )
            print(f"MQ135 salvo no banco: {ppm:.2f} ppm NH3")
            
            # Verificar alerta
            enviar_alerta_email(ppm, 'mq135', 'usuario@email.com')

        elif msg.topic == "sensores/mq2":          
            DadosSensor_mq2.objects.create(
                c4h10_ppm=ppm,
                dispositivo_id="ESP32_MQ2"
            )
            print(f"MQ2 salvo no banco: Rs = {ppm:.2f}")
            
            # Verificar alerta
            enviar_alerta_email(ppm, 'mq2', 'usuario@email.com')
       
        elif msg.topic == "sensores/mq7":
            DadosSensor_mq7.objects.create(
            co_ppm=ppm,
            dispositivo_id="ESP32_MQ7"
            )
            print(f"MQ7 salvo no banco: Rs = {ppm:.2f}, ppm = {ppm:.2f}")
            
            # Verificar alerta
            enviar_alerta_email(ppm, 'mq7', 'usuario@email.com')

    except ValueError:
        print("Erro: payload inválido")

class Command(BaseCommand):
    help = "Inicia o consumidor MQTT para os sensores"

    def handle(self, *args, **options):
        client = mqtt.Client()
        client.on_connect = on_connect
        client.on_message = on_message
        client.connect(MQTT_SERVER, MQTT_PORT, 60)
        client.loop_forever()
