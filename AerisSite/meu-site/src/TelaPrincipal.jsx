import './App.css'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/usuarios/');
        if (response.data && response.data.results && response.data.results.length > 0) {
          setNomeUsuario(response.data.results[0].nome);
          localStorage.setItem('usuario', JSON.stringify(response.data.results[0]));
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        const savedUser = localStorage.getItem('usuario');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setNomeUsuario(userData.nome);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="tela-principal-fixa">
      <div className="logoErisPequena">
        <img
          src="/AerisLOGOsemBG 2.png"
          className="logo-img-pequena"
          alt="Logo Aeris"
        />
        <span className="logo-eris-palavra-pequena">
          <span className="upside-down-v-pequena">V</span>eris
        </span>
      </div>

      <div className="frasePequena">
        Bem-vindo {nomeUsuario || 'usuário'}!
      </div>

      {/* Usuário no canto direito */}
      <div className="usuarioContainer">
        <span>{nomeUsuario}</span>
        <img src="/user (1) 1.png" alt="Ícone Usuário" />
      </div>

      <div className="fraseSensoresConectados">
        Sensores Conectados:
        <div className="linha-horizontal"></div>
      </div>

      <div className="fraseVejaRelatorios">
        Veja os relatórios e gráficos da emissão dos gases selecionando os sensores abaixo
      </div>

      <div className="sensoresContainer">
        <div className="circuloComFrase">
          <div className="circuloLaranja"></div>
          <div className="textoSensorContainer">
            <span
              className="textoCirculo botaoSensor"
              onClick={() => navigate('/sensor-mq2')}
            >
              Sensor MQ2 - Dados de captação: Butano (C4H10)
            </span>
            <span className="textoMenor">Gráfico e relatório disponíveis</span>
            <div className="linhaAbaixoTextoMenor"></div>
          </div>
        </div>

        <div className="circuloComFrase">
          <div className="circuloLaranja"></div>
          <div className="textoSensorContainer">
            <span
              className="textoCirculo botaoSensor"
              onClick={() => navigate('/sensor-mq7')}
            >
              Sensor MQ7 - Dados de captação: Propano(C3h8)
            </span>
            <span className="textoMenor">Gráfico e relatório disponíveis</span>
            <div className="linhaAbaixoTextoMenor"></div>
          </div>
        </div>

        <div className="circuloComFrase">
          <div className="circuloLaranja"></div>
          <div className="textoSensorContainer">
            <span
              className="textoCirculo botaoSensor"
              onClick={() => navigate('/sensor-mq135')}
            >
              Sensor MQ135 - Dados de captação: Amônia(NH3)
            </span>
            <span className="textoMenor">Gráfico e relatório disponíveis</span>
            <div className="linhaAbaixoTextoMenor"></div>
          </div>
        </div>
      </div>

      <div className="mensagemFixa">
        <h2>Informações Gerais dos Sensores</h2>
        <p>
          Aqui você pode acompanhar os dados em tempo real de todos os sensores conectados ao sistema,
          analisar gráficos detalhados e gerar relatórios para monitoramento ambiental.
          Fique atento às atualizações para garantir a qualidade do ar e a segurança do ambiente.
        </p>
      </div>

      <div className="suporteContainer">
        <p className="textoSuporte">
          Está enfrentando algum tipo de problema? Entre em contato com o suporte da equipe Aeris pelo botão abaixo
        </p>
        <button
          className="botaoSuporte"
          onClick={() => navigate('/contato-suporte')}
        >
          Contate o Suporte
        </button>
      </div>
    </div>
  )
}

export default App
