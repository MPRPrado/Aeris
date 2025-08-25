from django.contrib import admin
from django.urls import path, include
from app_cad_usuario import views as usuario_views
from wifi import views as wifi_views


urlpatterns = [
    path('', usuario_views.home, name ='home'),
    path('usuario/', usuario_views.usuario, name='listagem_usuarios'),
    path('login/', usuario_views.login, name='login'),
    path('tela_inicial/', usuario_views.tela_inicial, name='tela_inicial'),
    path('excluir-usuario/<int:id_usuario>/', usuario_views.excluir_usuario, name='excluir_usuario'),
    path('api/receber/', wifi_views.receber_dados, name='receber_dados'),
    path('api/', include('app_cad_usuario.Conexao_react.urls')),
]
