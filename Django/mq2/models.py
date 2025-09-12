from django.db import models

class DadosSensor_mq2(models.Model):
    c4h10_ppm = models.FloatField(verbose_name='Butano (ppm)')
    timestamp = models.DateTimeField(auto_now_add=True)
    dispositivo_id = models.CharField(max_length=50, blank=True, default='ESP32_MQ2')

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['dispositivo_id']),
        ]

    def __str__(self):
        return f"Butano: {self.c4h10_ppm:.2f} ppm - {self.timestamp}"

