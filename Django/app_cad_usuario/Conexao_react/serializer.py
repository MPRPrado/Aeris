from rest_framework import serializers
from app_cad_usuario.models import Usuario
from mq135.models import DadosSensor_mq135
from mq2.models import DadosSensor_mq2

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nome', 'email']  # Excluindo senha

class MQ2Serializer(serializers.ModelSerializer):
    class Meta:
        model = DadosSensor_mq2
        fields = ['id', 'c4h10_ppm', 'timestamp']  
class MQ135Serializer(serializers.ModelSerializer):
    class Meta:
        model = DadosSensor_mq135
        fields = ['id', 'co2_ppm', 'timestamp']  