from django.contrib import admin
from .models import DispositivoESP

@admin.register(DispositivoESP)
class DispositivoESPAdmin(admin.ModelAdmin):
    list_display = ['esp_id', 'nome', 'usuario', 'tipo', 'ativo', 'criado_em']
    list_filter = ['tipo', 'ativo', 'criado_em']
    search_fields = ['esp_id', 'nome', 'usuario__nome']
