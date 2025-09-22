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

function Graficos03() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(dadosIniciais);
  const [contador, setContador] = useState(0);

  useEffect(() => {
    // Função para buscar dados do sensor
    const buscarDados = async () => {
      try {
        // Buscar dados mais recentes do sensor
        const response = await axios.get('http://localhost:8000/mq135/');
        if (!response.data.dados || response.data.dados.length === 0) {
          console.log('Nenhum dado disponível ainda');
          return;
        }

        // Transformar os dados recebidos no formato do gráfico
        const dadosFormatados = response.data.dados.map((item, index) => ({
          nome: `Leitura ${index + 1}`,
          valor: parseFloat(item.co2),
          timestamp: item.timestamp
        }));

        // Atualizar o contador de leituras
        const totalLeituras = dadosFormatados.length;
        setContador(totalLeituras);
        
        // Calcular média por dia (6 leituras = 1 dia)
        const dadosPorDia = [];
        for (let i = 0; i < dadosFormatados.length; i += 6) {
          const leiturasDoDia = dadosFormatados.slice(i, i + 6);
          const mediaValor = leiturasDoDia.reduce((acc, curr) => acc + curr.valor, 0) / leiturasDoDia.length;
          const dia = Math.floor(i / 6) + 1;
          dadosPorDia.push({
            nome: `Dia ${dia}`,
            valor: mediaValor,
            previsao: null
          });
        }

        // Se tivermos 15 ou mais dias de dados, buscar previsões
        if (dadosPorDia.length >= 15) {
          try {
            const previsaoResponse = await axios.get(`http://localhost:8000/mq135/prever/${totalLeituras}/`);
            if (previsaoResponse.data.previsoes) {
              previsaoResponse.data.previsoes.forEach(previsao => {
                if (previsao.dia <= 30) {
                  dadosPorDia.push({
                    nome: `Dia ${previsao.dia}`,
                    valor: null,
                    previsao: previsao.previsao_ppm
                  });
                }
              });
            }
          } catch (erroPrevisao) {
            console.error('Erro ao buscar previsões:', erroPrevisao);
          }
        }

        setDados(dadosPorDia);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    // Buscar dados iniciais
    buscarDados();

    // Configurar intervalo para atualização (a cada 5 segundos)
    const intervalo = setInterval(buscarDados, 5000);

    // Limpar intervalo quando o componente for desmontado
    return () => clearInterval(intervalo);
  }, [contador]);

  return (
    <div className="pagina-sensor">
      <div className="topo-sensor">
        {/* Logo */}
        <div className="logoErisPequena" style={{ marginLeft: '-6em' }}>
          <img
            src="/AerisLOGOsemBG 2.png"
            className="logo-img-pequena"
            alt="Logo Aeris"
          />
          <span className="logo-eris-palavra-pequena">
            <span className="upside-down-v-pequena">V</span>eris
          </span>
        </div>
        {/* Usuário */}
        <div className="usuarioContainer" style={{  position: 'absolute', right: '50px', top: '20px' }}>
          <span>Usuário</span>
          <img src="/user (1) 1.png" alt="Ícone Usuário" />
        </div>
      </div>

      {/* Caixas e conteúdo */}
      <div className="container-duas-caixas-nao-centralizadas">
        <div className="caixa-central-sensor">
          <div className="frase-topo-caixa-maior">
            Sensor MQ135 - Dados de captação: Amônia (Nh3)
          </div>
          {/* Gráfico abaixo da frase */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "50px" }}>
            <LineChart width={700} height={430} data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" angle={-45} textAnchor="end" dy={10} />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ top: 455, fontSize:20 }} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#ffac75"
                strokeWidth={2}
                name="Valor Real"
              />
              <Line
                type="monotone"
                dataKey="previsao"
                stroke="#ffac75"           // cor diferente da linha real
                strokeWidth={2}
                strokeDasharray="6 6"
                name="Previsão"
                legendType="diamond"       // símbolo diferente na legenda
                dot={<DiamondDot />} // pontos em forma de losango
              />
            </LineChart>
          </div>

          {/* Frases abaixo do gráfico */}
          <div className="frases-abaixo-grafico">
            <p><strong>Baixa:</strong> até 25 ppm (nível pré-industrial ou muito bem ventilado)</p>
            <p><strong>Média:</strong> entre 26 e 300 ppm (nível típico de ambientes urbanos ou internos)</p>
            <p><strong>Alta:</strong> acima de 301 ppm (pode indicar ventilação insuficiente ou acúmulo de emissões)</p>
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

export default Graficos03;
