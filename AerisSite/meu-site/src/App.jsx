import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import CriarConta from './CriarConta';
import Login from './Login';
import TelaPrincipal from './TelaPrincipal';

// Componente para testar a API
function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/usuarios/") 
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {usuarios.map(user => (
          <li key={user.id}>{user.nome}</li>
        ))}
      </ul>
    </div>
  );
}

// Componente principal com rotas
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CriarConta />} />
      <Route path="/login" element={<Login />} />
      <Route path="/TelaPrincipal" element={<TelaPrincipal />} />
      <Route path="/usuarios" element={<ListaUsuarios />} /> {/* rota para testar API */}
    </Routes>
  );
}
