from rest_framework import serializers
from app_cad_usuario.models import Usuario
from mq135.models import DadosSensor_mq135
from mq2.models import DadosSensor_mq2
from mq7.models import DadosSensor_mq7

class UsuarioSerializer(serializers.ModelSerializer):
    senha = serializers.CharField(write_only=True)
    
    class Meta:
        model = Usuario
        fields = ['id_usuario', 'nome', 'email', 'senha']
        extra_kwargs = {'senha': {'write_only': True}}
    
    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está cadastrado.")
        return value
    
    def create(self, validated_data):
        usuario = Usuario(
            nome=validated_data['nome'],
            email=validated_data['email'],
            senha=validated_data['senha']
        )
        usuario.save()  # O modelo já faz o hash da senha
        return usuario

class MQ2Serializer(serializers.ModelSerializer):
    class Meta:
        model = DadosSensor_mq2
        fields = ['id', 'c4h10_ppm', 'timestamp']  
class MQ135Serializer(serializers.ModelSerializer):
    class Meta:
        model = DadosSensor_mq135
        fields = ['id', 'nh3_ppm', 'timestamp']  
class MQ7Serializer(serializers.ModelSerializer):
    class Meta:
        model = DadosSensor_mq7
        fields = ['id', 'co_ppm', 'timestamp']