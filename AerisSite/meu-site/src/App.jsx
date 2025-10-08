import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Cadastro from './Cadastro';
import TelaPrincipal from './TelaPrincipal';
import Graficos01 from './sensor-mq2';
import Graficos02 from './sensor-mq7'; 
import Graficos03 from './sensor-mq135';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Navigate to="/cadastro" replace />} />
        <Route path="/TelaPrincipal" element={<TelaPrincipal />} />
        <Route path="/sensor-mq2" element={<Graficos01 />} />
        <Route path="/sensor-mq7" element={<Graficos02 />} />
        <Route path="/sensor-mq135" element={<Graficos03 />} />
      </Routes>
    </ThemeProvider>
  );
}