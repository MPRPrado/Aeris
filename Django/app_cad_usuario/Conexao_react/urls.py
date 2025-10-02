from django.urls import path, include
from rest_framework import routers
from .views import UsuarioViewSet,MQ2ViewSet, MQ135ViewSet, MQ7ViewSet, UsuarioAtivoAPI, DispositivosAPI, CadastrarESPAPI

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
]
