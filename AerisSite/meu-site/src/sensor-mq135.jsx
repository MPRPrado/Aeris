// src/App.jsx
import React from "react";
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

// Agora cada objeto tem 'valor' e 'previsao'
const dados = [
  { nome: "Dia 1", valor: 100, previsao: null },
  { nome: "Dia 2", valor: 500, previsao: null },
  { nome: "Dia 3", valor: 1000, previsao: null },
  { nome: "Dia 4", valor: 2000, previsao: null },
  { nome: "Dia 5", valor: 2500, previsao: null },
  { nome: "Dia 6", valor: 5000, previsao: null },
  { nome: "Dia 7", valor: 2100, previsao: null },
  { nome: "Dia 8", valor: 6500, previsao: null },
  { nome: "Dia 9", valor: 6000, previsao: null },
  { nome: "Dia 10", valor: 900, previsao: null },
  { nome: "Dia 11", valor: 3000, previsao: null },      
  { nome: "Dia 12", valor: 4000, previsao: null },
  { nome: "Dia 13", valor: 7000, previsao: null },
  { nome: "Dia 14", valor: 600, previsao: null },
  { nome: "Dia 15", valor: 100, previsao: null },
  { nome: "Dia 17", valor: 1000, previsao: null },
  { nome: "Dia 18", valor: 1000, previsao: null },
  { nome: "Dia 19", valor: 1000, previsao: null },
  { nome: "Dia 20", valor: 1000, previsao: null },
  { nome: "Dia 21", valor: 1000, previsao: null },
  { nome: "Dia 22", valor: 1000, previsao: null },
  { nome: "Dia 23", valor: 1000, previsao: null },
  { nome: "Dia 24", valor: 1000, previsao: null },
  { nome: "Dia 25", valor: 1000, previsao: null },
  { nome: "Dia 26", valor: 1000, previsao: null },
  { nome: "Dia 27", valor: 1000, previsao: null },
  { nome: "Dia 28", valor: 1000, previsao: null },
  { nome: "Dia 29", valor: 1000, previsao: null },
  { nome: "Dia 30", valor: 1000, previsao: null },
];

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
        {/* Usuário */}
        <div className="usuarioContainer">
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
              <Legend wrapperStyle={{ top: 455 }} />
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
