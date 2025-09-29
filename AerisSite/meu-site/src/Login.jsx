import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

export default function Login() { 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    
    try {
      // Buscar todos os usuários
      const response = await axios.get('http://127.0.0.1:8000/api/usuarios/');
      
      // Encontrar usuário por email
      const usuario = response.data.results.find(user => user.email === email);
      
      if (usuario) {
        // Definir usuário ativo no backend
        await axios.post('http://127.0.0.1:8000/api/usuario-ativo/', {
          usuario_id: usuario.id_usuario,
          email: usuario.email
        });
        
        // Fazer login no frontend
        login(usuario);
        navigate('/TelaPrincipal');
      } else {
        setErro('Email não encontrado');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErro('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <form id="root" onSubmit={handleSubmit}>
      <div style={{ alignSelf: 'center' }}>
        <h1 className="logoEris">
          <img src="/AerisLOGOsemBG 2.png" className="logo-img" alt="Logo" />
          <span className="logo-eris-palavra">
            <span className="upside-down-v">V</span>eris
          </span>
        </h1>
        <p className="sub-frase">Bem-vindo de volta a nossa plataforma!</p>
        <p className="sub-sub-frase">Entre na sua conta para continuar</p>
      </div>

      {erro && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '1em' }}>
          {erro}
        </div>
      )}

      {/* Primeira caixa de texto, um pouco abaixo */}
      <div className="form-container" style={{ marginTop: '2em' }}>
        <p className="texto-acima">E-mail:</p>
        <div className="input-wrapper">
          <img src="/envelopes (1) 1.png" className="input-icon" alt="ícone" />
          <input
            className="input-Escrita"
            type="text"
            placeholder="Insira seu e-mail:"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Segunda caixa de texto, um pouco abaixo */}
      <div className="form-container" style={{ marginTop: '2em' }}>
        <p className="texto-acima">Senha:</p>
        <div className="input-wrapper">
          <img src="/lock-hashtag 1.png" className="input-icon" alt="ícone" />
          <input
            className="input-Escrita"
            type={mostrarSenha ? 'text' : 'password'}
            placeholder="Insira sua senha:"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="mostrar-senha"
          >
            {mostrarSenha ? 'Esconder' : 'Mostrar'}
          </button>
        </div>
      </div>

      {/* Botão abaixo das caixas de texto */}
      <button
        className="botao-criar-conta"
        style={{ marginTop: '3em' }}
        type="submit"
      >
        Entre na sua conta
      </button>

      {/* Botão de já tem conta? */}
      <button
        className="botao-link"
        type="button"
        onClick={() => navigate('/criar-conta')}
      >
        Não tem uma conta? Clique aqui para fazer cadastro!
      </button>
      
      <button
        className="botao-link"
        type="button"
        onClick={() => navigate('/')}
        style={{marginTop: '1rem'}}
      >
        Voltar à página inicial
      </button>
    </form>
  );
}
