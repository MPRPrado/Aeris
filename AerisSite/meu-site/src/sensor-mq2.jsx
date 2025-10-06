// src/App.jsx
import React, { useState, useEffect } from "react";
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import { useESP } from './ESPContext';
import ModalPerfil from './ModalPerfil';
import axios from 'axios';

// Estado inicial como array vazio
const dadosIniciais = [];



function Graficos01() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(dadosIniciais);
  const [relatorio, setRelatorio] = useState('');
  const [filtro, setFiltro] = useState('mensal'); // mensal, semanal, diario
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const { usuario } = useAuth();
  const { espSelecionado, tipoESP } = useESP();

  useEffect(() => {
    // Redirecionar se não estiver logado
    if (!usuario) {
      navigate('/login');
      return;
    }
    
    const buscarRelatorio = async () => {
      try {
        const response = await axios.get('http://localhost:8000/mq2/relatorio/');
        if (response.data) {
          const { variacao_4_semanas, variacao_inicio_mes, aumento_segunda_semana} = response.data;
          
          // Função para gerar texto inteligente
          const gerarTextoRelatorio = (var4sem, varMes, var2sem) => {
            // Determinar tendência das 4 semanas
            let tendencia4sem;
            if (var4sem <= 5) {
              tendencia4sem = "mantiveram-se estáveis";
            } else if (var4sem <= 15) {
              tendencia4sem = `apresentaram variação moderada de ${var4sem}%`;
            } else if (var4sem <= 30) {
              tendencia4sem = `registraram variação significativa de ${var4sem}%`;
            } else if (var4sem <= 100) {
              tendencia4sem = `mostraram variação expressiva de ${var4sem}%`;
            } else {
              tendencia4sem = `apresentaram variação extrema de ${var4sem}%`;
            }
            
            // Determinar tendência mensal
            let tendenciaMes;
            if (varMes <= 5) {
              tendenciaMes = "permaneceram praticamente inalterados";
            } else if (varMes <= 15) {
              tendenciaMes = `apresentaram mudança moderada de ${varMes}%`;
            } else if (varMes <= 30) {
              tendenciaMes = `registraram alteração considerável de ${varMes}%`;
            } else if (varMes <= 100) {
              tendenciaMes = `demonstraram mudança substancial de ${varMes}%`;
            } else {
              tendenciaMes = `exibiram transformação drástica de ${varMes}%`;
            }
            
            // Determinar impacto da segunda semana
            let impacto2sem;
            if (var2sem <= 10) {
              impacto2sem = "sem oscilações significativas";
            } else if (var2sem <= 25) {
              impacto2sem = `com variação controlada de ${var2sem}%`;
            } else if (var2sem <= 100) {
              impacto2sem = `apresentando flutuação acentuada de ${var2sem}%`;
            } else {
              impacto2sem = `com oscilação crítica de ${var2sem}%`;
            }
            
            // Avaliar condições gerais
            const mediaGeral = (var4sem + varMes + var2sem) / 3;
            let avaliacao;
            if (mediaGeral <= 10) {
              avaliacao = "indicando condições ambientais estáveis na região monitorada";
            } else if (mediaGeral <= 25) {
              avaliacao = "sugerindo variações normais nas condições ambientais";
            } else if (mediaGeral <= 100) {
              avaliacao = "requerendo atenção às condições ambientais da área";
            } else {
              avaliacao = "exigindo intervenção imediata nas condições críticas";
            }
            
            return `Nas últimas semanas, os níveis de butano (C4H10) ${tendencia4sem} em comparação com o período anterior. Em relação ao início do mês, as concentrações ${tendenciaMes}, ${avaliacao}. Durante a segunda semana do período analisado, as medições registraram ${impacto2sem}, mantendo o padrão de monitoramento dentro dos parâmetros estabelecidos.`;
          };
          
          const relatorioTexto = gerarTextoRelatorio(variacao_4_semanas, variacao_inicio_mes, aumento_segunda_semana);
          setRelatorio(relatorioTexto);
        }
      } catch (error) {
        console.error('Erro ao buscar relatório:', error);
      }
    };
    
    const buscarDados = async () => {
      try {
        // Limpar gráfico antes da requisição
        setDados([]);
        
        let response;
        
        // Verificar se é ESP Real ou Demo
        if (tipoESP === 'REAL') {
          // Buscar dados reais do banco
          response = await axios.get('http://localhost:8000/api/mq2/?page_size=2000');
        } else {
          // Buscar dados de demonstração (não salvos no banco)
          response = await axios.get('http://localhost:8000/api/dados-demo/?sensor=mq2');
        }
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
        
        // Calcular média dos valores
        const valoresValidos = dadosProcessados.filter(item => item.valor !== null).map(item => item.valor);
        const media = valoresValidos.length > 0 ? valoresValidos.reduce((acc, val) => acc + val, 0) / valoresValidos.length : 0;
        
        // Adicionar linha de média e linhas de referência a todos os pontos
        const dadosComMedia = dadosProcessados.map(item => ({
          ...item,
          media: media,
          baixo: 750,   // Verde - até 1000 ppm
          medio: 1200    // Amarelo - até 2000 ppm
        }));
        
        console.log('Dados processados:', dadosProcessados.length, 'itens');
        console.log('Média calculada:', media.toFixed(2));
        setDados(dadosComMedia);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    buscarDados();
    buscarRelatorio();
  }, [filtro, tipoESP]); // Recarregar quando filtro ou ESP mudar

  return (
    <div className="pagina-sensor">
      <div className="topo-sensor">
        {/* Logo */}
        <div className="logoErisPequena" onClick={() => navigate('/TelaPrincipal')} style={{ cursor: 'pointer' }}>
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
        <div className="usuarioContainer" onClick={() => setModalPerfilAberto(true)} style={{ cursor: 'pointer' }}>
          <span style={{ color: "#ff6600" }}>{usuario.nome}</span>
          <img src="/user (1) 1.png" alt="Ícone Usuário" />
        </div>
      </div>

      {/* Caixas e conteúdo */}
      <div className="container-duas-caixas-nao-centralizadas">
        <div className="caixa-central-sensor" style={{ position: "relative" }}>
          {/* Dropdown de filtro */}
          <select 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{
              position: "absolute",
              top: "15px",
              right: "2em",
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
            Sensor MQ2 - {tipoESP === 'REAL' ? 'Dados Reais' : 'Demonstração'}: Butano (C4H10)
          </div>
          
          {/* Indicador do ESP selecionado */}
          {espSelecionado && (
            <div style={{
              margin: "0 0 0 30px",
              padding: "8px 15px",
              backgroundColor: tipoESP === 'REAL' ? '#4CAF50' : '#FF9800',
              color: 'white',
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "bold",
              display: "inline-block",
              verticalAlign: "middle"
            }}>
📡 {espSelecionado.nome}
            </div>
          )}
          {/* Gráfico abaixo da frase */}
          <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px", marginLeft: "-3em" }}>
            <LineChart width={600} height={300} data={dados} fontSize={14}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nome" 
                tick={false}
                axisLine={true}
              />
              <YAxis 
                domain={[0, 30000]}
                label={{ value: 'PPM', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  if (value === null) return ['N/A', name === 'Média' ? 'Média' : name === 'Nível Baixo' ? 'Nível Baixo' : name === 'Nível Médio' ? 'Nível Médio' : `${props.payload.nome} - Concentração`];
                  return [`${value.toFixed(2)} ppm`, name === 'Média' ? 'Média' : name === 'Nível Baixo' ? 'Nível Baixo' : name === 'Nível Médio' ? 'Nível Médio' : `${props.payload.nome} - Concentração`];
                }}
                labelFormatter={() => ''}
              />
              <Legend wrapperStyle={{ top: 260, left: 0 }} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#ffac75"
                strokeWidth={2}
                name="C4H10"
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="media"
                stroke="#999999"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Média"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="baixo"
                stroke="#00ff00ff"
                strokeWidth={3}
                strokeDasharray="3 3"
                name="Nível Baixo"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="medio"
                stroke="#d4d400ff"
                strokeWidth={3}
                strokeDasharray="3 3"
                name="Nível Médio"
                dot={false}
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

      
      {/* Modal de Perfil */}
      <ModalPerfil 
        isOpen={modalPerfilAberto} 
        onClose={() => setModalPerfilAberto(false)} 
      />
    </div>
  );
}

export default Graficos01;
