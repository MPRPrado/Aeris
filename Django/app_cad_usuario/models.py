from django.db import models
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    senha = models.CharField(max_length=128)
    
    def save(self, *args, **kwargs):
        if not self.senha.startswith('pbkdf2_'):
            self.senha = make_password(self.senha)
        super().save(*args, **kwargs)
