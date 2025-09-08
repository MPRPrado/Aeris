from django.core.management.base import BaseCommand
from datetime import timedelta
from django.utils import timezone
import random
from mq135.models import DadosSensor

class Command(BaseCommand):
    help = 'Cria dados de teste para o sensor MQ135'

    def handle(self, *args, **options):
        # Limpar dados existentes
        DadosSensor.objects.all().delete()
        
        # Criar dados das últimas 5 semanas
        for i in range(35):  # 35 dias
            for j in range(4):  # 4 leituras por dia
                data = timezone.now() - timedelta(days=i, hours=j*6)
                co2_valor = random.uniform(400, 1200)  # CO2 entre 400-1200 ppm
                
                DadosSensor.objects.create(
                    co2_ppm=co2_valor,
                    timestamp=data,
                    dispositivo_id='ESP32_MQ135'
                )

        total = DadosSensor.objects.count()
        self.stdout.write(
            self.style.SUCCESS(f'✅ Criados {total} registros de teste')
        )
        self.stdout.write('Acesse: http://127.0.0.1:8000/mq135/relatorio/')