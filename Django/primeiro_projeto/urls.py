from django.contrib import admin
from django.urls import path, include
from app_cad_usuario import views as usuario_views
from mq135 import views as mq135_views
from mq2 import views as mq2_views


urlpatterns = [
    path('', usuario_views.home, name='home'),
    path('usuario/', usuario_views.usuario, name='listagem_usuarios'),
    path('login/', usuario_views.login, name='login'),
    path('tela_inicial/', usuario_views.tela_inicial, name='tela_inicial'),
    path('excluir-usuario/<int:id_usuario>/', usuario_views.excluir_usuario, name='excluir_usuario'),

    # MQ-135
    path('api/receber/mq135', mq135_views.receber_dados, name='receber_dados_mq135'),
    path('mq135/', mq135_views.mostrar_dados, name='mostrar_dados_mq135'), 
    path('mq135/prever/<int:contador>/', mq135_views.prever_dados_mensal, name='prever_dados_mq135'),

    # MQ-2
    path('api/receber/mq2/', mq2_views.receber_dados, name='receber_dados_mq2'),
    path('mq2/', mq2_views.mostrar_dados, name='mostrar_dados_mq2'),
    path('mq2/prever/<int:contador>/', mq2_views.prever_dados_mensal, name='prever_dados_mq2'),
]