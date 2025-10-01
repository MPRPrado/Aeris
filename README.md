# 🌱 AERIS - Alerta de Emissões e Riscos Industriais de Substâncias

## 📋 Sobre o Projeto

O **AERIS** é um sistema de monitoramento ambiental desenvolvido por quatro estudantes da ETE "FMC" para a **Feira de Tecnologias 2025**, inspirado no conceito de ecologia integral da Campanha da Fraternidade 2025.

O projeto detecta e monitora vazamentos de gases em ambientes industriais através de sensores IoT, fornecendo dados em tempo real, relatórios inteligentes e sistema de alertas por email.

## 🎯 Objetivos

- **Segurança Industrial**: Detectar vazamentos de gases perigosos
- **Sustentabilidade**: Monitorar emissões ambientais
- **Prevenção**: Alertas automáticos para ações preventivas
- **Conformidade**: Auxiliar empresas no cumprimento de normas ambientais

## 🏗️ Arquitetura do Sistema

### Hardware (IoT)
- **ESP32**: Microcontrolador principal com conectividade Wi-Fi
- **Sensores de Gases**:
  - **MQ2**: Detecção de Butano (C4H10)
  - **MQ7**: Detecção de Monóxido de Carbono (CO)
  - **MQ135**: Detecção de Amônia (NH3)

### Backend (Django)
- **API REST**: Endpoints para receber e fornecer dados
- **Banco de Dados**: Armazenamento de leituras dos sensores
- **Sistema de Alertas**: Notificações por email em tempo real
- **Relatórios Automáticos**: Análise estatística dos dados

### Frontend (React)
- **Dashboard Interativo**: Visualização em tempo real
- **Gráficos Dinâmicos**: Usando Recharts
- **Landing Page**: Apresentação do projeto
- **Sistema de Usuários**: Autenticação e personalização

## 🚀 Funcionalidades

### 📊 Monitoramento em Tempo Real
- Coleta de dados a cada 4 horas (6 leituras/dia)
- Visualização por gráficos interativos
- Atualização automática da interface

### 📈 Análise Inteligente
- **Relatórios Automáticos**: Comparação de períodos (4 semanas, mensal)
- **Sistema de Alertas**: Notificações por email quando níveis críticos são detectados
- **Classificação por Níveis**: Baixo, Médio, Alto para cada gás

### 🎨 Interface Moderna
- **Design Responsivo**: Funciona em desktop e mobile
- **Animações Suaves**: Scroll e transições elegantes
- **UX Intuitiva**: Navegação simples e clara

### 📧 Sistema de Alertas
- **Notificações por Email**: Alertas automáticos quando gases excedem níveis seguros
- **Monitoramento Contínuo**: Verificação constante dos níveis de concentração
- **Resposta Rápida**: Notificações imediatas para ação preventiva

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.x**
- **Django 4.x** - Framework web
- **Django REST Framework** - APIs
- **SQLite** - Banco de dados
- **NumPy/Pandas** - Análise de dados
- **SMTP** - Sistema de envio de emails
- **MQTT** - Comunicação IoT

### Frontend
- **React 18** - Interface de usuário
- **React Router** - Navegação
- **Recharts** - Gráficos interativos
- **Axios** - Requisições HTTP
- **CSS3** - Estilização moderna

### Hardware
- **ESP32** - Microcontrolador
- **Sensores MQ2, MQ7, MQ135** - Detecção de gases
- **Wi-Fi** - Conectividade

## 📁 Estrutura do Projeto

```
Aeris/
├── Django/                          # Backend
│   ├── primeiro_projeto/            # Configurações principais
│   ├── app_cad_usuario/            # Sistema de usuários
│   ├── mq2/, mq7/, mq135/          # Apps dos sensores
│   ├── mqtt/                       # Comunicação IoT
│   └── manage.py
├── AerisSite/meu-site/             # Frontend React
│   ├── src/
│   │   ├── App.jsx                 # Roteamento principal
│   │   ├── LandingPage.jsx         # Página inicial
│   │   ├── sensor-*.jsx            # Dashboards dos sensores
│   │   ├── Login.jsx               # Autenticação
│   │   └── TelaPrincipal.jsx       # Menu principal
│   └── public/
└── README.md
```

## 🔧 Como Executar

### Pré-requisitos
- Python 3.8+
- Node.js 16+
- Git

### Backend (Django)
```bash
cd Django
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React)
```bash
cd AerisSite/meu-site
npm install
npm start
```

### Hardware (ESP32)
1. Configure as credenciais Wi-Fi
2. Conecte os sensores MQ2, MQ7, MQ135
3. Carregue o código no ESP32
4. Verifique a comunicação MQTT

## 📊 Dados e Métricas

### Coleta de Dados
- **Frequência**: 6 leituras por dia (a cada 4 horas)
- **Período**: Monitoramento mensal (30 dias)
- **Precisão**: Valores em PPM (partes por milhão)

### Análise Estatística
- **Variação 4 semanas**: Comparação com período anterior
- **Variação mensal**: Análise início vs fim do mês
- **Tendências**: Identificação de padrões
- **Alertas Automáticos**: Notificações quando limites são ultrapassados

### Níveis de Alerta
- **MQ2 (Butano)**: Baixo (<1000), Médio (1001-2100), Alto (>2001 ppm)
- **MQ7 (CO)**: Baixo (<1000), Médio (1001-8000), Alto (>8001 ppm)
- **MQ135 (NH3)**: Baixo (<25), Médio (26-300), Alto (>301 ppm)

## 🎓 Equipe de Desenvolvimento

**Estudantes da ETE "FMC":**
- Juliana Aparecida Custódio
- Matheus Borges Mariano
- Matheus Prado Ribeiro
- Vinícius Amaral Vilela

## 🌍 Impacto Social

### Benefícios Ambientais
- Redução de emissões industriais
- Monitoramento da qualidade do ar
- Conformidade com normas ambientais

### Benefícios Econômicos
- Prevenção de acidentes industriais
- Otimização de processos
- Redução de multas ambientais

### Benefícios Sociais
- Proteção da saúde dos trabalhadores
- Melhoria da qualidade de vida local
- Conscientização ambiental

## 🏆 Diferenciais Técnicos

### Inovação
- **Sistema de Alertas**: Notificações automáticas por email em tempo real
- **IoT Completo**: Da coleta à visualização em uma solução integrada
- **Interface Moderna**: UX/UI profissional e responsiva

### Escalabilidade
- **Arquitetura Modular**: Fácil adição de novos sensores
- **API REST**: Integração com outros sistemas
- **Cloud Ready**: Preparado para deploy em nuvem

### Sustentabilidade
- **Baixo Consumo**: Hardware otimizado para eficiência energética
- **Código Aberto**: Disponível para a comunidade
- **Educacional**: Ferramenta de aprendizado para outros estudantes

## 📞 Contato

**Projeto desenvolvido para a Feira de Tecnologias 2025**
**ETE "FMC" - Escola Técnica Estadual**

---

*"O AERIS é o primeiro passo. E não será o último."*

**#TecnologiaParaOBem #EcologiaIntegral #InovaçãoSustentável**
