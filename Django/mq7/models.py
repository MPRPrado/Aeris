from django.db import models

class DadosSensor_mq7(models.Model):
    co_ppm = models.FloatField(verbose_name='CO (ppm)')
    timestamp = models.DateTimeField(auto_now_add=True)
    dispositivo_id = models.CharField(max_length=50, blank=True, default='ESP32_MQ7')
    
    class Meta:
        db_table = "mq7_dadossensor"   
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['timestamp']),
            models.Index(fields=['dispositivo_id']),
        ]
    
    def __str__(self):
        return f"CO: {self.co_ppm:.2f} ppm - {self.timestamp}"
