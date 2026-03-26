import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Lock,
  Check, 
  Gift, 
  Plus,
  Quote,
  Clock,
  Inbox,
  Mail,
  Smartphone,
  X,
  PlayCircle,
  Calendar,
  Headphones,
  Moon,
  Infinity,
  MonitorPlay,
  CalendarCheck,
  AlertCircle,
  Activity,
  Globe
} from 'lucide-react';

declare global {
  interface Window {
    fbq: any;
  }
}

// --- Tracking Helper ---

const trackEvent = async (eventName: string, customData: any = {}) => {
  // Client-side Pixel
  if (window.fbq) {
    window.fbq('track', eventName, customData);
  }

  // Server-side CAPI
  try {
    await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        customData,
        eventSourceUrl: window.location.href,
        userData: {
          // In a real app, you'd collect email/phone if available
          // For now we send what we have
          external_id: localStorage.getItem('user_id') || undefined
        }
      })
    });
  } catch (error) {
    console.error('Tracking error:', error);
  }
};

// --- Sub-components ---

const NotificationPopup = () => {
  const [visible, setVisible] = useState(false);
  const [exit, setExit] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [shuffledList, setShuffledList] = useState<{name: string, city: string}[]>([]);
  const [currentPlan, setCurrentPlan] = useState("");
  
  // Ref to track the index without triggering re-renders of the effect
  const indexRef = useRef(-1);

  const namesData = [
    { name: "Ana Paula", city: "São Paulo, SP" },
    { name: "Carlos Roberto", city: "Belo Horizonte, MG" },
    { name: "Fernanda Costa", city: "Curitiba, PR" },
    { name: "José Henrique", city: "Goiânia, GO" },
    { name: "Márcia Lima", city: "Salvador, BA" },
    { name: "Ricardo Souza", city: "Fortaleza, CE" },
    { name: "Patrícia Alves", city: "Recife, PE" },
    { name: "Eduardo Martins", city: "Porto Alegre, RS" },
    { name: "Simone Oliveira", city: "Manaus, AM" },
    { name: "Antônio Ferreira", city: "Brasília, DF" },
    { name: "Luciana Santos", city: "Campinas, SP" },
    { name: "Marcos Pereira", city: "Florianópolis, SC" },
  ];

  const shuffle = (array: any[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    setShuffledList(shuffle(namesData));
  }, []);

  useEffect(() => {
    if (shuffledList.length === 0) return;

    const showNotification = () => {
      // Update index ref
      indexRef.current = (indexRef.current + 1) % shuffledList.length;
      
      const plan = Math.random() < 0.7 
        ? "Plano Completo" 
        : "Plano Básico";

      setCurrentIndex(indexRef.current);
      setCurrentPlan(plan);
      setVisible(true);
      setExit(false);

      // Hide after exactly 5 seconds
      setTimeout(() => {
        setExit(true);
        setTimeout(() => setVisible(false), 500);
      }, 5000);
    };

    // First appearance after 5 seconds
    const initialTimer = setTimeout(showNotification, 5000);
    
    // Interval strictly every 33 seconds
    const intervalTimer = setInterval(showNotification, 33000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [shuffledList]);

  if (!visible || currentIndex === -1) return null;

  const currentPerson = shuffledList[currentIndex];
  const initial = currentPerson.name.charAt(0).toUpperCase();
  // Extract state from "City, ST" format
  const state = currentPerson.city.split(', ')[1] || '';

  return (
    <div className={`fixed bottom-24 right-4 z-[999] w-full max-w-[135px] font-jakarta ${exit ? 'popup-exit' : 'popup-enter'}`}>
      <div className="bg-white rounded-[6px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] p-1 flex items-center gap-1 border border-[#E5E7EB] relative overflow-hidden">
        {/* Check Icon Top Right */}
        <div className="absolute top-0.5 right-0.5 text-[#1A9E8F]">
          <CheckCircle2 size={7} fill="#1A9E8F" className="text-white" />
        </div>

        {/* Avatar */}
        <div className="w-5 h-5 rounded-full bg-[#1A9E8F] flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-white font-bold text-[8px] leading-none">{initial}</span>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-0 pr-1 overflow-hidden">
          <p className="text-[#0D3B5E] text-[8px] leading-tight truncate">
            <span className="font-bold">{currentPerson.name}</span> — {state}
          </p>
          <p className="text-[#4B5563] text-[7px] font-medium leading-tight">
            adquiriu o <span className="text-[#0D3B5E] font-bold">{currentPlan}</span>
          </p>
          <p className="text-[#9CA3AF] text-[6px] font-medium mt-0.5">
            agora mesmo
          </p>
        </div>
      </div>
    </div>
  );
};

const TopBanner = () => (
  <div className="bg-[#0D3B5E] text-white py-2.5 px-4 text-center text-[10px] font-bold flex items-center justify-center gap-2 uppercase tracking-tight">
    <Zap size={12} className="text-[#F5A623] fill-[#F5A623]" />
    <span>Oferta exclusiva: 60% de desconto hoje</span>
    <Zap size={12} className="text-[#F5A623] fill-[#F5A623]" />
  </div>
);

const HeaderRating = () => (
  <div className="flex justify-center pt-4 pb-0 px-4 bg-[#F5F7F6]">
    <img 
      src="https://i.ibb.co/hFJSqpMK/Chat-GPT-Image-17-de-fev-de-2026-21-17-25-1.png" 
      alt="Recomendado por +2.400 alunos" 
      className="h-10 w-auto object-contain"
    />
  </div>
);

const Hero = () => (
  <section className="bg-[#F5F7F6] pt-6 pb-10 px-5 text-center">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold leading-[1.15] mb-3 tracking-tighter text-[#0D3B5E]">
        A forma mais simples e prática de <br className="hidden md:block" />
        <span className="text-[#1A9E8F]">reduzir a gordura no fígado</span> <br className="hidden md:block" />
        sem <span className="text-[#1A9E8F]">dieta radical</span> e sem complicação
      </h1>
      
      <p className="text-[#4B5563] mb-0 max-w-xl mx-auto text-sm md:text-lg leading-relaxed font-medium relative z-10">
        Você vai ter acesso a um <strong className="text-[#0D3B5E] font-bold">passo a passo para reduzir a gordura no fígado</strong> de forma <strong className="text-[#0D3B5E] font-bold">fácil, simples e sem complicação</strong>.
      </p>
      
      <div className="w-full max-w-3xl mx-auto -mt-8 -mb-14 md:-mt-16 md:-mb-24 relative z-0 pointer-events-none">
        <img 
          src="https://i.ibb.co/v639D7ZD/mockup-estudio-infinito-premium.png" 
          alt="Programa Fígado Leve" 
          className="w-full h-auto block mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500 pointer-events-auto px-5" 
        />
      </div>

      <p className="text-[#0D3B5E] text-[10px] leading-[19px] font-medium mb-5 max-w-lg mx-auto relative z-10">
        Fortifique e cuide do seu <strong className="font-bold">fígado de verdade</strong> aprendendo tudo com o nosso <strong className="text-[#1A9E8F] font-bold">Guia Completo do Fígado Leve</strong>. <strong className="font-bold">Mesmo que você nunca tenha feito nada pelo seu fígado ou não saiba por onde começar.</strong>
      </p>

      <div className="flex flex-row justify-center items-center gap-3 md:gap-6 max-w-2xl mx-auto mb-6 mt-4">
        <div className="flex flex-row items-center gap-1 px-0.5">
          <MonitorPlay className="w-[8px] h-[8px] text-[#0D3B5E]" strokeWidth={2} />
          <h3 className="text-[8px] font-bold text-[#0D3B5E] leading-tight whitespace-nowrap">
            Acesso <span className="text-[#1A9E8F]">imediato</span>
          </h3>
        </div>

        <div className="flex flex-row items-center gap-1 px-0.5">
          <CalendarCheck className="w-[8px] h-[8px] text-[#0D3B5E]" strokeWidth={2} />
          <h3 className="text-[8px] font-bold text-[#0D3B5E] leading-tight whitespace-nowrap">
            Acesso <span className="text-[#1A9E8F]">vitalício</span>
          </h3>
        </div>

        <div className="flex flex-row items-center gap-1 px-0.5">
          <ShieldCheck className="w-[8px] h-[8px] text-[#0D3B5E]" strokeWidth={2} />
          <h3 className="text-[8px] font-bold text-[#0D3B5E] leading-tight whitespace-nowrap">
            <span className="text-[#1A9E8F]">30 dias</span> de garantia
          </h3>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm text-red-500 font-bold line-through mb-0.5">DE R$ 67</p>
        <p className="text-sm text-[#4B5563] font-bold mb-0.5">POR APENAS</p>
        <p className="text-6xl md:text-7xl font-black text-[#1A9E8F] tracking-tighter">R$ 10</p>
      </div>

      <button 
        id="cta-hero"
        onClick={() => {
          trackEvent('InitiateCheckout', { content_name: 'Hero CTA' });
          document.getElementById('bonus-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="w-full max-w-md mx-auto bg-[#1A9E8F] hover:bg-[#1A9E8F] text-white font-bold py-4 px-6 rounded-xl shadow-[0_8px_0_#137A6E] transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 uppercase text-sm md:text-base mb-3 animate-cta-pulse"
      >
        QUERO CUIDAR DO MEU FÍGADO AGORA!
        <ArrowRight size={20} strokeWidth={3} />
      </button>
      <div className="flex items-center justify-center gap-2 text-xs text-[#4B5563] font-medium">
        <Lock size={14} className="text-[#1A9E8F]" />
        acesso imediato + garantia de 30 dias
      </div>
    </div>
  </section>
);

const Identification = () => {
  const cards = [
    {
      title: "A gordura não diminui mesmo comendo bem?",
      desc: "Falta um plano específico. Dietas genéricas não focam na desinflamação hepática."
    },
    {
      title: "Vive cansado(a), inchado(a) e com digestão pesada?",
      desc: "Alimentos inofensivos estão sobrecarregando seu fígado e roubando sua energia."
    },
    {
      title: "Sente medo e dúvida sobre o que pode comer?",
      desc: "O excesso de informações confunde. Você precisa de clareza sobre o que cura e o que piora."
    }
  ];

  return (
    <section className="py-16 px-6 bg-[#0D3B5E] text-center">
      <div className="max-w-5xl mx-auto">
        <div className="inline-block bg-[#1A9E8F] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase mb-4 tracking-widest">
          VOCÊ SE IDENTIFICA?
        </div>
        
        <h2 className="text-white text-2xl md:text-4xl font-bold mb-10 tracking-tight">
          Alguma dessas situações parece familiar?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          {cards.map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-[12px] shadow-sm border border-[#E5E7EB]">
              <h3 className="text-[#0D3B5E] font-bold text-lg md:text-xl border-l-4 border-[#1A9E8F] pl-4 mb-3 leading-snug">
                {card.title}
              </h3>
              <p className="text-[#4B5563] text-sm md:text-base leading-relaxed font-semibold">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EditorialTrustSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`relative py-20 px-6 bg-[#0D3B5E] noise-bg-cta overflow-hidden reveal-element ${isVisible ? 'visible' : ''}`}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-center mb-10">
          <span className="bg-[#EF4444] text-white text-[10px] font-bold px-4 py-1.5 rounded-none uppercase tracking-[0.2em]">
            ATENÇÃO
          </span>
        </div>
        
        <div className="max-w-3xl mx-auto pl-8 md:pl-12 border-l-[3px] border-[#1A9E8F] mb-10">
          <h2 className="text-white text-3xl md:text-5xl font-semibold leading-[1.3] tracking-tight">
            A esteatose hepática não dói no início mas ignorar os sinais pode <span className="text-[#1A9E8F] font-bold">custar caro</span> para a sua saúde.
          </h2>
        </div>
      </div>
    </section>
  );
};

const ExpertBioSection = () => {
  return (
    <section className="relative py-20 px-6 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] md:w-[30%] opacity-100 pointer-events-none z-0">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M400 0C400 220.914 220.914 400 0 400" stroke="#F5F7F6" strokeWidth="150" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 items-center">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[420px] bg-white rounded-[16px] shadow-[0_20px_60px_rgba(13,59,94,0.25)] overflow-hidden">
              <img 
                src="https://i.ibb.co/FLQRRQpP/b60f228e-fddc-4c9e-94e9-e4c6272a10b5.jpg" 
                alt="Dra. Marina Albuquerque" 
                className="w-full h-auto block"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="inline-block text-[#1A9E8F] text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                QUEM ESTÁ POR TRÁS DO MÉTODO
              </span>
              <h2 className="text-[#0D3B5E] text-4xl md:text-5xl font-bold leading-tight mb-4">
                Dra. Marina Albuquerque
              </h2>
              <div className="w-[60px] h-[2px] bg-[#1A9E8F]"></div>
            </div>

            <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">
              <strong className="text-[#0D3B5E] font-bold">Nutricionista Clínica</strong> • <strong className="text-[#0D3B5E] font-bold">Especialista em Saúde Hepática</strong> • <strong className="text-[#0D3B5E] font-bold">12 anos de experiência</strong>
            </p>

            <div className="space-y-6 text-[#4B5563] text-base md:text-lg leading-relaxed">
              <p>
                Atendendo centenas de pacientes, percebi que todo mundo saía do consultório com o diagnóstico na mão… <strong className="font-bold text-[#1A9E8F]">mas sem saber o que fazer.</strong>
              </p>
              
              <p>
                Tentavam sozinhos. Erravam. Desistiam. <strong className="font-bold text-[#1A9E8F]">E voltavam com o fígado pior.</strong>
              </p>

              <p>
                Foi aí que criei o <strong className="font-bold text-[#1A9E8F]">Fígado Leve</strong> — um método claro, simples e aplicável na vida real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const NewTestimonialsSection = () => {
  const testimonials = [
    {
      image: "https://i.ibb.co/wNhqT1sL/26d01533d6a288448bf8c31c08345eeb.jpg",
      name: "Ana Paula",
      info: "São Paulo, SP • 44 anos",
      text: "Recebi o diagnóstico e fiquei completamente perdida, porque todo mundo só falava para melhorar a alimentação, mas ninguém explicava como fazer isso na prática. O que mais me ajudou no Fígado Leve foi justamente ter clareza. Em pouco tempo eu já me sentia mais segura, menos inchada e com a sensação de que finalmente estava no caminho certo."
    },
    {
      image: "https://i.ibb.co/fzqRdz3Y/98248ef10df61b4b8f08917853ed5ec8.jpg",
      name: "Marcos Vinícius",
      info: "Belo Horizonte, MG • 51 anos",
      text: "Eu já tinha tentado mudar a alimentação várias vezes, mas sempre desistia rápido porque tudo parecia difícil demais. Com o método ficou mais simples de encaixar na rotina e isso fez muita diferença. Pela primeira vez eu consegui manter o processo sem aquela sensação de estar começando uma dieta impossível."
    },
    {
      image: "https://i.ibb.co/6RSPTdsG/5ebcace4c6388bc7a0b203a081fa3f28.jpg",
      name: "Juliana Ferreira",
      info: "Curitiba, PR • 38 anos",
      text: "Quando vi no exame que estava com gordura no fígado, fiquei assustada e achei que teria que mudar tudo de uma vez. Isso me travou muito no começo. O Fígado Leve me ajudou porque mostrou um caminho mais leve, sem radicalismo. Hoje eu consigo seguir com mais tranquilidade e sem viver com culpa."
    }
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-[#F5F7F6]">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block bg-[#1A9E8F] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6">
          Depoimentos reais
        </div>
        
        <h2 className="text-[#0D3B5E] text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
          Mais de 2.000 pessoas já começaram a reorganizar sua alimentação
        </h2>

        <div className="flex items-center justify-center gap-1 mb-12">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill="#F5A623" className="text-[#F5A623]" />
          ))}
          <span className="ml-2 text-sm font-bold text-[#0D3B5E]">4,9/5 de 2.464 usuários</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className={`reveal-element bg-white p-8 rounded-2xl shadow-sm border border-[#E5E7EB] relative text-left transition-all duration-1000 flex flex-col ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-[#1A9E8F] flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-[#0D3B5E] font-bold text-base leading-none mb-1">{t.name}</h4>
                  <p className="text-[#4B5563] text-xs font-medium">{t.info}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F5A623" className="text-[#F5A623]" />
                ))}
              </div>
              <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhatYouGetDivider = () => (
  <div className="w-full bg-[#0D3B5E] py-8 md:py-12 flex justify-center items-center">
    <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center px-4">
      O QUE VOU RECEBER?
    </h2>
  </div>
);

const HowYouGetDivider = () => (
  <div className="w-full bg-[#0D3B5E] py-8 md:py-12 flex justify-center items-center">
    <h2 className="text-white text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center px-4">
      COMO VOU RECEBER?
    </h2>
  </div>
);

const HowYouGetSteps = () => {
  const steps = [
    {
      icon: <Inbox className="w-6 h-6 md:w-8 md:h-8 text-[#0D3B5E]" strokeWidth={1.5} />,
      text: (
        <>
          Após confirmação do pagamento, um acesso individual será enviado ao seu e-mail para você acessar o conteúdo. Verifique <strong className="font-bold text-[#0D3B5E]">CAIXA DE SPAM E LIXO ELETRÔNICO.</strong>
        </>
      )
    },
    {
      icon: <Mail className="w-6 h-6 md:w-8 md:h-8 text-[#0D3B5E]" strokeWidth={1.5} />,
      text: (
        <>
          O material é <strong className="font-bold text-[#0D3B5E]">DIGITAL</strong> e o acesso é feito pela plataforma. Você pode estudar nos seus dispositivos, como Computador, Tablet e Celular.
        </>
      )
    },
    {
      icon: <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-[#0D3B5E]" strokeWidth={1.5} />,
      text: (
        <>
          <strong className="font-bold text-[#0D3B5E]">Pronto!</strong> Agora inicie sua Jornada de conhecimento rumo ao <strong className="font-bold text-[#0D3B5E]">Fígado Leve.</strong>
        </>
      )
    }
  ];

  return (
    <section className="py-10 md:py-20 px-4 md:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        
        {/* Instant Access Badge */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F5F7F6] text-[#F5A623] px-4 py-2 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-lg shadow-sm border border-[#F5A623]/10">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
            <span>Acesso Instantâneo</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-6 md:space-y-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-row items-start gap-4 md:gap-8 text-left">
              
              {/* Icon Container */}
              <div className="relative shrink-0">
                <div className="bg-[#F5F7F6] w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center">
                  {step.icon}
                </div>
                {/* Number Badge */}
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-[#0D3B5E] text-white w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-2 md:border-4 border-white">
                  {index + 1}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 pt-0 md:pt-1">
                <p className="text-[#4B5563] text-[15px] md:text-lg leading-relaxed">
                  {step.text}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const DeliverablesBadge = () => {
  const items = [
    "Protocolo Fígado Leve – 3R da Desinflamação Hepática",
    "Plano Alimentar Anti-Inflamação – 30 Dias Guiados",
    "Guia Simplificado de Interpretação dos Exames do Fígado",
    "Cardápio de Emergência – 7 Dias de Desinflamação",
    "Lista Inteligente de Substituições Alimentares",
    "Guia dos 15 Alimentos que Mais Inflamam o Fígado",
    "Tabela Visual de Combinações Alimentares Anti-Inflamação",
    "Checklist Diário do Método 3R",
    "Planner Semanal do Fígado Leve",
    "Áudios Curtos de Reprogramação Anti-Radicalismo",
    "Mini Guia: Sono, Estresse e Gordura no Fígado"
  ];

  return (
    <section className="pt-16 md:pt-24 pb-10 md:pb-12 px-4 md:px-6 bg-white relative">
      <div className="max-w-3xl mx-auto relative">
        {/* Floating Icon */}
        <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-[#1A9E8F] w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg">
            <Check className="text-white w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#F5F7F6] rounded-[24px] md:rounded-[32px] pt-12 md:pt-16 pb-8 md:pb-12 px-5 md:px-12 shadow-sm">
          <ul className="space-y-3 md:space-y-5">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 md:gap-4">
                <div className="bg-[#1A9E8F] rounded-full p-1 md:p-1.5 mt-0.5 md:mt-1 shrink-0">
                  <Check className="text-white w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                </div>
                <span className="text-[#0D3B5E] font-medium text-[15px] md:text-lg leading-snug">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

const SolutionSection = () => {
  const solutions = [
    {
      title: "Plano Hepático Específico",
      desc: "Um método passo a passo focado 100% em desinflamar o fígado, sem dietas genéricas que não funcionam para você."
    },
    {
      title: "Alimentação Energética",
      desc: "Descubra os alimentos exatos que aliviam a digestão, desincham o corpo e devolvem sua disposição diária."
    },
    {
      title: "Clareza Absoluta",
      desc: "Um guia definitivo do que comer e do que evitar, acabando com o medo e a confusão na hora das refeições."
    }
  ];

  return (
    <section className="py-16 px-6 bg-[#F5F7F6] text-center">
      <div className="max-w-5xl mx-auto">
        <div className="inline-block bg-[#F5A623] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase mb-4 tracking-widest">
          A SOLUÇÃO DEFINITIVA
        </div>
        
        <h2 className="text-[#0D3B5E] text-2xl md:text-4xl font-bold mb-10 tracking-tight">
          O que você vai encontrar no Protocolo Fígado Leve
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-12">
          {solutions.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[12px] shadow-sm border border-[#1A9E8F]/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1A9E8F]"></div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#1A9E8F]/10 p-2 rounded-full shrink-0">
                  <CheckCircle2 className="text-[#1A9E8F] w-6 h-6" />
                </div>
                <h3 className="text-[#0D3B5E] font-bold text-lg leading-snug">
                  {item.title}
                </h3>
              </div>
              <p className="text-[#4B5563] text-sm md:text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <button 
          id="cta-solution"
          onClick={() => {
            trackEvent('InitiateCheckout', { content_name: 'Solution CTA' });
            document.getElementById('bonus-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full max-w-md mx-auto bg-[#1A9E8F] hover:bg-[#1A9E8F] text-white font-bold py-5 px-6 rounded-full shadow-[0_8px_0_#137A6E] transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-3 uppercase text-sm animate-cta-pulse"
        >
          QUERO CUIDAR DO MEU FÍGADO AGORA
          <ArrowRight size={18} strokeWidth={3} />
        </button>
      </div>
    </section>
  );
};

const TargetAudienceSection = () => {
  const notFor = [
    "Procura uma solução rápida ou milagrosa",
    "Quer continuar fazendo tudo igual e esperar resultado",
    "Acredita que precisa cortar tudo de uma vez",
    "Não quer mudar nenhum hábito do dia a dia",
    "Prefere soluções complexas em vez de simples",
    "Não pretende aplicar nada na prática"
  ];

  const isFor = [
    "Quer melhorar o fígado sem radicalismo",
    "Busca algo simples e possível na vida real",
    "Está cansado de tentar e desistir",
    "Quer clareza do que fazer",
    "Está disposto a dar pequenos passos",
    "Quer um processo organizado e sustentável"
  ];

  return (
    <section className="py-20 px-6 bg-[#F5F7F6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[#0D3B5E] text-3xl md:text-4xl font-bold mb-4 tracking-tight leading-tight">
            O Protocolo Fígado Leve não foi feito para qualquer pessoa…
          </h2>
          <p className="text-[#4B5563] text-base md:text-lg font-medium">
            Ele foi criado para quem quer resultado real, sem radicalismo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Para quem não é */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB]">
            <h3 className="text-[#0D3B5E] font-bold text-xl mb-6 text-center">Para quem não é</h3>
            <ul className="space-y-4">
              {notFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="bg-[#EF4444]/10 rounded-full p-1 mt-0.5 shrink-0">
                    <X className="text-[#EF4444] w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="text-[#4B5563] font-medium text-[15px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Para quem é */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5E7EB]">
            <h3 className="text-[#0D3B5E] font-bold text-xl mb-6 text-center">Mas esse método é para você se:</h3>
            <ul className="space-y-4">
              {isFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="bg-[#1A9E8F]/10 rounded-full p-1 mt-0.5 shrink-0">
                    <Check className="text-[#1A9E8F] w-4 h-4" strokeWidth={3} />
                  </div>
                  <span className="text-[#4B5563] font-medium text-[15px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const PreviewSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Forçar atributos essenciais para mobile
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;

    const attemptPlay = async () => {
      try {
        await video.play();
        setShowPlayButton(false);
      } catch (error) {
        console.log("Autoplay bloqueado pelo navegador (possível Modo de Pouca Energia):", error);
        setShowPlayButton(true);
      }
    };

    // Usar IntersectionObserver para dar play apenas quando o vídeo aparecer na tela
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          attemptPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 } // Dispara quando 50% do vídeo estiver visível
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setShowPlayButton(false);
    }
  };

  const features = [
    "Módulos explicativos",
    "Vídeos resumidos",
    "Conteúdos em áudio",
    "Materiais visuais práticos"
  ];

  return (
    <section className="py-16 md:py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 flex flex-col items-center">
          <img 
            src="https://i.ibb.co/3m8hT13J/logo-removebg-preview.png" 
            alt="Protocolo Fígado Leve Logo" 
            className="h-48 md:h-60 -mt-8 md:-mt-12 -mb-8 md:-mb-12 object-contain"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-[#0D3B5E] text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
            Veja como funciona o Protocolo Fígado Leve por dentro
          </h2>
          <p className="text-[#1A9E8F] font-bold text-xs md:text-sm uppercase tracking-widest max-w-2xl mx-auto">
            Você vai aprender de forma simples, prática e aplicável no seu dia a dia.
          </p>
        </div>

        {/* Video Player */}
        <div className="relative w-full max-w-sm mx-auto mb-16 md:mb-20 overflow-hidden rounded-2xl shadow-xl bg-[#0D3B5E] aspect-[9/16] flex items-center justify-center group">
          <video 
            ref={videoRef}
            src="https://res.cloudinary.com/dlfo0rdxp/video/upload/v1774484193/0319_1_1_v5q5mi.mp4"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls={!showPlayButton} // Oculta os controles nativos se o botão gigante estiver visível
            preload="auto"
            onPlay={() => setShowPlayButton(false)}
            onPause={() => setShowPlayButton(true)}
          />
          
          {/* Overlay de Play (Aparece se o autoplay falhar, ex: Modo Pouca Energia) */}
          {showPlayButton && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 cursor-pointer backdrop-blur-[2px]"
              onClick={handleManualPlay}
            >
              <div className="bg-[#1A9E8F] w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(26,158,143,0.6)] animate-pulse">
                <PlayCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

const BenefitsAndAvoidanceSection = () => {
  const gains = [
    <>Entender <strong className="font-bold text-[#1A9E8F]">o que realmente está causando a gordura no seu fígado</strong></>,
    <>Saber exatamente <strong className="font-bold">o que fazer, passo a passo, sem confusão</strong></>,
    <><strong className="font-bold text-[#1A9E8F]">Reduzir a inflamação</strong> sem precisar de dieta radical ou sacrifício</>,
    <>Criar uma <strong className="font-bold">rotina simples e fácil de manter</strong> no dia a dia</>,
    <>Sentir que está <strong className="font-bold">evoluindo de verdade</strong> — sem pressão ou culpa</>,
    <>Ter <strong className="font-bold text-[#1A9E8F]">controle real</strong> sobre sua alimentação e seus hábitos</>
  ];

  const losses = [
    <>Continuar tentando <strong className="font-bold">dietas que prometem e não entregam</strong></>,
    <>Ficar perdido sem saber por onde começar</>,
    <>Cair no <strong className="font-bold text-[#EF4444]">efeito sanfona</strong> de começar, desistir e recomeçar do zero</>,
    <>Cometer erros que <strong className="font-bold">pioram o quadro sem você perceber</strong></>,
    <>Se afogar em excesso de informação sem resultado nenhum</>,
    <>Perder <strong className="font-bold text-[#EF4444]">tempo, energia e dinheiro</strong> sem ver mudança real</>
  ];

  return (
    <section className="py-20 px-6 bg-[#0D3B5E]">
      <div className="max-w-4xl mx-auto">
        
        {/* Gains Block */}
        <div className="mb-16">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-10 text-center tracking-tight leading-tight">
            O que você vai conquistar com o Protocolo Fígado Leve
          </h2>
          <div className="bg-[#0D3B5E]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 shadow-lg">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gains.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="bg-[#1A9E8F]/20 rounded-full p-1.5 mt-0.5 shrink-0">
                    <Check className="text-[#1A9E8F] w-5 h-5" strokeWidth={3} />
                  </div>
                  <span className="text-white/90 font-medium text-base leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="flex justify-center items-center mb-16 opacity-50">
          <div className="w-16 h-[1px] bg-white/30"></div>
          <div className="mx-4 text-white/50">
            <ShieldCheck size={24} />
          </div>
          <div className="w-16 h-[1px] bg-white/30"></div>
        </div>

        {/* Losses Block */}
        <div>
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-10 text-center tracking-tight leading-tight">
            O que você vai evitar com o Protocolo Fígado Leve
          </h2>
          <div className="bg-[#0D3B5E]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 shadow-lg">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {losses.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="bg-[#EF4444]/20 rounded-full p-1.5 mt-0.5 shrink-0">
                    <X className="text-[#EF4444] w-5 h-5" strokeWidth={3} />
                  </div>
                  <span className="text-white/90 font-medium text-base leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};

const BonusSection = () => {
  return (
    <div id="bonus-section" className="flex flex-col w-full font-poppins">
      {/* Black Header */}
      <div className="bg-[#0D3B5E] text-white py-8 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
          👀 Antes de você<br />continuar...
        </h2>
      </div>

      {/* Main Content */}
      <section className="py-12 md:py-16 px-6 bg-white flex flex-col items-center text-center font-poppins">
        
        <h2 className="text-xl md:text-2xl text-black font-medium mb-12 max-w-md leading-tight">
          Escolhendo o <strong className="font-black">COMBO<br/>COMPLETO</strong> você recebe<br/>
          de <strong className="text-red-600 font-black">BÔNUS</strong> todos esses <strong className="font-black">MATERIAIS</strong>:<br/>
          <span className="text-2xl mt-2 inline-block">👇</span>
        </h2>

        <div className="w-full max-w-sm space-y-8 flex flex-col items-center">
          
          {/* Bonus 1 */}
          <div className="relative w-full flex flex-col items-center">
            <div className="bg-[#007A33] text-white font-black text-2xl px-8 py-2 rounded-full flex items-center gap-2 z-10 shadow-md">
              <span>🎁</span>
              <span>BÔNUS 1</span>
              <span>🎁</span>
            </div>
            <div className="flex justify-between w-32 -mt-1 z-0">
              <div className="w-0.5 h-6 bg-black"></div>
              <div className="w-0.5 h-6 bg-black"></div>
            </div>
            <div className="bg-white border-2 border-dashed border-black rounded-[2rem] px-4 py-5 w-full text-center z-10 -mt-1">
              <h3 className="text-[28px] md:text-[34px] font-black uppercase mb-1 leading-[1.1] text-black">
                PLANO ALIMENTAR<br/>ANTI-INFLAMAÇÃO<br/>
                <span className="text-[#1A9E8F]">30 DIAS GUIADOS</span>
              </h3>
              <img src="https://i.ibb.co/W4GjzVXW/bonus1.png" alt="Plano Alimentar Anti-Inflamação" className="w-full h-auto my-0 object-contain scale-110 transform origin-center" />
              <div className="text-base md:text-lg font-bold mb-2 leading-tight mt-0">
                <span className="text-black">DE: </span>
                <span className="text-red-600 line-through">R$ 47</span><br/>
                <span className="text-black">HOJE: </span>
                <span className="text-[#00C853]">GRÁTIS!</span>
              </div>
              <p className="text-xs md:text-sm text-black leading-snug font-medium px-1">
                Um plano alimentar <strong className="font-bold">prático e direto ao ponto</strong> que te guia dia a dia para <strong className="font-bold text-[#1A9E8F]">reduzir a inflamação do fígado</strong> de forma <strong className="font-bold">simples, segura e sem radicalismo</strong>.
              </p>
            </div>
          </div>

          {/* Bonus 2 */}
          <div className="relative w-full flex flex-col items-center">
            <div className="bg-[#007A33] text-white font-black text-2xl px-8 py-2 rounded-full flex items-center gap-2 z-10 shadow-md">
              <span>🎁</span>
              <span>BÔNUS 2</span>
              <span>🎁</span>
            </div>
            <div className="flex justify-between w-32 -mt-1 z-0">
              <div className="w-0.5 h-6 bg-black"></div>
              <div className="w-0.5 h-6 bg-black"></div>
            </div>
            <div className="bg-white border-2 border-dashed border-black rounded-[2rem] px-4 py-5 w-full text-center z-10 -mt-1">
              <h3 className="text-[28px] md:text-[34px] font-black uppercase mb-1 leading-[1.1] text-black">
                GUIA DE<br/>INTERPRETAÇÃO DOS<br/>
                <span className="text-[#1A9E8F]">EXAMES DO FÍGADO</span>
              </h3>
              <img src="https://i.ibb.co/tMZXDK3g/bonu2.png" alt="Guia de Exames do Fígado" className="w-full h-auto my-0 object-contain scale-110 transform origin-center" />
              <div className="text-base md:text-lg font-bold mb-2 leading-tight mt-0">
                <span className="text-black">DE: </span>
                <span className="text-red-600 line-through">R$ 47</span><br/>
                <span className="text-black">HOJE: </span>
                <span className="text-[#00C853]">GRÁTIS!</span>
              </div>
              <p className="text-xs md:text-sm text-black leading-snug font-medium px-1">
                Um guia detalhado e direto ao ponto com tudo que você precisa saber para <strong className="font-bold text-[#1A9E8F]">entender seus exames do fígado</strong> — <strong className="font-bold text-black">sem precisar de médico para traduzir cada resultado.</strong>
              </p>
            </div>
          </div>

          {/* Bonus 3 */}
          <div className="relative w-full flex flex-col items-center">
            <div className="bg-[#007A33] text-white font-black text-2xl px-8 py-2 rounded-full flex items-center gap-2 z-10 shadow-md">
              <span>🎁</span>
              <span>BÔNUS 3</span>
              <span>🎁</span>
            </div>
            <div className="flex justify-between w-32 -mt-1 z-0">
              <div className="w-0.5 h-6 bg-black"></div>
              <div className="w-0.5 h-6 bg-black"></div>
            </div>
            <div className="bg-white border-2 border-dashed border-black rounded-[2rem] px-4 py-5 w-full text-center z-10 -mt-1">
              <h3 className="text-[28px] md:text-[34px] font-black uppercase mb-1 leading-[1.1] text-black">
                CARDÁPIO DE EMERGÊNCIA<br/>
                <span className="text-[#1A9E8F]">7 DIAS DE DESINFLAMAÇÃO</span>
              </h3>
              <img src="https://i.ibb.co/PvVsJBPT/bonus3.png" alt="Cardápio de Emergência" className="w-full h-auto my-0 object-contain scale-110 transform origin-center" />
              <div className="text-base md:text-lg font-bold mb-2 leading-tight mt-0">
                <span className="text-black">DE: </span>
                <span className="text-red-600 line-through">R$ 47</span><br/>
                <span className="text-black">HOJE: </span>
                <span className="text-[#00C853]">GRÁTIS!</span>
              </div>
              <p className="text-xs md:text-sm text-black leading-snug font-medium px-1">
                Um guia detalhado com <strong className="font-bold text-[#1A9E8F]">7 dias de cardápio prontos</strong> para você começar a <strong className="font-bold text-[#1A9E8F]">desinflamar o fígado imediatamente</strong> — <strong className="font-bold text-black">sem precisar pensar, só seguir.</strong>
              </p>
            </div>
          </div>

          {/* Bonus 4 (+ 7 Bonus) */}
          <div className="relative w-full flex flex-col items-center">
            <div className="bg-[#6200EA] text-white font-black text-2xl px-6 py-2 rounded-full flex items-center gap-2 z-10 shadow-md">
              <span>🎁</span>
              <span>+ 7 BÔNUS</span>
              <span>🎁</span>
            </div>
            <div className="flex justify-between w-32 -mt-1 z-0">
              <div className="w-0.5 h-6 bg-black"></div>
              <div className="w-0.5 h-6 bg-black"></div>
            </div>
            <div className="bg-white border-2 border-dashed border-black rounded-[2rem] px-4 py-5 w-full text-center z-10 -mt-1">
              <ul className="text-left text-[11px] font-bold text-black space-y-2 mb-4 px-2">
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="#00C853" stroke="white" />
                  <span className="font-bold">Lista Inteligente de Substituições Alimentares</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="#00C853" stroke="white" />
                  <span className="font-bold">Guia dos 15 Alimentos que Mais Inflamam o Fígado</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="#00C853" stroke="white" />
                  <span className="font-bold">Tabela Visual de Combinações Alimentares Anti-Inflamação</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="#00C853" stroke="white" />
                  <span className="font-bold">Checklist Diário do Método 3R</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="#00C853" stroke="white" />
                  <span className="font-bold">Planner Semanal do Fígado Leve</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="#00C853" stroke="white" />
                  <span className="font-bold">Áudios Curtos de Reprogramação Anti-Radicalismo</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="#00C853" stroke="white" />
                  <span className="font-bold">Mini Guia: Sono, Estresse e Gordura no Fígado</span>
                </li>
              </ul>
              <img src="https://i.ibb.co/TDC1Ps8n/bundle-7-bonus.png" alt="+ 7 Bonus" className="w-full h-auto my-0 object-contain scale-110 transform origin-center" />
              <div className="text-base md:text-lg font-bold mb-2 leading-tight mt-0">
                <span className="text-black">DE: </span>
                <span className="text-red-600 line-through">R$ 147</span><br/>
                <span className="text-black">HOJE: </span>
                <span className="text-[#00C853]">GRÁTIS!</span>
              </div>
              <p className="text-xs md:text-sm text-black leading-snug font-medium px-1">
                Esses materiais foram cuidadosamente criados para te dar <strong className="font-bold text-black">tudo que você precisa</strong> para desinflamar o fígado de verdade — <strong className="font-bold text-[#1A9E8F]">sem achismo, sem radicalismo, sem complicação.</strong>
              </p>
            </div>
          </div>

          {/* Combo Completo Confirmation */}
          <div className="mt-12 text-center px-4">
            <span className="text-3xl block mb-2">👆</span>
            <p className="text-xl md:text-2xl font-medium text-black leading-tight max-w-2xl mx-auto">
              Escolhendo o <strong className="font-black">COMBO COMPLETO</strong> você tem <br className="md:hidden" />
              <span className="text-red-600 font-black">ACESSO À TODOS</span> os materiais <strong className="font-black">ACIMA!</strong>
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

const Offer = ({ onBasicClick }: { onBasicClick: (e: React.MouseEvent) => void }) => {
  return (
    <section className="py-24 px-6 bg-[#8c8c8c] relative overflow-hidden font-poppins" id="offer">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="mb-12">
          <p className="text-white text-xl md:text-2xl mb-4">
            Não perca tempo! <span className="font-bold uppercase">GARANTA AGORA O</span>
          </p>
          <img 
            src="https://i.ibb.co/Qvn6L8DP/logo-figado-leve-texto-branco.png" 
            alt="Protocolo Fígado Leve Logo" 
            className="h-48 md:h-60 mx-auto -mt-10 -mb-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-[#F5A623] text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            + 10 BÔNUS ESPECIAIS!
          </h2>
          <p className="text-white/80 font-medium text-base md:text-lg">
            Acesso imediato após a confirmação do pagamento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-center">
          
          {/* Plano Básico */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] shadow-sm p-8 flex flex-col text-left relative opacity-90 hover:opacity-100 transition-opacity">
            <div className="mb-6 text-center">
              <h3 className="text-[#0D3B5E] font-bold text-2xl mb-4 uppercase tracking-tight">PLANO BÁSICO</h3>
              
              <img 
                src="https://i.ibb.co/v639D7ZD/mockup-estudio-infinito-premium.png" 
                alt="Mockup Protocolo Fígado Leve" 
                className="w-full max-w-[200px] mx-auto mb-6 drop-shadow-xl"
                referrerPolicy="no-referrer"
              />

              <div className="flex flex-col items-center">
                <span className="text-[#EF4444] line-through text-lg font-bold">DE: R$57</span>
                <span className="text-[#4B5563] text-sm font-medium">POR APENAS</span>
                <div className="flex items-start text-[#F5A623]">
                  <span className="text-2xl font-bold mt-1 mr-1">R$</span>
                  <span className="text-6xl font-black tracking-tighter">10</span>
                </div>
              </div>
            </div>

            <div className="flex-grow space-y-6 mb-8">
              <ul className="space-y-3">
                {[
                  "Protocolo Fígado Leve", 
                  "Pagamento Único", 
                  "7 dias de Garantia", 
                  "3 Meses de Acesso"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={18} className="text-[#1A9E8F] shrink-0 mt-0.5" strokeWidth={3} />
                    <span className="text-[#0D3B5E] text-sm font-bold">{item}</span>
                  </li>
                ))}
                {[
                  "Bônus 1 — Plano Alimentar Anti-Inflamação 30 Dias Guiados",
                  "Bônus 2 — Guia Simplificado de Interpretação dos Exames do Fígado",
                  "Bônus 3 — Cardápio de Emergência 7 Dias de Desinflamação",
                  "Bônus 4 — Lista Inteligente de Substituições Alimentares",
                  "Bônus 5 — Guia dos 15 Alimentos que Mais Inflamam o Fígado",
                  "Bônus 6 — Tabela Visual de Combinações Alimentares Anti-Inflamação",
                  "Bônus 7 — Checklist Diário do Método 3R",
                  "Bônus 8 — Planner Semanal do Fígado Leve",
                  "Bônus 9 — Áudios Curtos de Reprogramação Anti-Radicalismo",
                  "Bônus 10 — Mini Guia: Sono, Estresse e Gordura no Fígado"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400">
                    <X size={18} className="text-gray-300 shrink-0 mt-0.5" strokeWidth={2} />
                    <span className="text-sm line-through">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-auto">
              <a 
                id="checkout-essencial"
                href="https://pay.wiapy.com/HrqBTS9Tk"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onBasicClick}
                className="w-full block text-center bg-[#F5A623] text-white py-4 rounded-xl font-bold text-base uppercase shadow-lg hover:bg-[#E09612] transition-colors mb-4"
              >
                COMPRAR O BÁSICO E RECEBER AGORA!
              </a>
              <p className="text-[10px] text-[#4B5563] text-center leading-tight">
                ACESSO GARANTIDO E IMEDIATO NO E-MAIL CADASTRADO OU <span className="font-bold text-[#F5A623]">SEU DINHEIRO DE VOLTA</span>
                <br /><br />
                Temos uma <span className="font-bold text-[#EF4444]">SUPER OFERTA</span> que se encaixa ainda mais com o seu perfil!
                <br />
                <span className="text-lg">⬇️</span>
              </p>
            </div>
          </div>

          {/* Plano Completo */}
          <div className="lg:col-span-7 bg-black rounded-[2.5rem] border-[4px] border-white p-8 md:p-10 flex flex-col text-left relative shadow-[0_20px_50px_rgba(245,166,35,0.2)] z-10 transform lg:scale-105">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#EF4444] text-white font-bold text-xs md:text-sm px-6 py-2 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap flex items-center gap-2">
              🔥 MAIS VENDIDO
            </div>

            <div className="text-center mb-6 mt-2">
              <h3 className="text-white font-black text-3xl md:text-4xl tracking-tight mb-1 uppercase">
                PLANO COMPLETO
              </h3>
              <p className="text-[#F5A623] font-bold text-sm md:text-base mb-4">
                Protocolo Fígado Leve + 10 Bônus Especiais!
              </p>
              
              <p className="text-[#F5A623] font-bold text-base md:text-lg mb-6">
                95% DAS PESSOAS OPTAM POR ESTA OFERTA!
              </p>

              <img 
                src="https://i.ibb.co/C5jhBbHT/bundle-compacto-total.png" 
                alt="Bundle Protocolo Fígado Leve" 
                className="w-full max-w-[450px] mx-auto mb-6 drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />

              <div className="flex flex-col items-center justify-center bg-[#1A1A1A] rounded-2xl py-6 border border-white/20">
                <span className="text-[#EF4444] line-through text-lg font-bold mb-1">DE: R$297</span>
                <span className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-1">POR APENAS</span>
                <div className="flex items-start text-[#F5A623] leading-none">
                  <span className="text-4xl font-bold mt-1 mr-1">R$</span>
                  <span className="text-8xl font-black tracking-tighter">37</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {/* Top Section - Green Checks */}
              <ul className="space-y-3">
                {[
                  "Protocolo Fígado Leve", 
                  "Pagamento Único", 
                  "30 dias de Garantia", 
                  "Acesso Vitalício"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#1A9E8F] shrink-0 mt-0.5" />
                    <span className="text-white font-bold text-sm md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <hr className="border-white/20" />

              {/* Bottom Section - Yellow Checks */}
              <ul className="space-y-3">
                {[
                  "Plano Alimentar Anti-Inflamação 30 Dias Guiados",
                  "Guia Simplificado de Interpretação dos Exames do Fígado",
                  "Cardápio de Emergência 7 Dias de Desinflamação",
                  "Lista Inteligente de Substituições Alimentares",
                  "Guia dos 15 Alimentos que Mais Inflamam o Fígado",
                  "Tabela Visual de Combinações Alimentares Anti-Inflamação",
                  "Checklist Diário do Método 3R",
                  "Planner Semanal do Fígado Leve",
                  "Áudios Curtos de Reprogramação Anti-Radicalismo",
                  "Mini Guia: Sono, Estresse e Gordura no Fígado"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#F5A623] shrink-0 mt-0.5" />
                    <span className="text-white font-bold text-sm md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-auto">
              <a 
                id="checkout-completo"
                href="https://pay.wiapy.com/2YN9oWQpwa"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Purchase', { value: 37.00, currency: 'BRL', content_name: 'Plano Completo' })}
                className="w-full block text-center bg-[#1A9E8F] text-white py-5 rounded-2xl font-black text-lg md:text-xl uppercase shadow-[0_10px_30px_rgba(26,158,143,0.3)] hover:bg-[#158578] transition-all animate-cta-pulse mb-6"
              >
                COMPRAR O COMPLETO E RECEBER AGORA!
              </a>
              
              <div className="text-center space-y-4">
                <p className="text-xs text-gray-300 leading-tight">
                  ACESSO GARANTIDO E IMEDIATO NO E-MAIL CADASTRADO OU <span className="font-bold text-[#F5A623]">SEU DINHEIRO DE VOLTA!</span>
                </p>
                <p className="text-sm font-bold text-[#EF4444] animate-pulse">
                  APROVEITE AGORA: ÚLTIMO DIA! <span className="font-medium text-gray-300">Você não verá essa oportunidade em outro momento!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Guarantee = () => {
  return (
    <section className="py-20 px-6 bg-[#F5F7F6] relative overflow-hidden">
      <div className="max-w-[680px] mx-auto text-center relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
          <div className="bg-white p-5 rounded-full shadow-[0_8px_24px_rgba(26,158,143,0.25)]">
            <ShieldCheck size={72} strokeWidth={1} className="text-[#1A9E8F]" />
            <div className="absolute inset-0 flex items-center justify-center pt-1.5">
              <span className="text-white font-bold text-xl">7</span>
            </div>
          </div>
        </div>

        <div className="inline-block bg-[#1A9E8F] text-white text-xs font-bold px-6 py-2 rounded-full uppercase tracking-wider mb-8 shadow-sm">
          🛡️ <span className="font-black">Garantia Incondicional de 7 Dias</span>
        </div>

        <h2 className="text-[#0D3B5E] text-3xl md:text-5xl font-bold mb-8 tracking-tight leading-tight">
          Você não tem nada a perder. Só a ganhar.
        </h2>

        <div className="text-[#4B5563] text-base md:text-lg leading-relaxed space-y-6 mb-10 font-medium">
          <p>
            Se por qualquer motivo você não ficar satisfeito com o Protocolo Fígado Leve, basta enviar um e-mail em até 7 dias após a compra e devolvemos <span className="font-bold text-black">100% do seu dinheiro</span>.
          </p>
          <p className="font-bold text-[#0D3B5E] text-xl">
            Sem perguntas, sem burocracia.
          </p>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqData = [
    { 
      question: "O programa é indicado para qualquer grau de gordura no fígado?", 
      answer: "O Fígado Leve™ foi desenvolvido para pessoas que receberam diagnóstico de gordura no fígado, independente do grau, e querem organizar a alimentação de forma prática e sustentável. Em casos mais avançados, recomendamos manter o acompanhamento médico paralelo." 
    },
    { 
      question: "Preciso de acompanhamento médico para seguir o plano?", 
      answer: "O Fígado Leve™ é um programa de organização alimentar educacional e não substitui o acompanhamento médico. Ele complementa as orientações do seu médico com um plano prático para o dia a dia — dando a direção concreta que muitas vezes falta após a consulta." 
    },
    { 
      question: "É difícil de seguir no dia a dia?", 
      answer: "Não. O método foi criado justamente para pessoas com rotina real — sem tempo para receitas complicadas ou restrições impossíveis de manter. A maioria dos usuários relata que conseguiu seguir o plano já na primeira semana, sem sofrimento." 
    },
    { 
      question: "Como vou receber o material após a compra?", 
      answer: "Imediatamente após a confirmação do pagamento você recebe o acesso por e-mail. Todo o conteúdo é digital e pode ser acessado pelo celular, tablet ou computador — a qualquer hora e em qualquer lugar." 
    },
    { 
      question: "A garantia de 30 dias vale mesmo?", 
      answer: "Vale 100%. Se por qualquer motivo você não ficar satisfeito(a), é só entrar em contato dentro de 30 dias e devolvemos o valor integral. Sem questionamentos, sem burocracia." 
    }
  ];

  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      <div className="max-w-[780px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#1A9E8F] text-white text-[10px] font-bold px-5 py-1.5 rounded-none uppercase tracking-[0.2em] mb-6">
            TIRE SUAS DÚVIDAS
          </div>
          <h2 className="text-[#0D3B5E] text-3xl md:text-5xl font-bold mb-4 tracking-tight">Perguntas Frequentes</h2>
          <p className="text-[#4B5563] font-semibold text-sm">Respondemos as dúvidas mais comuns de quem está considerando começar.</p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, i) => (
            <FAQItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-l-[3px] transition-all duration-300 ${isOpen ? 'border-[#1A9E8F]' : 'border-transparent'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-5 md:p-6 flex justify-between items-center text-left focus:outline-none"
      >
        <span className="font-bold text-[#0D3B5E] text-base md:text-lg pr-4">{question}</span>
        <span className={`text-[#1A9E8F] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
           <Plus size={20} />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="px-5 md:px-6 pb-6 text-[#4B5563] font-semibold text-sm md:text-base leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const Disclaimer = () => (
  <section className="bg-[#F5F7F6] py-12 px-6 border-t border-[#E5E7EB] font-poppins">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 text-center">
        {/* Bloco 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB]/50 flex flex-col items-center gap-3 max-w-sm">
          <div className="flex items-center gap-2 text-[#0D3B5E]">
            <AlertCircle size={20} className="text-[#1A9E8F]" />
            <h4 className="font-bold text-sm uppercase tracking-wider">Aviso importante</h4>
          </div>
          <p className="text-[#4B5563] text-xs leading-relaxed font-medium">
            Este conteúdo não substitui o acompanhamento médico profissional. Consulte sempre seu médico para diagnósticos e tratamentos.
          </p>
        </div>

        {/* Bloco 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB]/50 flex flex-col items-center gap-3 max-w-sm">
          <div className="flex items-center gap-2 text-[#0D3B5E]">
            <Activity size={20} className="text-[#1A9E8F]" />
            <h4 className="font-bold text-sm uppercase tracking-wider">Sobre os resultados</h4>
          </div>
          <p className="text-[#4B5563] text-xs leading-relaxed font-medium">
            Os resultados podem variar de pessoa para pessoa. Este produto não oferece garantias de resultados específicos.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#0D3B5E] text-white py-10 px-6 relative z-10 font-poppins">
    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
      <div className="text-white/60 text-xs font-medium text-center">
        © 2025 Fígado Leve™ — Todos os direitos reservados
      </div>
    </div>
  </footer>
);

const UpsellModal = ({ isOpen, onClose, onContinueBasic }: { isOpen: boolean; onClose: () => void; onContinueBasic: () => void }) => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDecline = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onContinueBasic();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto no-scrollbar pt-8 md:pt-4">
        <motion.div 
          key={step}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-2xl relative my-4 md:my-8 flex flex-col items-center"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 z-20 p-2"
          >
            <X size={32} />
          </button>

          {/* Header Section */}
          <div className="w-full text-center mb-10 flex flex-col items-center px-4">
            <h2 className="text-[#E2FF00] text-2xl md:text-4xl font-black mb-8 uppercase tracking-wide">
              {step === 1 ? 'ESPERA!' : 'ÚLTIMA CHANCE!'}
            </h2>
            <p className="text-white text-2xl md:text-4xl font-bold mb-10 leading-snug max-w-3xl">
              Não tome essa decisão antes de conferir essa <span className="text-[#E2FF00]">SUPER CONDIÇÃO ESPECIAL</span> que preparamos para você.
            </p>
            <p className="text-[#E2FF00] font-black text-2xl md:text-4xl uppercase tracking-widest">
              (APENAS HOJE)
            </p>
          </div>

          {/* Exact copy of Plano Completo card */}
          <div className="bg-black rounded-[2.5rem] border-[4px] border-white p-8 md:p-10 flex flex-col text-left relative shadow-[0_20px_50px_rgba(245,166,35,0.2)] z-10 w-full">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#EF4444] text-white font-bold text-xs md:text-sm px-6 py-2 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap flex items-center gap-2">
              🔥 MAIS VENDIDO
            </div>

            <div className="text-center mb-6 mt-2">
              <h3 className="text-white font-black text-3xl md:text-4xl tracking-tight mb-1 uppercase">
                PLANO COMPLETO
              </h3>
              <p className="text-[#F5A623] font-bold text-sm md:text-base mb-4">
                Protocolo Fígado Leve + 10 Bônus Especiais!
              </p>
              
              <p className="text-[#F5A623] font-bold text-base md:text-lg mb-6">
                95% DAS PESSOAS OPTAM POR ESTA OFERTA!
              </p>

              <img 
                src="https://i.ibb.co/C5jhBbHT/bundle-compacto-total.png" 
                alt="Bundle Protocolo Fígado Leve" 
                className="w-full max-w-[450px] mx-auto mb-6 drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />

              <div className="flex flex-col items-center justify-center bg-[#1A1A1A] rounded-2xl py-6 border border-white/20">
                <span className="text-[#EF4444] line-through text-lg font-bold mb-1">DE: R$297</span>
                <span className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-1">POR APENAS</span>
                <div className="flex items-start text-[#F5A623] leading-none">
                  <span className="text-4xl font-bold mt-1 mr-1">R$</span>
                  {step === 1 ? (
                    <span className="text-8xl font-black tracking-tighter">27</span>
                  ) : (
                    <span className="text-8xl font-black tracking-tighter">19<span className="text-5xl">,90</span></span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {/* Top Section - Green Checks */}
              <ul className="space-y-3">
                {[
                  "Protocolo Fígado Leve", 
                  "Pagamento Único", 
                  "30 dias de Garantia", 
                  "Acesso Vitalício"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#1A9E8F] shrink-0 mt-0.5" />
                    <span className="text-white font-bold text-sm md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <hr className="border-white/20" />

              {/* Bottom Section - Yellow Checks */}
              <ul className="space-y-3">
                {[
                  "Plano Alimentar Anti-Inflamação 30 Dias Guiados",
                  "Guia Simplificado de Interpretação dos Exames do Fígado",
                  "Cardápio de Emergência 7 Dias de Desinflamação",
                  "Lista Inteligente de Substituições Alimentares",
                  "Guia dos 15 Alimentos que Mais Inflamam o Fígado",
                  "Tabela Visual de Combinações Alimentares Anti-Inflamação",
                  "Checklist Diário do Método 3R",
                  "Planner Semanal do Fígado Leve",
                  "Áudios Curtos de Reprogramação Anti-Radicalismo",
                  "Mini Guia: Sono, Estresse e Gordura no Fígado"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-[#F5A623] shrink-0 mt-0.5" />
                    <span className="text-white font-bold text-sm md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-auto">
              <a 
                id="checkout-completo-upsell"
                href={step === 1 ? "https://pay.wiapy.com/iBpg-3qq7" : "https://pay.wiapy.com/75EIStgfs"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Purchase_Upsell', { value: step === 1 ? 27.00 : 19.90, currency: 'BRL', content_name: `Plano Completo Upsell Step ${step}` })}
                className="w-full block text-center bg-[#1A9E8F] text-white py-5 rounded-2xl font-black text-lg md:text-xl uppercase shadow-[0_10px_30px_rgba(26,158,143,0.3)] hover:bg-[#158578] transition-all animate-cta-pulse mb-6"
              >
                COMPRAR O COMPLETO E RECEBER AGORA!
              </a>
              
              <div className="text-center space-y-4 mb-6">
                <p className="text-xs text-gray-300 leading-tight">
                  ACESSO GARANTIDO E IMEDIATO NO E-MAIL CADASTRADO OU <span className="font-bold text-[#F5A623]">SEU DINHEIRO DE VOLTA!</span>
                </p>
                <p className="text-sm font-bold text-[#EF4444] animate-pulse">
                  APROVEITE AGORA: ÚLTIMO DIA! <span className="font-medium text-gray-300">Você não verá essa oportunidade em outro momento!</span>
                </p>
              </div>

              <div className="text-center border-t border-white/20 pt-6">
                <button 
                  onClick={handleDecline}
                  className="text-gray-400 text-sm font-bold underline hover:text-white transition-colors"
                >
                  Não, quero continuar com o básico.
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- Main App Component ---

export default function App() {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);

  const handleBasicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsUpsellOpen(true);
    trackEvent('Click_Basic_Checkout');
  };

  const handleContinueBasic = () => {
    setIsUpsellOpen(false);
    window.open('https://pay.wiapy.com/HrqBTS9Tk', '_blank');
    trackEvent('Purchase', { value: 10.00, currency: 'BRL', content_name: 'Plano Básico' });
  };

  useEffect(() => {
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', 'user_' + Math.random().toString(36).substring(2, 15));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-[#1A9E8F]/10 antialiased overflow-x-hidden no-scrollbar font-poppins">
      <NotificationPopup />
      <TopBanner />
      <HeaderRating />
      
      <main>
        <Hero />
        <WhatYouGetDivider />
        <DeliverablesBadge />
        <HowYouGetDivider />
        <HowYouGetSteps />
        <Identification />
        <SolutionSection />
        <PreviewSection />
        <BenefitsAndAvoidanceSection />
        <TargetAudienceSection />
        <BonusSection />
        <HowYouGetDivider />
        <HowYouGetSteps />
        <EditorialTrustSection />
        <ExpertBioSection />
        <NewTestimonialsSection />
        <Offer onBasicClick={handleBasicClick} />
        <HowYouGetDivider />
        <HowYouGetSteps />
        <BenefitsAndAvoidanceSection />
        <PreviewSection />
        <Guarantee />
        <FAQ />
        <Disclaimer />
      </main>

      <Footer />
      <UpsellModal 
        isOpen={isUpsellOpen} 
        onClose={() => setIsUpsellOpen(false)} 
        onContinueBasic={handleContinueBasic} 
      />
    </div>
  );
}
