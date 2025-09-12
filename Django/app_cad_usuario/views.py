from django.shortcuts import render, redirect
from .models import Usuario
from django.contrib.auth.hashers import make_password, check_password
# Create your views here.
def home(request):
    return render(request, 'usuario/home.html')
def usuario(request):
    if request.method == 'POST':  
        nome = request.POST.get('nome')
        email = request.POST.get('email')
        senha = request.POST.get('senha')
        
        if not all([nome, email, senha]):
            contexto = {
                'usuarios': Usuario.objects.all(),
                'error': 'Todos os campos são obrigatórios.'
            }
            return render(request, 'usuario/usuario.html', contexto)
            
        if Usuario.objects.filter(email=email).exists():
            contexto = {
                'usuarios': Usuario.objects.all(),
                'error': 'Este e-mail já está cadastrado.'
            }
            return render(request, 'usuario/usuario.html', contexto)
            
        Usuario.objects.create(
            nome=nome,
            email=email,
            senha=senha
        )
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
        
        usuario = Usuario.objects.filter(email=email).first()
        
        if usuario and check_password(senha, usuario.senha):
            request.session['nome'] = usuario.nome
            return redirect('tela_inicial')
        
        return render(request, 'usuario/login.html', {'error': 'E-mail ou senha inválidos'})
    return render(request, 'usuario/login.html')

def tela_inicial(request):
    nome = request.session.get('nome', '')
    return render(request, 'usuario/tela_inicial.html', {'nome' : nome})