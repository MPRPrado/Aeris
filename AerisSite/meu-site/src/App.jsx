import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import CriarConta from './CriarConta';
import Login from './Login';
import TelaPrincipal from './TelaPrincipal';
import Graficos01 from './sensor-mq2';
import Graficos02 from './sensor-mq7'; 
import Graficos03 from './sensor-mq135'; 

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
      <Route path="/" element={<LandingPage />} />
      <Route path="/criar-conta" element={<CriarConta />} />
      <Route path="/login" element={<Login />} />
      <Route path="/TelaPrincipal" element={<TelaPrincipal />} />
      <Route path="/usuarios" element={<ListaUsuarios />} /> {/* rota para testar API */}
      <Route path="/sensor-mq2" element={<Graficos01 />} />
      <Route path="/sensor-mq7" element={<Graficos02 />} />
      <Route path="/sensor-mq135" element={<Graficos03 />} />
    </Routes>
  );
}
