from rest_framework import viewsets
from rest_framework.decorators import action
from app_cad_usuario.models import Usuario
from .serializer import UsuarioSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from mq135.models import DadosSensor_mq135
from mq2.models import DadosSensor_mq2
from .serializer import MQ2Serializer
from .serializer import MQ135Serializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    @action(detail=False, methods=['get'])
    def relatorio(self, request):
        return Response({"usuarios": self.get_queryset().count()})

class SensorDataAPI(APIView):
    def post(self, request):
        co2_ppm = request.data.get("CO2_ppm")
        c4h10_ppm = request.data.get("C4H10_ppm")
        if c4h10_ppm is not None:
            DadosSensor_mq2.objects.create(c4h10_ppm=c4h10_ppm)
            return Response({"message": "Dados salvos com sucesso"}, status=status.HTTP_201_CREATED)
        if co2_ppm is not None:
            DadosSensor_mq135.objects.create(co2_ppm=co2_ppm)
            return Response({"message": "Dados salvos com sucesso"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Valor inválido"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def relatorio(self, request):
        from mq135.utils import gerar_relatorio as mq135_relatorio
        from mq2.utils import gerar_relatorio as mq2_relatorio
        return Response({
            "mq135": mq135_relatorio(),
            "mq2": mq2_relatorio()
        })

class MQ2ViewSet(viewsets.ModelViewSet):
    queryset = DadosSensor_mq2.objects.all().order_by('-timestamp')
    serializer_class = MQ2Serializer
    
class MQ135ViewSet(viewsets.ModelViewSet):
    queryset = DadosSensor_mq135.objects.all().order_by('-timestamp')
    serializer_class = MQ135Serializer

