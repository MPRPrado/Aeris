from django.db import models
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    senha = models.CharField(max_length=128)
    codigo_recuperacao = models.CharField(max_length=6, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.senha.startswith('pbkdf2_'):
            self.senha = make_password(self.senha)
        super().save(*args, **kwargs)

class DispositivoESP(models.Model):
    TIPO_CHOICES = [
        ('REAL', 'ESP Real'),
        ('DEMO', 'Dados Fictícios')
    ]
    
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='dispositivos')
    esp_id = models.CharField(max_length=50)
    nome = models.CharField(max_length=100)
    tipo = models.CharField(max_length=4, choices=TIPO_CHOICES, default='DEMO')
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Dispositivo ESP'
        verbose_name_plural = 'Dispositivos ESP'
        unique_together = [['usuario', 'esp_id']]
    
    def __str__(self):
        return f"{self.nome} ({self.esp_id}) - {self.usuario.nome}"
