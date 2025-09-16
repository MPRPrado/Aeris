// src/App.jsx
import React, { useState, useEffect } from "react";
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Estado inicial como array vazio
const dadosIniciais = [];

function DiamondDot(props) {
  const { cx, cy, stroke, fill, payload } = props;
  // Só desenha o diamante se houver valor de previsão
  if (payload.previsao == null) return null;
  return (
    <svg x={cx - 6} y={cy - 6} width={12} height={12} viewBox="0 0 12 12">
      <polygon
        points="6,0 12,6 6,12 0,6"
        stroke={stroke}
        fill={fill || "#fff"}
        strokeWidth={2}
      />
    </svg>
  );
}

function Graficos01() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(dadosIniciais);
  const [contador, setContador] = useState(0);
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
    const buscarDados = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mq2/');
        if (!response.data || !response.data.results) {
          console.log('Nenhum dado disponível');
          return;
        }

        const dadosFormatados = response.data.results.map((item) => ({
          nome: new Date(item.timestamp).toLocaleTimeString(),
          valor: parseFloat(item.c4h10_ppm),
          timestamp: item.timestamp,
          previsao: null // inicialmente null para todos os pontos
        }));

        // Ordenar por timestamp
        dadosFormatados.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Pegar os últimos 30 registros para dados reais
        const dadosRecentes = dadosFormatados.slice(-30);

        // Adicionar previsões para os próximos 5 pontos
        const ultimoValor = dadosRecentes[dadosRecentes.length - 1].valor;
        const tendencia = (dadosRecentes[dadosRecentes.length - 1].valor - dadosRecentes[0].valor) / dadosRecentes.length;

        for (let i = 1; i <= 5; i++) {
          const ultimaData = new Date(dadosRecentes[dadosRecentes.length - 1].timestamp);
          const novaData = new Date(ultimaData.getTime() + i * 5000); // 5 segundos de intervalo

          dadosRecentes.push({
            nome: novaData.toLocaleTimeString(),
            valor: null, // valor real é null para pontos futuros
            previsao: ultimoValor + tendencia * i,
            timestamp: novaData.toISOString()
          });
        }

        setDados(dadosRecentes);
        setContador(response.data.count);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    buscarDados();
    const intervalo = setInterval(buscarDados, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="pagina-sensor">
      <div className="topo-sensor">
        {/* Logo */}
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
        {/* Usuário - Modificação aqui */}
        <div className="usuarioContainer">
          <span>{nomeUsuario}</span>
          <img src="/user (1) 1.png" alt="Ícone Usuário" />
        </div>
      </div>

      {/* Caixas e conteúdo */}
      <div className="container-duas-caixas-nao-centralizadas">
        <div className="caixa-central-sensor">
          <div className="frase-topo-caixa-maior">
            Sensor MQ2 - Dados de captação: Butano (C4H10)
          </div>
          {/* Gráfico abaixo da frase */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "50px" }}>
            <LineChart width={700} height={430} data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nome" 
                angle={-45} 
                textAnchor="end" 
                dy={10}
                interval={Math.ceil(dados.length / 10)} // Mostrar apenas 10 labels no eixo X
              />
              <YAxis 
                domain={[0, 'auto']}
                label={{ value: 'PPM', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (value === null) return ['N/A'];
                  return [`${value.toFixed(2)} ppm`, name === 'previsao' ? 'Previsão' : 'Concentração'];
                }}
                labelFormatter={(label) => `Hora: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#ffac75"
                strokeWidth={2}
                name="C4H10 PPM"
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="previsao"
                stroke="#82ca9d"
                strokeDasharray="5 5"
                name="Previsão"
                dot={<DiamondDot />}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>

          {/* Frases abaixo do gráfico */}
          <div className="frases-abaixo-grafico">
            <p><strong>Baixa:</strong> até 1000 ppm (nível pré-industrial ou muito bem ventilado)</p>
            <p><strong>Média:</strong> entre 1001 e 2100 ppm (nível típico de ambientes urbanos ou internos)</p>
            <p><strong>Alta:</strong> acima de 2001 ppm (pode indicar ventilação insuficiente ou acúmulo de emissões)</p>
          </div>
        </div>
        <div className="caixa-lateral-menor">
          <div>
            <div className="frase-relatorio">
              Relatórios:
            </div>
            <div className="frase-relatorio-menor">
              Nas últimas semanas, os dados coletados pelo sensor registraram uma queda de 23% na emissão de gases em comparação com a média das quatro semanas anteriores. Em relação ao início do mês, a redução foi ainda mais expressiva, chegando a 31%, indicando uma possível melhora nas condições ambientais da região monitorada. Até a segunda semana do mês, os níveis de emissão haviam apresentado um aumento acumulado de 15% em relação ao mês anterior, o que havia gerado alerta para possíveis impactos na qualidade do ar.
            </div>
            <div className="frase-relatorio" style={{ marginTop: "28px" }}>
              Previsões:
            </div>
            <div className="frase-previsao-menor">
              Com base na tendência atual e nos dados históricos, a projeção para as próximas duas semanas indica uma redução adicional entre 8% e 12%, caso as condições se mantenham estáveis. Essa estimativa considera fatores como clima, tráfego e atividade industrial. A continuidade do monitoramento é essencial para confirmar essa trajetória de queda e permitir ações preventivas caso ocorra uma nova oscilação nos níveis de emissão.
            </div>
          </div>
        </div>
      </div>

      {/* Frase/botão para voltar à página inicial */}
      <div className="voltar-inicio-container">
        <span
          className="voltar-inicio-link"
          onClick={() => navigate("/TelaPrincipal")}
          tabIndex={0}
          role="button"
        >
          Voltar para a página inicial
        </span>
      </div>
    </div>
  );
}

export default Graficos01;
