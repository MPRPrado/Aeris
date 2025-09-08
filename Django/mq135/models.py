from django.db import models

class DadosSensor(models.Model):
    co2_ppm = models.FloatField(verbose_name='CO2 (ppm)')
    timestamp = models.DateTimeField(auto_now_add=True)
    dispositivo_id = models.CharField(max_length=50, blank=True, default='ESP32_MQ135')
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['dispositivo_id']),
        ]
    
    def __str__(self):
        return f"CO2: {self.co2_ppm} ppm - {self.timestamp}"
