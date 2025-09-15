from django.core.management.base import BaseCommand
import paho.mqtt.client as mqtt
import math
from mq135.models import DadosSensor_mq135
from mq2.models import DadosSensor_mq2

MQTT_SERVER = "localhost"   # ajuste para o IP do seu broker
MQTT_PORT = 1883

def on_connect(client, userdata, flags, rc):
    print("Conectado ao broker MQTT")
    client.subscribe("sensores/mq135")
    client.subscribe("sensores/mq2")

def on_message(client, userdata, msg):
    payload = msg.payload.decode()
    print(f"[{msg.topic}] {payload}")

    try:
        Rs = float(payload)

        if msg.topic == "sensores/mq135":
            # Conversão Rs → ppm
            R0 = 165526.45
            A_CO2 = 116.6020682
            B_CO2 = -2.769034857
            ratio = Rs / R0
            ppm = A_CO2 * math.pow(ratio, B_CO2)

            DadosSensor_mq135.objects.create(
                co2_ppm=ppm,
                dispositivo_id="ESP32_MQ135"
            )
            print(f"MQ135 salvo no banco: {ppm:.2f} ppm")

        elif msg.topic == "sensores/mq2":
            R0 = 32830.0
            A_BUTANO = 97.0
            B_BUTANO = -0.46

            ratio = Rs / R0
            ppm_mq2 = A_BUTANO * math.pow(ratio, B_BUTANO)
            DadosSensor_mq2.objects.create(
                c4h10_ppm=ppm_mq2,
                dispositivo_id="ESP32_MQ2"
            )
            print(f"MQ2 salvo no banco: Rs = {Rs:.2f}")

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
