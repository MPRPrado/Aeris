from django.shortcuts import render, redirect
from .models import Usuario
from django.contrib.auth.hashers import make_password, check_password
# Create your views here.
def home(request):
    return render(request, 'usuario/home.html')
def usuario(request):
    if request.method == 'POST':  
        email = request.POST.get('email')
        if Usuario.objects.filter(email=email).exists():
            contexto = {
                'error': 'E-mail já cadastrado.',
                'usuarios': Usuario.objects.all()
            }
        novo_usuario = Usuario()
        novo_usuario.nome = request.POST.get('nome')
        novo_usuario.email = email
        novo_usuario.senha = make_password(request.POST.get('senha'))
        novo_usuario.save()
        return redirect('listagem_usuarios')
    contexto = {
        'usuarios': Usuario.objects.all()
    }
    return render(request, 'usuario/usuario.html', contexto)

def excluir_usuario(request, id_usuario):
    if request.method == 'POST':
        try:
            usuario = Usuario.objects.get(id_usuario=id_usuario)
            usuario.delete()
            return redirect('listagem_usuarios')
        except Usuario.DoesNotExist:
            return redirect('listagem_usuarios')

def login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        
        # Debug: imprimir valores recebidos
        print(f"=== DEBUG LOGIN ===")
        print(f"Email recebido: {email}")
        print(f"Senha recebida: {senha}")
        
        usuario = Usuario.objects.filter(email=email).first()
        
        if usuario:
            print(f"Usuário encontrado: {usuario.nome}")
            print(f"Email no banco: {usuario.email}")
            print(f"Senha no banco: {usuario.senha}")
            print(f"Senha digitada: {senha}")
            print(f"Senhas iguais? {usuario.senha == senha}")
            
            # Tenta autenticar
            if usuario.senha == senha:
                print("Login bem-sucedido com senha direta")
                request.session['nome'] = usuario.nome
                return redirect('tela_inicial')
            elif check_password(senha, usuario.senha):
                print("Login bem-sucedido com senha criptografada")
                request.session['nome'] = usuario.nome
                return redirect('tela_inicial')
            else:
                print("Senha incorreta")
        else:
            print("Usuário não encontrado")
        
        return render(request, 'usuario/login.html', {'error': 'E-mail ou senha inválidos'})
    return render(request, 'usuario/login.html')

def tela_inicial(request):
    nome = request.session.get('nome', '')
    return render(request, 'usuario/tela_inicial.html', {'nome' : nome})