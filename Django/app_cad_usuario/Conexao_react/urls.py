from django.urls import path, include
from rest_framework import routers
from .views import UsuarioViewSet,MQ2ViewSet, MQ135ViewSet, MQ7ViewSet, UsuarioAtivoAPI, DispositivosAPI, CadastrarESPAPI, DeletarESPAPI, CadastrarESPRealAPI, DadosDemoAPI

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'mq2', MQ2ViewSet)
router.register(r'mq135', MQ135ViewSet)
router.register(r'mq7', MQ7ViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('usuario-ativo/', UsuarioAtivoAPI.as_view(), name='usuario-ativo'),
    path('dispositivos/', DispositivosAPI.as_view(), name='dispositivos'),
    path('cadastrar-esp/', CadastrarESPAPI.as_view(), name='cadastrar-esp'),
    path('cadastrar-esp-real/', CadastrarESPRealAPI.as_view(), name='cadastrar-esp-real'),
    path('deletar-esp/<int:esp_id>/', DeletarESPAPI.as_view(), name='deletar-esp'),
    path('dados-demo/', DadosDemoAPI.as_view(), name='dados-demo'),
]
