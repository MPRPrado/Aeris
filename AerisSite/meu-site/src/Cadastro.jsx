import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

function Cadastro() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/usuarios/');
      const usuario = response.data.results.find(user => user.email === email);
      
      if (usuario) {
        await axios.post('http://127.0.0.1:8000/api/usuario-ativo/', {
          usuario_id: usuario.id_usuario,
          email: usuario.email
        });
        
        login(usuario);
        navigate('/TelaPrincipal');
      } else {
        setErro('Email não encontrado');
      }
    } catch (error) {
      setErro('Erro ao fazer login. Tente novamente.');
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/usuarios/', {
        nome,
        email,
        senha,
      });
      
      await axios.post('http://127.0.0.1:8000/api/usuario-ativo/', {
        usuario_id: response.data.id_usuario,
        email: response.data.email
      });
      
      login(response.data);
      navigate('/TelaPrincipal');
    } catch (error) {
      if (error.response?.status === 400) {
        setErro('Este e-mail já está cadastrado ou dados inválidos.');
      } else {
        setErro('Erro ao criar conta. Tente novamente.');
      }
    }
  };

  const irParaCadastro = () => {
    setTelaAtual('cadastro');
    setErro('');
    setEmail('');
    setSenha('');
    setNome('');
  };

  const voltarParaLogin = () => {
    setTelaAtual('login');
    setErro('');
    setEmail('');
    setSenha('');
    setNome('');
  };

  return (
    <div className={`cadastro-container ${telaAtual === 'cadastro' ? 'tela-cadastro' : ''}`}>
        {telaAtual === 'login' && (
          <>
          <div className="mensagens-container">
            <div className="logo-Eris">
              <img src="/AerisLOGOsemBG 2.png" className="logo-imagem" />
              <div className="logo-Eris-Palavra">
                <span className="v-virado">V</span>eris
              </div>
            </div>
            
            <div className="mensagem-entrar">
              <h1>Entre na sua conta</h1>
            </div>

            <div className="mensagem-usar-email">
              <h2>Use seu email e sua senha</h2>
            </div>
            
            {erro && <div style={{ color: 'red', textAlign: 'center', margin: '1em 0' }}>{erro}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="input-wrapper1">
                <img src="/envelopes (1) 1.png" className="input-icon" alt="ícone" />
                <input 
                  type="email" 
                  className="input-Escrita" 
                  placeholder="Digite seu email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="input-wrapper2">
                <img src="/lock-hashtag 1.png" className="input-icon" alt="ícone" />
                <input 
                  type={mostrarSenha ? 'text' : 'password'} 
                  className="input-Escrita" 
                  placeholder="Digite sua senha" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="mostrar-senha"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? 'Esconder' : 'Mostrar'}
                </button>
              </div>
              
              <button className="esqueceu-senha" type="button" onClick={() => setMostrarPopup(true)}>
                Esqueceu sua senha?
              </button>
              
              <button className="botao-entrar" type="submit">
                Entrar
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#FC991A', 
                  textDecoration: 'underline', 
                  cursor: 'pointer', 
                  fontSize: '1.2em',
                  marginTop: '1em',
                  marginLeft: '2em'
                }}
              >
                Voltar para a tela inicial
              </button>
            </form>
            </div>
          </>
        )}

        
        {mostrarPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2 className="titulo-popup">Redefinir Senha</h2>
              <input type="password" className="input-popup" placeholder="Nova senha" />
              <input type="password" className="input-popup" placeholder="Confirmar nova senha" />
              <button className="botao-confirmar" onClick={() => setMostrarPopup(false)}>Confirmar</button>
              <button className="botao-cancelar" onClick={() => setMostrarPopup(false)}>Cancelar</button>
            </div>
          </div>
        )}
        
        {telaAtual === 'cadastro' && (
          <>
          <div className="container-cadastro">
            <div className="logo-Cadastro">
              <img src="/AerisLOGOsemBG 2.png" className="logo-imagem-cadastro" />
              <div className="logo-Cadastro-Palavra">
                <span className="v-virado-cadastro">V</span>eris
              </div>
            </div>

            <div className="mensagem-cadastrar">
              <h1>Crie sua conta</h1>
            </div>

             <div className="mensagem-usar-email-cadastro">
              <h2>Use seu email e sua senha</h2>
            </div>

            {erro && <div style={{ color: 'red', textAlign: 'center', margin: '1em 0' }}>{erro}</div>}

            <form onSubmit={handleCadastro}>
              <div className="input-wrapper3">
                <img src="/user (1) 1.png" className="input-icon" alt="ícone" />
                <input 
                  type="text" 
                  className="input-Escrita" 
                  placeholder="Digite o nome da empresa" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrapper4">
                <img src="/envelopes (1) 1.png" className="input-icon" alt="ícone" />
                <input 
                  type="email" 
                  className="input-Escrita" 
                  placeholder="Digite seu email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-wrapper5">
                <img src="/lock-hashtag 1.png" className="input-icon" alt="ícone" />
                <input 
                  type={mostrarSenha ? 'text' : 'password'} 
                  className="input-Escrita" 
                  placeholder="Digite sua senha" 
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="mostrar-senha"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                >
                  {mostrarSenha ? 'Esconder' : 'Mostrar'}
                </button>
              </div>

              <button className="botao-entrar-cadastro" type="submit">
                Criar
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#FC991A', 
                  textDecoration: 'underline', 
                  cursor: 'pointer', 
                  fontSize: '1.2em',
                  marginTop: '1em',
                  marginLeft: '38em'
                }}
              >
                Voltar para a tela inicial
              </button>
            </form>

          </div>
          </>
        )}

      <div className={`caixa-laranja ${telaAtual === 'login' ? 'direita' : 'esquerda'}`}>
        <h1 className="titulo-bem-vindo">{telaAtual === 'login' ? 'Bem-vindo à plataforma!' : 'Bem-vindo de volta!'}</h1>
        <p className="subtitulo-cadastro">{telaAtual === 'login' ? 'Não tem uma conta? Crie agora para usar o AERIS!' : 'Já tem uma conta? Faça login!'}</p>
        <button className="botao-criar-conta" onClick={telaAtual === 'login' ? irParaCadastro : voltarParaLogin}>
          {telaAtual === 'login' ? 'Criar Conta' : 'Fazer Login'}
        </button>
      </div>
    </div>
  );
}

export default Cadastro;