// src/App.jsx
import React, { useState, useEffect } from "react";
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Estado inicial como array vazio
const dadosIniciais = [];



function Graficos01() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(dadosIniciais);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [relatorio, setRelatorio] = useState('');
  const [filtro, setFiltro] = useState('mensal'); // mensal, semanal, diario

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
        const response = await axios.get('http://localhost:8000/mq2/relatorio/');
        if (response.data) {
          const { variacao_4_semanas, variacao_inicio_mes, aumento_segunda_semana} = response.data;
          
          const relatorioTexto = `Nas últimas semanas, os dados coletados pelo sensor registraram uma queda de ${variacao_4_semanas}% na emissão de gases em comparação com a média das quatro semanas anteriores. Em relação ao início do mês, a redução foi ainda mais expressiva, chegando a ${variacao_inicio_mes}%, indicando uma possível melhora nas condições ambientais da região monitorada. Até a segunda semana do mês, os níveis de emissão haviam apresentado um aumento acumulado de ${aumento_segunda_semana}% em relação ao mês anterior, o que havia gerado alerta para possíveis impactos na qualidade do ar.`;
          
          setRelatorio(relatorioTexto);
        }
      } catch (error) {
        console.error('Erro ao buscar relatório:', error);
      }
    };
    
    const buscarDados = async () => {
      try {
        // Buscar todos os dados (sem paginação)
        const response = await axios.get('http://localhost:8000/api/mq2/?page_size=2000');
        if (!response.data || !response.data.results) {
          console.log('Nenhum dado disponível');
          return;
        }

        const dadosFormatados = response.data.results.map((item, index) => ({
          nome: `Leitura ${index + 1}`,
          valor: parseFloat(item.c4h10_ppm),
          timestamp: item.timestamp
        }));
        
        console.log('Total de dados recebidos:', dadosFormatados.length);
        console.log('Filtro atual:', filtro);

        // Processar dados baseado no filtro
        let dadosProcessados = [];
        
        if (filtro === 'diario') {
          // 6 leituras por dia (a cada 4 horas)
          dadosProcessados = dadosFormatados.slice(0, 6).map((item, index) => ({
            nome: `${index * 4}h`,
            valor: item.valor
          }));
        } else if (filtro === 'semanal') {
          // 7 dias
          for (let i = 0; i < Math.min(dadosFormatados.length, 42); i += 6) {
            const leiturasDoDia = dadosFormatados.slice(i, i + 6);
            const mediaValor = leiturasDoDia.reduce((acc, curr) => acc + curr.valor, 0) / leiturasDoDia.length;
            const dia = Math.floor(i / 6) + 1;
            dadosProcessados.push({
              nome: `Dia ${dia}`,
              valor: mediaValor
            });
          }
        } else {
          // Mensal - 30 dias (criar array completo mesmo sem dados)
          for (let dia = 1; dia <= 30; dia++) {
            const startIndex = (dia - 1) * 6;
            const leiturasDoDia = dadosFormatados.slice(startIndex, startIndex + 6);
            
            if (leiturasDoDia.length > 0) {
              const mediaValor = leiturasDoDia.reduce((acc, curr) => acc + curr.valor, 0) / leiturasDoDia.length;
              dadosProcessados.push({
                nome: `Dia ${dia}`,
                valor: mediaValor
              });
            } else {
              dadosProcessados.push({
                nome: `Dia ${dia}`,
                valor: null
              });
            }
          }
        }
        
        console.log('Dados processados:', dadosProcessados.length, 'itens');
        console.log('Primeiros 5 dados:', dadosProcessados.slice(0, 5));
        console.log('Últimos 5 dados:', dadosProcessados.slice(-5));
        setDados(dadosProcessados);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    buscarDados();
    buscarRelatorio();
    // Sem atualização automática - dados mensais fixos
  }, [filtro]); // Recarregar quando filtro mudar

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
        <div className="caixa-central-sensor" style={{ position: "relative" }}>
          {/* Dropdown no cantinho */}
          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "2px solid #ffac75",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
              color: "#333",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              outline: "none",
              zIndex: 10
            }}
          >
            <option value="diario">Diário</option>
            <option value="semanal">Semanal</option>
            <option value="mensal">Mensal</option>
          </select>
          
          <div className="frase-topo-caixa-maior">
            Sensor MQ2 - Dados Mensais: Butano (C4H10)
          </div>
          {/* Gráfico abaixo da frase */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <LineChart width={700} height={430} data={dados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nome" 
                tick={false}
                axisLine={true}
              />
              <YAxis 
                domain={[0, 'auto']}
                label={{ value: 'PPM', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (value === null) return ['N/A', `${props.payload.nome} - Concentração`];
                  return [`${value.toFixed(2)} ppm`, `${props.payload.nome} - Concentração`];
                }}
                labelFormatter={() => ''}
              />
              <Legend wrapperStyle={{ top: 450, left: 0 }} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#ffac75"
                strokeWidth={2}
                name="C4H10"
                dot={false}
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
              {relatorio || 'Carregando relatório...'}
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
