from django.db import models

class DadosSensor_mq135(models.Model):
    co2_ppm = models.FloatField(verbose_name='CO2 (ppm)')
    timestamp = models.DateTimeField(auto_now_add=True)
    dispositivo_id = models.CharField(max_length=50, blank=True, default='ESP32_MQ135')
    
    class Meta:
        db_table = "mq135_dadossensor"   
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['dispositivo_id']),
        ]
    
    def __str__(self):
        return f"CO2: {self.co2_ppm:.2f} ppm - {self.timestamp}"
