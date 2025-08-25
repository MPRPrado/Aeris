from rest_framework import viewsets
from app_cad_usuario.models import Usuario
from .serializer import UsuarioSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
