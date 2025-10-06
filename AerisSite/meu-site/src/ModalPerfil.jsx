import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useESP } from './ESPContext';
import './ModalPerfil.css';

const ModalPerfil = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { espSelecionado, selecionarESP } = useESP();
  const [dispositivos, setDispositivos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const buscarDispositivos = () => {
    if (usuario) {
      fetch(`http://localhost:8000/api/dispositivos/?usuario_id=${usuario.id_usuario}`)
        .then(res => res.json())
        .then(data => setDispositivos(data.dispositivos || []))
        .catch(err => console.error('Erro ao buscar dispositivos:', err));
    }
  };

  const cadastrarNovoESP = async () => {
    if (!usuario) return;
    
    setCarregando(true);
    try {
      const response = await fetch('http://localhost:8000/api/cadastrar-esp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario_id: usuario.id_usuario })
      });
      
      if (response.ok) {
        buscarDispositivos();
        alert('ESP cadastrado com sucesso!');
      } else {
        alert('Erro ao cadastrar ESP');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar ESP');
    }
    setCarregando(false);
  };

  const cadastrarESPReal = async () => {
    if (!usuario) return;
    
    setCarregando(true);
    try {
      const response = await fetch('http://localhost:8000/api/cadastrar-esp-real/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          usuario_id: usuario.id_usuario,
          mac_address: '08:3A:F2:AC:1F:C8'
        })
      });
      
      if (response.ok) {
        buscarDispositivos();
        alert('ESP Real cadastrado com sucesso!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao cadastrar ESP Real');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao cadastrar ESP Real');
    }
    setCarregando(false);
  };

  const deletarESP = async (espId) => {
    if (!confirm('Tem certeza que deseja deletar este ESP? Todos os dados serão perdidos!')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/api/deletar-esp/${espId}/`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        buscarDispositivos();
        // Se deletou o ESP selecionado, limpar seleção
        if (espSelecionado && espSelecionado.id === espId) {
          selecionarESP(null);
        }
        alert('ESP deletado com sucesso!');
      } else {
        alert('Erro ao deletar ESP');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar ESP');
    }
  };

  useEffect(() => {
    if (isOpen) {
      buscarDispositivos();
    }
  }, [isOpen, usuario]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Perfil do Usuário</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="perfil-section">
            <h3>Informações do Perfil</h3>
            <p><strong>Nome:</strong> {usuario?.nome}</p>
            <p><strong>Email:</strong> {usuario?.email}</p>
          </div>

          <div className="dispositivos-section">
            <div className="dispositivos-header">
              <h3>Medidores Cadastrados</h3>
              <div className="botoes-esp">
                <button 
                  className="add-dispositivo-btn" 
                  onClick={cadastrarNovoESP}
                  disabled={carregando}
                >
                  {carregando ? 'Cadastrando...' : '+ ESP Demo'}
                </button>
                <button 
                  className="add-esp-real-btn" 
                  onClick={cadastrarESPReal}
                  disabled={carregando}
                >
                  {carregando ? 'Cadastrando...' : '+ ESP Real'}
                </button>
              </div>
            </div>
            {dispositivos.length > 0 ? (
              <ul className="dispositivos-list">
                {dispositivos.map(dispositivo => (
                  <li 
                    key={dispositivo.id} 
                    className={`dispositivo-item ${espSelecionado && espSelecionado.id === dispositivo.id ? 'selecionado' : ''}`}
                    onClick={() => selecionarESP(dispositivo)}
                  >
                    <div className="dispositivo-info">
                      <span className="dispositivo-nome">📡 {dispositivo.nome}</span>
                      <span className={`dispositivo-tipo ${dispositivo.tipo.toLowerCase()}`}>
                        {dispositivo.tipo === 'REAL' ? 'Real' : 'Demo'}
                      </span>
                      <span className="dispositivo-id">{dispositivo.esp_id}</span>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletarESP(dispositivo.id);
                      }}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-dispositivos">Nenhum medidor cadastrado</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          {espSelecionado && (
            <div className="esp-selecionado">
              ESP Selecionado: {espSelecionado.nome}
            </div>
          )}
          <button className="logout-btn" onClick={() => { 
            logout(); 
            onClose();
            navigate('/cadastro');
          }}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPerfil;