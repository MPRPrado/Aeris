import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const usuarioSalvo = localStorage.getItem('usuario_logado');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setLoading(false);
  }, []);

  const login = (dadosUsuario) => {
    // Se está trocando de usuário, limpar ESP selecionado
    if (usuario && usuario.id_usuario !== dadosUsuario.id_usuario) {
      localStorage.removeItem('esp_selecionado');
      localStorage.removeItem('tipo_esp');
    }
    
    setUsuario(dadosUsuario);
    localStorage.setItem('usuario_logado', JSON.stringify(dadosUsuario));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario_logado');
    // Limpar ESP ao fazer logout
    localStorage.removeItem('esp_selecionado');
    localStorage.removeItem('tipo_esp');
  };

  const value = {
    usuario,
    login,
    logout,
    isLoggedIn: !!usuario
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};