from rest_framework import viewsets
from rest_framework.decorators import action
from app_cad_usuario.models import Usuario, DispositivoESP
from app_cad_usuario.esp_utils import funcao_cad_esp
from .serializer import UsuarioSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from mq135.models import DadosSensor_mq135
from mq2.models import DadosSensor_mq2
from mq7.models import DadosSensor_mq7
from .serializer import MQ2Serializer
from .serializer import MQ135Serializer
from .serializer import MQ7Serializer
from usuario_ativo import set_usuario_ativo, get_usuario_ativo

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    @action(detail=False, methods=['get'])
    def relatorio(self, request):
        return Response({"usuarios": self.get_queryset().count()})

class SensorDataAPI(APIView):
    def post(self, request):
        co_ppm = request.data.get("CO_ppm")
        c4h10_ppm = request.data.get("C4H10_ppm")
        nh3_ppm = request.data.get("NH3_ppm")
        esp_id = request.data.get("esp_id", "ESP_REAL_AERIS_2025")  # ID do ESP
        
        # Buscar qual usuário possui este ESP
        try:
            dispositivo = DispositivoESP.objects.get(esp_id=esp_id)
            usuario = dispositivo.usuario
        except DispositivoESP.DoesNotExist:
            # Se ESP não existe, usar usuário ativo
            usuario_ativo = get_usuario_ativo()
            if not usuario_ativo:
                return Response({"error": "Nenhum usuário ativo"}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                usuario = Usuario.objects.get(id_usuario=usuario_ativo['usuario_id'])
            except Usuario.DoesNotExist:
                return Response({"error": "Usuário ativo não encontrado"}, status=status.HTTP_400_BAD_REQUEST)
        
        if c4h10_ppm is not None:
            DadosSensor_mq2.objects.create(
                usuario=usuario,
                c4h10_ppm=c4h10_ppm,
                dispositivo_id=esp_id
            )
            return Response({"message": "Dados MQ2 salvos com sucesso"}, status=status.HTTP_201_CREATED)
        if co_ppm is not None:
            DadosSensor_mq7.objects.create(
                usuario=usuario,
                co_ppm=co_ppm,
                dispositivo_id=esp_id
            )
            return Response({"message": "Dados MQ7 salvos com sucesso"}, status=status.HTTP_201_CREATED)
        if nh3_ppm is not None:
            DadosSensor_mq135.objects.create(
                usuario=usuario,
                nh3_ppm=nh3_ppm,
                dispositivo_id=esp_id
            )
            return Response({"message": "Dados MQ135 salvos com sucesso"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Valor inválido"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def relatorio(self, request):
        from mq135.utils import gerar_relatorio as mq135_relatorio
        from mq2.utils import gerar_relatorio as mq2_relatorio
        from mq7.utils import gerar_relatorio as mq7_relatorio
        return Response({
            "mq135": mq135_relatorio(),
            "mq2": mq2_relatorio(),
            "mq7": mq7_relatorio()
        })

class MQ2ViewSet(viewsets.ModelViewSet):
    queryset = DadosSensor_mq2.objects.all().order_by('-timestamp')
    serializer_class = MQ2Serializer
    
class MQ135ViewSet(viewsets.ModelViewSet):
    queryset = DadosSensor_mq135.objects.all().order_by('-timestamp')
    serializer_class = MQ135Serializer
    
class MQ7ViewSet(viewsets.ModelViewSet):
    queryset = DadosSensor_mq7.objects.all().order_by('-timestamp')
    serializer_class = MQ7Serializer

class UsuarioAtivoAPI(APIView):
    def post(self, request):
        """Define qual usuário está ativo"""
        usuario_id = request.data.get('usuario_id')
        email = request.data.get('email')
        
        if usuario_id and email:
            if set_usuario_ativo(usuario_id, email):
                return Response({'message': 'Usuário ativo definido'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'Dados inválidos'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        """Retorna qual usuário está ativo"""
        usuario_ativo = get_usuario_ativo()
        if usuario_ativo:
            return Response(usuario_ativo, status=status.HTTP_200_OK)
        return Response({'message': 'Nenhum usuário ativo'}, status=status.HTTP_404_NOT_FOUND)

class DispositivosAPI(APIView):
    def get(self, request):
        """Buscar dispositivos de um usuário"""
        usuario_id = request.GET.get('usuario_id')
        
        if not usuario_id:
            return Response({'error': 'usuario_id obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            usuario = Usuario.objects.get(id_usuario=usuario_id)
            dispositivos = DispositivoESP.objects.filter(usuario=usuario)
            
            dispositivos_data = [{
                'id': disp.id,
                'esp_id': disp.esp_id,
                'nome': disp.nome,
                'tipo': disp.tipo,
                'ativo': disp.ativo,
                'criado_em': disp.criado_em.isoformat()
            } for disp in dispositivos]
            
            return Response({
                'dispositivos': dispositivos_data,
                'total': len(dispositivos_data)
            })
            
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

class CadastrarESPAPI(APIView):
    def post(self, request):
        """Cadastrar novo ESP para usuário"""
        usuario_id = request.data.get('usuario_id')
        
        if not usuario_id:
            return Response({'error': 'usuario_id obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Criar novo ESP
        esp = funcao_cad_esp(usuario_id)
        
        if esp:
            return Response({
                'success': True,
                'esp': {
                    'id': esp.id,
                    'esp_id': esp.esp_id,
                    'nome': esp.nome,
                    'tipo': esp.tipo
                }
            })
        else:
            return Response({'error': 'Erro ao criar ESP ou limite atingido'}, status=status.HTTP_400_BAD_REQUEST)

class DeletarESPAPI(APIView):
    def delete(self, request, esp_id):
        """Deletar ESP do usuário"""
        try:
            dispositivo = DispositivoESP.objects.get(id=esp_id)
            
            # Deletar todos os dados do sensor
            DadosSensor_mq2.objects.filter(dispositivo_id=dispositivo.esp_id).delete()
            DadosSensor_mq7.objects.filter(dispositivo_id=dispositivo.esp_id).delete()
            DadosSensor_mq135.objects.filter(dispositivo_id=dispositivo.esp_id).delete()
            
            # Deletar o dispositivo
            dispositivo.delete()
            
            return Response({'success': True, 'message': 'ESP deletado com sucesso'})
            
        except DispositivoESP.DoesNotExist:
            return Response({'error': 'ESP não encontrado'}, status=status.HTTP_404_NOT_FOUND)

class CadastrarESPRealAPI(APIView):
    def post(self, request):
        """Cadastrar ESP real com MAC address"""
        usuario_id = request.data.get('usuario_id')
        mac_address = request.data.get('mac_address', '08:3A:F2:AC:1F:C8')  # MAC padrão
        
        if not usuario_id:
            return Response({'error': 'usuario_id obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            usuario = Usuario.objects.get(id_usuario=usuario_id)
            
            # Verificar se ESP real já existe
            if DispositivoESP.objects.filter(esp_id=mac_address).exists():
                return Response({'error': 'ESP real já cadastrado'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar ESP real
            esp_real = DispositivoESP.objects.create(
                usuario=usuario,
                esp_id=mac_address,
                nome=f"ESP Real - {usuario.nome}",
                tipo="REAL"
            )
            
            return Response({
                'success': True,
                'esp': {
                    'id': esp_real.id,
                    'esp_id': esp_real.esp_id,
                    'nome': esp_real.nome,
                    'tipo': esp_real.tipo
                }
            })
            
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

