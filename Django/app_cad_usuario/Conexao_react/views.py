from rest_framework import viewsets
from rest_framework.decorators import action
from app_cad_usuario.models import Usuario
from .serializer import UsuarioSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from mq135.models import DadosSensor

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    @action(detail=False, methods=['get'])
    def relatorio(self, request):
        usuarios = self.get_queryset()
        return Response({"usuarios": len(usuarios)})

class SensorDataAPI(APIView):
    def post(self, request):
        co2_ppm = request.data.get("CO2_ppm")
        if co2_ppm is not None:
            DadosSensor.objects.create(co2_ppm=co2_ppm)
            return Response({"message": "Dados salvos com sucesso"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Valor inválido"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def relatorio(self, request):
        from mq135.utils import gerar_relatorio
        return Response({"relatorio": gerar_relatorio()})
