from rest_framework import serializers
from app_cad_usuario.models import Usuario  # exemplo, troque pelo seu modelo

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'
