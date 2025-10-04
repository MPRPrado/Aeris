import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function Cadastro() {
  const [telaAtual, setTelaAtual] = useState('login');

  const irParaCadastro = () => {
    setTelaAtual('cadastro');
  };

  const voltarParaLogin = () => {
    setTelaAtual('login');
  };

  const navigate = useNavigate();

  const [mostrarPopup, setMostrarPopup] = useState(false);

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
            
            <div className="input-wrapper1">
              <img src="/envelopes (1) 1.png" className="input-icon" alt="ícone" />
              <input type="email" className="input-Escrita" placeholder="Digite seu email" />
            </div>
            
            <div className="input-wrapper2">
              <img src="/lock-hashtag 1.png" className="input-icon" alt="ícone" />
              <input type="password" className="input-Escrita" placeholder="Digite sua senha" />
              <button className="mostrar-senha">Mostrar</button>
            </div>
            
            <button className="esqueceu-senha" type="button" onClick={() => setMostrarPopup(true)}>
              Esqueceu sua senha?
            </button>
            
            <button className="botao-entrar" type="button" onClick={() => navigate('/TelaPrincipal')}>
              Entrar
              </button>
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
          <div className=".container-cadastro">
            <div className="logo-Cadastro">
              <img src="/AerisLOGOsemBG 2.png" className="logo-imagem-cadastro" />
              <div className="logo-Cadastro-Palavra">
                <span className="v-virado-cadastro">V</span>eris
              </div>
            </div>

            <div className="mensagem-cadastrar">
              <h1>Crie sua conta</h1>
            </div>

             <div className="mensagem-usar-email-cadastro ">
              <h2>Use seu email e sua senha</h2>
            </div>

            <div className="input-wrapper3">
              <img src="/user (1) 1.png" className="input-icon" alt="ícone" />
              <input type="text" className="input-Escrita" placeholder="Digite o nome da empresa" />
            </div>

            <div className="input-wrapper4">
              <img src="/envelopes (1) 1.png" className="input-icon" alt="ícone" />
              <input type="email" className="input-Escrita" placeholder="Digite seu email" />
            </div>

            <div className="input-wrapper5">
              <img src="/lock-hashtag 1.png" className="input-icon" alt="ícone" />
              <input type="password" className="input-Escrita" placeholder="Digite sua senha" />
              <button className="mostrar-senha">Mostrar</button>
            </div>

            <button className="botao-entrar-cadastro" type="button" onClick={() => navigate('/TelaPrincipal')}>
              Criar
              </button>

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