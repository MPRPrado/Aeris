import os
import json

USUARIO_ATIVO_FILE = 'usuario_ativo.json'

def set_usuario_ativo(usuario_id, email):
    
    try:
        dados = {
            'usuario_id': usuario_id,
            'email': email
        }
        with open(USUARIO_ATIVO_FILE, 'w') as f:
            json.dump(dados, f)
        return True
    except Exception as e:
        print(f"Erro ao salvar usuário ativo: {e}")
        return False

def get_usuario_ativo():    
    try:
        if os.path.exists(USUARIO_ATIVO_FILE):
            with open(USUARIO_ATIVO_FILE, 'r') as f:
                dados = json.load(f)
                return dados
        return None
    except Exception as e:
        print(f"Erro ao buscar usuário ativo: {e}")
        return None