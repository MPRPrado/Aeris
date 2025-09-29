
from app_cad_usuario.models import Usuario
from usuario_ativo import get_usuario_ativo

def get_usuario_logado(): 
    try:
        # Buscar usuário ativo do arquivo
        usuario_ativo = get_usuario_ativo()
        if usuario_ativo:
            usuario = Usuario.objects.filter(email=usuario_ativo['email']).first()
            return usuario
        
        # Fallback: último usuário cadastrado
        return Usuario.objects.order_by('-id_usuario').first()
    except Exception as e:
        print(f"Erro ao buscar usuário logado: {e}")
        return None

def set_usuario_logado(email):
    """
    Define qual usuário está logado (para uso futuro)
    """
    try:
        usuario = Usuario.objects.filter(email=email).first()
        if usuario:
            # Aqui você poderia salvar em cache/sessão
            print(f"Usuário {usuario.nome} está logado")
            return usuario
    except Exception as e:
        print(f"Erro ao definir usuário logado: {e}")
    return None