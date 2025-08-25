import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() { 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação
    try {
      await axios.get('http://127.0.0.1:8000/api/usuarios/', {
        email,
        senha,
      });
      console.log('E-mail:', email);
      console.log('Senha:', senha);
      navigate('/TelaPrincipal');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao fazer login. Tente novamente.');
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
        onClick={() => navigate('/')}
      >
        Não tem uma conta? Clique aqui para fazer cadastro!
      </button>
    </form>
  );
}
