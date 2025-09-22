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
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [relatorio, setRelatorio] = useState('');
  const [previsoes, setPrevisoes] = useState('');

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
    
    const buscarRelatorio = async () => {
      try {
        const response = await axios.get('http://localhost:8000/mq135/relatorio/');
        if (response.data) {
          const { variacao_4_semanas, variacao_inicio_mes, aumento_segunda_semana, previsao_min, previsao_max } = response.data;
          
          const relatorioTexto = `Nas últimas semanas, os dados coletados pelo sensor registraram uma queda de ${variacao_4_semanas}% na emissão de gases em comparação com a média das quatro semanas anteriores. Em relação ao início do mês, a redução foi ainda mais expressiva, chegando a ${variacao_inicio_mes}%, indicando uma possível melhora nas condições ambientais da região monitorada. Até a segunda semana do mês, os níveis de emissão haviam apresentado um aumento acumulado de ${aumento_segunda_semana}% em relação ao mês anterior, o que havia gerado alerta para possíveis impactos na qualidade do ar.`;
          
          const previsaoTexto = `Com base na tendência atual e nos dados históricos, a projeção para as próximas duas semanas indica uma redução adicional entre ${previsao_min}% e ${previsao_max}%, caso as condições se mantenham estáveis. Essa estimativa considera fatores como clima, tráfego e atividade industrial. A continuidade do monitoramento é essencial para confirmar essa trajetória de queda e permitir ações preventivas caso ocorra uma nova oscilação nos níveis de emissão.`;
          
          setRelatorio(relatorioTexto);
          setPrevisoes(previsaoTexto);
        }
      } catch (error) {
        console.error('Erro ao buscar relatório:', error);
      }
    };
    
    // Função para buscar dados do sensor
    const buscarDados = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mq135/');
        if (!response.data || !response.data.results) {
          console.log('Nenhum dado disponível');
          return;
        }

        const dadosFormatados = response.data.results.map((item, index) => ({
          nome: `Leitura ${index + 1}`,
          valor: parseFloat(item.nh3_ppm),
          timestamp: item.timestamp
        }));

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

        // Criar array completo de 30 dias
        const dadosCompletos = [];
        for (let dia = 1; dia <= 30; dia++) {
          const dadoExistente = dadosPorDia.find(d => d.nome === `Dia ${dia}`);
          if (dadoExistente) {
            dadosCompletos.push(dadoExistente);
          } else {
            dadosCompletos.push({
              nome: `Dia ${dia}`,
              valor: null,
              previsao: null
            });
          }
        }

        // Buscar previsões se tivermos dados suficientes
        if (dadosPorDia.length >= 10) {
          try {
            const totalLeituras = dadosFormatados.length;
            const previsaoResponse = await axios.get(`http://localhost:8000/mq135/prever/${totalLeituras}/`);
            if (previsaoResponse.data.previsoes) {
              previsaoResponse.data.previsoes.forEach(previsao => {
                const index = previsao.dia - 1;
                if (index < 30) {
                  dadosCompletos[index].previsao = previsao.previsao_ppm;
                  // Conectar previsão com último valor real
                  if (index > 0 && dadosCompletos[index - 1].valor !== null && dadosCompletos[index].valor === null) {
                    dadosCompletos[index].valor = dadosCompletos[index - 1].valor;
                  }
                }
              });
            }
          } catch (erroPrevisao) {
            console.error('Erro ao buscar previsões:', erroPrevisao);
          }
        }

        setDados(dadosCompletos);
        setContador(dadosFormatados.length);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    // Buscar dados iniciais
    buscarDados();
    buscarRelatorio();

    // Configurar intervalo para atualização (a cada 5 segundos)
    const intervalo = setInterval(buscarDados, 5000);
    const intervaloRelatorio = setInterval(buscarRelatorio, 30000);

    // Limpar intervalo quando o componente for desmontado
    return () => {
      clearInterval(intervalo);
      clearInterval(intervaloRelatorio);
    };
  }, [contador]);

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
          <span>{nomeUsuario}</span>
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
                labelFormatter={(label) => label}
              />
              <Legend wrapperStyle={{ top: 450, left: 0 }} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#ffac75"
                strokeWidth={2}
                name="NH3"
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
              {relatorio || 'Carregando relatório...'}
            </div>
            <div className="frase-relatorio" style={{ marginTop: "28px" }}>
              Previsões:
            </div>
            <div className="frase-previsao-menor">
              {previsoes || 'Carregando previsões...'}
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
