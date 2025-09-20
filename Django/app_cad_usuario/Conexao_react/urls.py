from django.urls import path, include
from rest_framework import routers
from .views import UsuarioViewSet,MQ2ViewSet, MQ135ViewSet, MQ7ViewSet

router = routers.DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'mq2', MQ2ViewSet)
router.register(r'mq135', MQ135ViewSet)
router.register(r'mq7', MQ7ViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
