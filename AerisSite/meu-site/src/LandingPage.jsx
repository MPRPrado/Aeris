import './LandingPage.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate();
  
  // Enhanced smooth scrolling navigation function
  const smoothScrollTo = (targetId) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const navbarHeight = 90;
      const targetPosition = targetElement.offsetTop - navbarHeight;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800; // 800ms for smooth animation
      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const progressPercentage = Math.min(progress / duration, 1);
        
        // Easing function for smoother animation
        const easeInOutCubic = progressPercentage < 0.5 
          ? 4 * progressPercentage * progressPercentage * progressPercentage
          : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (progress < duration) {
          requestAnimationFrame(step);
        }
      };
      
      requestAnimationFrame(step);
    }
  };

  // Scroll to top function with smooth animation
  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const duration = 800;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressPercentage = Math.min(progress / duration, 1);
      
      const easeInOutCubic = progressPercentage < 0.5 
        ? 4 * progressPercentage * progressPercentage * progressPercentage
        : 1 - Math.pow(-2 * progressPercentage + 2, 3) / 2;
      
      window.scrollTo(0, startPosition * (1 - easeInOutCubic));
      
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    
    requestAnimationFrame(step);
  };

  // Setup scroll animations for sections
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('section, header');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="blank-page">
      
      {/* Fixed Navigation Bar */}
      <nav className="navbar-fixed">
        <div className="navbar-content">
          <div className="navbar-logo">
            <img src="/AerisLOGOsemBG 2.png" alt="AERIS Logo" />
            <span>AERIS</span>
          </div>
          <div className="navbar-menu">
            <a href="#projeto" className="navbar-link" onClick={(e) => { e.preventDefault(); smoothScrollTo('projeto'); }}>Projeto</a>
            <a href="#produto" className="navbar-link" onClick={(e) => { e.preventDefault(); smoothScrollTo('produto'); }}>Produto</a>
            <a href="#validacao" className="navbar-link" onClick={(e) => { e.preventDefault(); smoothScrollTo('validacao'); }}>Validação</a>
            <a href="#sobre-nos" className="navbar-link" onClick={(e) => { e.preventDefault(); smoothScrollTo('sobre-nos'); }}>Sobre Nós</a>
            <button className="navbar-button" onClick={() => navigate('/criar-conta')}>Acessar plataforma</button>
          </div>
        </div>
      </nav>
      
      {/* Header Section */}
      <header>
        <div className="header-text">
          <h1><b>Alerta de Emissões e Riscos Industriais de Substâncias.</b></h1>
          <h2><b>Tecnologia que protege vidas e o planeta.</b></h2>
          <p><b>O AERIS foi desenvolvido por quatro estudantes da ETE "FMC", inspirado no conceito de ecologia integral proposto na Campanha da Fraternidade 2025.</b></p>
          <p><b>O projeto tem como foco a detecção de vazamentos de gases em indústrias, promovendo segurança e sustentabilidade por meio da tecnologia.</b></p>
        </div>
        <div className="header-image">
          <img src="/AerisLOGOsemBG 2.png" alt="Logo AERIS" />
        </div>
      </header>

      {/* About AERIS Section */}
      <section id="projeto" className="oque-e-aeris">
        <h2>O que é o AERIS?</h2>
        <div className="aeris-descricao">
          <p>
            O AERIS (Alerta de Emissões e Riscos Industriais de Substâncias) é 
            um sistema de monitoramento ambiental voltado para o controle da 
            emissão de gases em áreas industriais. Por meio de sensores 
            instalados nos ambientes, ele detecta alterações na qualidade do ar e 
            envia esses dados para uma plataforma online dedicada.
          </p>
          <p>
            Através desse sistema, é possível acompanhar as emissões em tempo 
            real, visualizar gráficos de tendência e acessar relatórios periódicos 
            que mostram o aumento ou a redução dos poluentes ao longo do 
            tempo — seja por semana, mês ou ano. Esses relatórios auxiliam 
            empresas a entenderem melhor o comportamento dos gases em seus 
            setores e a tomarem decisões mais conscientes e estratégicas.
          </p>
          <p>
            Mais do que um sistema técnico, o AERIS é uma solução acessível, 
            confiável e alinhada aos desafios modernos de segurança industrial e 
            sustentabilidade ambiental.
          </p>
        </div>
      </section>

      {/* Product Section */}
      <section id="produto" className="produto-section">
        <h2>Produto:</h2>
        <div className="produto-content">
          <div className="produto-coluna-esquerda">
            <div className="produto-imagem">
              <img src="/AerisLOGOsemBG 2.png" alt="Logo AERIS" />
            </div>
            <p>
              O software do AERIS é responsável por interpretar os dados recebidos dos sensores, processados pelo ESP32, e transformá-los em informações visuais e acessíveis. Por meio de gráficos interativos e relatórios detalhados, a plataforma permite acompanhar a concentração e o comportamento dos gases ao longo do tempo, facilitando a identificação de padrões e possíveis irregularidades. Além disso, o sistema emite alertas e mantém um histórico organizado, possibilitando que as empresas atendam às exigências legais e otimizem suas rotinas de segurança ambiental.
            </p>
          </div>
          <div className="produto-coluna-direita">
            <p>
              Nosso sistema é composto por sensores de gases como o MQ2, MQ7 e MQ135, conectados a um microcontrolador ESP32, responsável por coletar e transmitir os dados para a plataforma em nuvem. O ESP32 garante conectividade Wi-Fi estável, permitindo que as informações cheguem ao software em tempo real, sem a necessidade de infraestrutura complexa. Essa arquitetura modular facilita a instalação em diferentes ambientes industriais e torna o sistema altamente escalável.
            </p>
            <div className="produto-imagem">
              <img src="/AerisLOGOsemBG 2.png" alt="Logo AERIS" />
            </div>
            <p>
              Com relatórios automatizados e uma interface intuitiva, o AERIS permite que equipes técnicas e gestores acompanhem os níveis de poluentes, tomem decisões mais rápidas e adotem medidas corretivas com agilidade.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="validacao" className="por-que-aeris">
        <h2>Por que utilizar o AERIS?</h2>
        <div className="beneficios-content">
          <div className="beneficios-coluna-esquerda">
            <ul className="beneficios-lista">
              <li>Monitoramento em <span className="destaque">tempo real</span>;</li>
              <li>Alertas automáticos;</li>
              <li>Relatórios inteligentes;</li>
              <li>Visualização por <span className="destaque">gráficos interativos</span>;</li>
              <li>Registro histórico de dados;</li>
              <li>Instalação <span className="destaque">simples</span> e <span className="destaque">modular</span>;</li>
              <li>Acesso remoto via plataforma web;</li>
              <li>Suporte à conformidade ambiental;</li>
            </ul>
          </div>
          <div className="divisor-vertical"></div>
          <div className="beneficios-coluna-direita">
            <ul className="beneficios-lista">
              <li>Mais segurança para os colaboradores;</li>
              <li>Conformidade com normas ambientais e de segurança;</li>
              <li>Prevenção de acidentes e paradas não planejadas;</li>
              <li><span className="destaque">Decisões mais rápidas</span> e baseadas em dados;</li>
              <li><span className="destaque">Redução de desperdícios e perdas</span> de insumos;</li>
            </ul>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="sobre-nos" className="quem-somos">
        <h2>Quem somos?</h2>
        <div className="quem-somos-content">
          <p>
            O AERIS é mais do que um projeto técnico — é o resultado de uma inquietação compartilhada por quatro estudantes da ETE "FMC", que decidiram transformar uma ideia em resposta concreta a um problema real. Motivados pela Campanha da Fraternidade 2025, que trouxe o tema da ecologia integral, enxergamos uma oportunidade de unir conhecimento, responsabilidade ambiental e inovação.
          </p>
          
          <p>
            Durante o desenvolvimento, percebemos o quanto a segurança no ambiente industrial e o respeito às normas ambientais ainda são desafios para muitas empresas. Vazamentos de gases poluentes ou inflamáveis, além de colocarem vidas em risco, têm impacto direto no meio ambiente e na imagem pública das organizações. Foi pensando nisso que criamos o AERIS — um sistema de monitoramento que detecta, registra e comunica alterações nos níveis de gases presentes em áreas industriais.
          </p>
          
          <p>
            Mas por trás do produto existe uma equipe comprometida, curiosa e determinada.
          </p>
          
          <p>
            Trabalhamos lado a lado para transformar uma solução teórica em algo funcional e aplicável, equilibrando todas as etapas: da prototipagem eletrônica à programação do sistema, da escolha dos sensores à construção de uma interface amigável e acessível. Buscamos sempre simplicidade sem abrir mão da eficiência.
          </p>
          
          <p>
            Acreditamos que a tecnologia precisa ter um propósito. E o nosso propósito é claro: proteger vidas, apoiar empresas e cuidar do meio ambiente com soluções acessíveis e confiáveis. Não temos todas as respostas — ainda estamos aprendendo —, mas temos certeza de que é possível gerar impacto mesmo começando pequeno.
          </p>
          
          <p className="destaque-final">
            <span className="destaque">O AERIS é o primeiro passo. E não será o último.</span>
          </p>
          
          <div className="equipe-info">
            <h3>Projeto desenvolvido por:</h3>
            <p className="nomes-equipe">
              Juliana Aparecida Custódio, Matheus Borges Mariano, Matheus Prado Ribeiro e Vinícius Amaral Vilela.
            </p>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button 
        className="back-to-top"
        onClick={scrollToTop}
        title="Voltar ao topo"
      >
        ↑
      </button>
    </div>
  )
}

export default LandingPage