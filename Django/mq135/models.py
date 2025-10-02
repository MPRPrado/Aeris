from django.db import models
from app_cad_usuario.models import Usuario

class DadosSensor_mq135(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, null=True, blank=True)
    nh3_ppm = models.FloatField(verbose_name='NH3 (ppm)')
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
        return f"NH3: {self.nh3_ppm:.2f} ppm - {self.timestamp}"
