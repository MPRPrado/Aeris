import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ESPContext = createContext();

export const useESP = () => {
  const context = useContext(ESPContext);
  if (!context) {
    throw new Error('useESP deve ser usado dentro de ESPProvider');
  }
  return context;
};

export const ESPProvider = ({ children }) => {
  const [espSelecionado, setEspSelecionado] = useState(null);
  const [tipoESP, setTipoESP] = useState('DEMO'); // DEMO ou REAL
  const { usuario } = useAuth();

  // Carregar ESP selecionado do localStorage
  useEffect(() => {
    const espSalvo = localStorage.getItem('esp_selecionado');
    const tipoSalvo = localStorage.getItem('tipo_esp');
    
    if (espSalvo) {
      setEspSelecionado(JSON.parse(espSalvo));
    }
    if (tipoSalvo) {
      setTipoESP(tipoSalvo);
    }
  }, []);

  // Limpar ESP quando usuário mudar ou fazer logout
  useEffect(() => {
    const espSalvo = localStorage.getItem('esp_selecionado');
    if (!espSalvo) {
      // Se não há ESP salvo, limpar estado
      setEspSelecionado(null);
      setTipoESP('DEMO');
    }
  }, [usuario]);

  const selecionarESP = (esp) => {
    setEspSelecionado(esp);
    setTipoESP(esp.tipo);
    
    // Salvar no localStorage
    localStorage.setItem('esp_selecionado', JSON.stringify(esp));
    localStorage.setItem('tipo_esp', esp.tipo);
  };

  const limparESP = () => {
    setEspSelecionado(null);
    setTipoESP('DEMO');
    localStorage.removeItem('esp_selecionado');
    localStorage.removeItem('tipo_esp');
  };

  const value = {
    espSelecionado,
    tipoESP,
    selecionarESP,
    limparESP,
    isDemo: tipoESP === 'DEMO',
    isReal: tipoESP === 'REAL'
  };

  return (
    <ESPContext.Provider value={value}>
      {children}
    </ESPContext.Provider>
  );
};