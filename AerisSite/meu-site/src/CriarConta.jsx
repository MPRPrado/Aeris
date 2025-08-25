import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';

function CriarConta() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/usuarios/', {
        nome,
        email,
        senha,
      });
      console.log('Usuário criado:', response.data);
      navigate('/TelaPrincipal');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div id="root">
      <div style={{ alignSelf: 'center' }}>
        <h1 className="logoEris">
          <img src="/AerisLOGOsemBG 2.png" className="logo-img" />
          <span className="logo-eris-palavra">
            <span className="upside-down-v">V</span>eris
          </span>
        </h1>
        <p className="sub-frase">Inscreva-se em nossa plataforma!</p>
      </div>

      <form className="form-container" onSubmit={handleSubmit}>
        <p className="texto-acima">Nome Completo:</p>
        <div className="input-wrapper">
          <img src="/clipboard-user 1.png" className="input-icon" alt="ícone" />
          <input
            className="input-Escrita"
            type="text"
            placeholder="Insira seu nome:"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

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

        <button className="botao-criar-conta" style={{ marginTop: '2em' }} type="submit">
          Criar conta
        </button>
      </form>

      <button className="botao-link" type="button" onClick={() => navigate('/login')}>
        Já tem uma conta? Clique aqui para fazer login!
      </button>
    </div>
  );
}

export default CriarConta;
