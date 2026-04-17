import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  ArrowDown,
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
  XCircle,
  PlayCircle,
  Calendar,
  Headphones,
  Moon,
  Infinity,
  MonitorPlay,
  CalendarCheck,
  AlertCircle,
  Activity,
  Globe,
  Shield,
  RefreshCw,
  Leaf,
  HelpCircle,
  MessageCircle,
  AlertTriangle,
  Instagram,
  FileText,
  TrendingUp,
  Search,
  Flame,
  Utensils,
  Heart,
  Layers,
  VolumeX
} from 'lucide-react';

declare global {
  interface Window {
    fbq: any;
  }
}

// --- Tracking Helper ---

const trackEvent = async (eventName: string, customData: any = {}) => {
  // Safeguard: if customData is a React SyntheticEvent or a DOM Event, don't send it
  if (customData && (customData.nativeEvent || customData instanceof Event)) {
    customData = {};
  }

  // Client-side Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, customData);
  }

  // Server-side CAPI
  try {
    let userId = undefined;
    try {
      userId = localStorage.getItem('user_id') || undefined;
    } catch (e) {
      // Ignore
    }

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
          external_id: userId
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
  <>
    <div className="fixed top-0 left-0 w-full z-[100] bg-[#0D3B5E] text-white py-2.5 px-4 text-center text-[10px] font-bold flex items-center justify-center gap-2 uppercase tracking-tight">
      <Zap size={12} className="text-[#F5A623] fill-[#F5A623]" />
      <span>SE SEU EXAME APONTOU GORDURA NO FÍGADO, ESSA PÁGINA É PARA VOCÊ</span>
      <Zap size={12} className="text-[#F5A623] fill-[#F5A623]" />
    </div>
    <div className="h-[34px] w-full pointer-events-none" aria-hidden="true" />
  </>
);

const HeaderRating = () => (
  <div className="flex justify-center pt-4 pb-0 px-4 bg-[#EFF6F5]">
    <img 
      src="https://i.ibb.co/hFJSqpMK/Chat-GPT-Image-17-de-fev-de-2026-21-17-25-1.png" 
      alt="Recomendado por +2.400 alunos" 
      className="h-10 w-auto object-contain"
    />
  </div>
);

const VSLPlayer = ({ 
  videoSrc = "https://file.garden/abrFdPrpWxJegn2H/744fef8a0c7778b7c19befbf01802290_1.mp4",
  className = "relative w-full max-w-3xl mx-auto rounded-[16px] overflow-hidden shadow-[0_20px_50px_rgba(13,59,94,0.15)] bg-black my-8 md:my-12 cursor-pointer select-none group border-4 border-white/50",
  videoClassName = ""
}: { videoSrc?: string, className?: string, videoClassName?: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setShowOverlay(false);
      videoRef.current.play().catch(() => {});
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => e.preventDefault();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    let currentVisualProgress = 0;
    
    let inPlateau = false;
    let plateauEndTime = 0;
    
    const updateProgress = () => {
      if (!video) return;
      const t_real = video.currentTime;
      const d = video.duration;

      if (!d || isNaN(d)) {
         animationFrameId = requestAnimationFrame(updateProgress);
         return;
      }

      if (t_real >= d * 0.9) {
        const remainingTime = d - t_real;
        const totalRemainingDuration = d * 0.1;
        const catchupProgress = 1 - (remainingTime / totalRemainingDuration) * (1 - 0.95);
        currentVisualProgress = Math.max(currentVisualProgress, catchupProgress);
        currentVisualProgress = Math.min(currentVisualProgress, 0.999);
      } else {
        const now = Date.now();
        if (!inPlateau && Math.random() < 0.0003) { 
           inPlateau = true;
           plateauEndTime = now + 200 + Math.random() * 800; 
        }
        
        if (inPlateau && now >= plateauEndTime) {
           inPlateau = false;
        }

        if (!inPlateau) {
           const leadFactor = 1.15;
           const targetProgress = Math.min((t_real * leadFactor) / d, 0.95);
           currentVisualProgress += (targetProgress - currentVisualProgress) * 0.05;
        }
      }

      setProgress(currentVisualProgress);
      animationFrameId = requestAnimationFrame(updateProgress);
    };
    
    animationFrameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
     const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
           if (!videoRef.current) return;
           if (entry.isIntersecting) {
             videoRef.current.play().catch(() => {});
           } else {
             videoRef.current.pause();
           }
        });
     }, {
        threshold: 0.1 
     });

     if (videoRef.current) observer.observe(videoRef.current);
     return () => observer.disconnect();
  }, []);

  return (
     <div 
       className={className}
       onClick={handleUnmute}
     >
        <video 
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          className={`w-full h-auto block pointer-events-none ${videoClassName}`}
          onContextMenu={handleContextMenu}
        />

        {showOverlay && (
          <div 
            className="absolute top-4 right-4 bg-brand text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full flex items-center gap-2 animate-pulse whitespace-nowrap shadow-lg transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: 'var(--brand-color, #1A9E8F)' }}
          >
             <VolumeX size={16} className="md:w-[18px] md:h-[18px]" />
             <span className="font-bold text-xs md:text-sm">Clique para ouvir</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-[6px] md:h-[8px] bg-black/40">
           <div 
             className="h-full relative"
             style={{ 
               width: `${progress * 100}%`,
               transition: 'width 100ms cubic-bezier(.2,.9,.2,1)',
               backgroundColor: 'var(--brand-color, #1A9E8F)'
             }}
           >
             <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30" />
           </div>
        </div>
     </div>
  );
};

const Hero = () => (
  <section className="bg-[#EFF6F5] pt-6 pb-10 px-5 text-center">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-[26px] sm:text-3xl md:text-5xl font-bold leading-[1.15] mb-3 tracking-tighter text-[#0D3B5E]">
        A forma mais simples e prática de <br className="hidden md:block" />
        <span className="text-[#1A9E8F]">reduzir a gordura no fígado</span> <br className="hidden md:block" />
        sem <span className="text-[#1A9E8F]">dieta radical</span> e sem complicação
      </h1>

      <VSLPlayer />

      <p className="text-[#0D3B5E] text-xs md:text-sm leading-relaxed font-medium mb-5 max-w-lg mx-auto relative z-10 mt-6">
        Fortifique e cuide do seu <strong className="font-bold">fígado de verdade</strong> aprendendo tudo com o nosso <strong className="text-[#1A9E8F] font-bold">Guia Completo do Fígado Leve</strong>. <strong className="font-bold">Mesmo que você nunca tenha feito nada pelo seu fígado ou não saiba por onde começar.</strong>
      </p>

      <button 
        id="cta-hero"
        onClick={() => {
          trackEvent('InitiateCheckout', { content_name: 'Hero CTA' });
          document.getElementById('bonus-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="w-full max-w-md mx-auto bg-[#1A9E8F] hover:bg-[#1A9E8F] text-white font-bold py-4 px-4 sm:px-6 rounded-xl shadow-[0_8px_0_#137A6E] transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 sm:gap-3 uppercase text-[13px] sm:text-sm md:text-base mb-3 mt-8 animate-cta-pulse"
      >
        QUERO CUIDAR DO MEU FÍGADO AGORA!
        <ArrowRight size={20} strokeWidth={3} className="shrink-0" />
      </button>

      <div className="mb-8 mt-6 flex flex-col items-center">
        <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold mb-1">
          <span className="text-black">DE</span>
          <span className="text-red-600 relative">
            R$ 67
            <span className="absolute left-[-5%] top-1/2 w-[110%] h-[4px] bg-red-600 -translate-y-1/2"></span>
          </span>
        </div>
        <p className="text-2xl md:text-3xl text-black font-light mb-4 uppercase tracking-wide">
          POR APENAS
        </p>
        
        <div className="w-full max-w-[320px] h-[4px] bg-[#1A9E8F] shadow-[0_0_20px_rgba(26,158,143,0.6)] mb-2"></div>
        
        <div className="flex items-start justify-center text-[#1A9E8F] leading-none">
          <span className="text-3xl md:text-5xl font-bold mt-4 md:mt-6 mr-1">R$</span>
          <span className="text-[100px] md:text-[150px] font-black tracking-tighter leading-none">10</span>
        </div>
      </div>
      
    </div>
  </section>
);

const Identification = () => {
  const items = [
    "A balança não move, mesmo você se esforçando — e você já não sabe mais o que fazer",
    "Acorda cansado(a) todo dia, com o corpo inchado e sem energia para nada",
    "Tem medo de comer errado e piorar o fígado sem nem perceber",
    "Já seguiu dieta, protocolo, conselho — e nada funcionou de verdade",
    "Se perde no excesso de informação e não sabe em quem confiar"
  ];

  return (
    <section className="py-12 md:py-20 px-6 bg-[#F5F7F6] text-center font-poppins">
      <div className="max-w-[680px] mx-auto">
        <h2 className="text-[#0D3B5E] text-[22px] md:text-3xl font-bold mb-4 tracking-tight leading-tight">
          Você se reconhece em alguma dessas situações?
        </h2>
        <p className="text-[#4B5563] text-[15px] md:text-lg mb-10 leading-relaxed">
          Se alguma dessas situações descreve você, o Protocolo Fígado Leve pode ser a solução.
        </p>

        <div className="flex flex-col gap-3 mb-10 md:mb-12 text-left">
          {items.map((item, i) => (
            <div key={i} className="bg-white px-5 py-3.5 md:px-8 md:py-4 rounded-full border border-[#E5E7EB] flex items-center gap-4 shadow-sm">
              <div className="shrink-0 flex items-center justify-center">
                <XCircle size={22} className="text-[#EF4444]" strokeWidth={2.5} />
              </div>
              <p className="text-[#0D3B5E] text-[13px] md:text-[15px] font-medium leading-snug">
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-[#4B5563] text-base md:text-[19px] mb-1 inline-block">
            <span className="font-medium mr-1.5">A boa notícia?</span>
            <span className="text-[#1A9E8F] font-bold">O Protocolo Fígado Leve foi criado exatamente para você.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

const ExpertBioSection = () => {
  return (
    <section className="relative pt-10 md:pt-0 bg-[#28608F] overflow-hidden font-poppins selection:bg-[#5DC2F0]/30 z-10">
      
      {/* Radial glow behind the expert */}
      <div className="absolute bottom-0 right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-[#4385B5]/60 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Decorative gradient overlay to darken the left side behind text slightly on desktop */}
      <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#26537C] to-transparent md:hidden z-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#21496D] via-[#28608F]/80 to-transparent z-10 hidden md:block w-[70%] pointer-events-none"></div>
      
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative w-full h-full z-20 flex flex-col md:flex-row items-center md:items-stretch min-h-[600px] lg:min-h-[700px]">
        
        {/* Left Side: Text */}
        <div className="w-full md:w-[60%] lg:w-[50%] text-center md:text-left pt-6 pb-2 md:py-20 lg:py-28 flex flex-col justify-center items-center md:items-start z-20">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-[#56C0FA] text-[24px] sm:text-[28px] md:text-[32px] font-medium tracking-tight mb-2">
              Dra. Marina Albuquerque
            </h3>
            <h2 className="text-white text-[23px] sm:text-[28px] md:text-[34px] font-medium leading-[1.3] tracking-tight mb-8 md:mb-10 max-w-[340px] sm:max-w-md lg:max-w-[480px]">
              É a criadora do <strong className="font-bold">Método Fígado Leve</strong>
            </h2>
          </div>

          <div className="space-y-6 md:space-y-6 text-white text-[16px] sm:text-[17px] md:text-[18px] leading-[1.4] font-normal max-w-[350px] sm:max-w-md lg:max-w-[520px]">
            <p>
              Sou especialista em saúde hepática, nutricionista clínica e atendo pacientes há mais de 12 anos.
            </p>
            
            <p>
              As minhas abordagens revolucionaram a forma de tratar a gordura no fígado no Brasil, devolvendo a saúde e a disposição para centenas de pessoas.
            </p>

            <p>
              Agora, chegou a sua vez de copiar e colar esse passo a passo para reduzir a gordura no fígado sem dietas radicais.
            </p>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-[50%] lg:w-[45%] md:absolute md:right-0 md:top-0 md:bottom-0 flex items-center justify-center md:items-end md:justify-end z-10 md:z-0 mt-6 md:mt-0 relative h-auto md:h-full pb-0 md:pb-0 pointer-events-none">
          <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] aspect-square mx-auto md:mr-[-10%] lg:mr-[-15%] flex items-end justify-center pointer-events-none"
               style={{
                 maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                 WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                 maskComposite: 'intersect',
                 WebkitMaskComposite: 'source-in'
               }}
          >
            <img 
              src="https://i.ibb.co/nM4RQvT1/unnamed.png" 
              alt="Dra. Marina Albuquerque" 
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-[center_20%] select-none pointer-events-none mix-blend-luminosity grayscale contrast-[1.15] brightness-[1.05]"
            />
            {/* Subtle color overlay to enforce blue duotone matching the reference */}
            <div className="absolute inset-0 bg-[#316A9B] mix-blend-color opacity-100 pointer-events-none rounded-full blur-2xl scale-110"></div>
            {/* Extra multiply overlay to darken shadows slightly like the reference */}
            <div className="absolute inset-0 bg-[#1C4162] mix-blend-multiply opacity-50 pointer-events-none"></div>
            
            {/* Edge shadows to enhance the side fade */}
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(40,96,143,1)] pointer-events-none rounded-[15%]"></div>
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
    <section ref={sectionRef} className="py-20 px-6 bg-[#EFF6F5]">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block bg-[#1A9E8F] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6">
          Depoimentos reais
        </div>
        
        <h2 className="text-[#0D3B5E] text-[26px] md:text-5xl font-bold mb-4 tracking-tight leading-tight">
          Mais de 2.000 pessoas já começaram a reorganizar sua alimentação
        </h2>

        <div className="flex items-center justify-center gap-1 mb-12">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill="#F5A623" className="text-[#F5A623]" />
          ))}
          <span className="ml-2 text-sm font-bold text-[#0D3B5E]">4,9/5 de 2.464 usuários</span>
        </div>

        <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-3 gap-6 pb-4 -mx-6 px-6 md:mx-0 md:px-0">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className={`w-[85vw] md:w-auto shrink-0 snap-center reveal-element bg-[#0D3B5E] p-6 md:p-8 rounded-2xl shadow-sm relative text-left transition-all duration-1000 flex flex-col ${isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-6 right-6 text-[#1A9E8F] opacity-80">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11H6C6 8.23858 8.23858 6 11 6V2C5.47715 2 1 6.47715 1 12V22H11V11ZM22 11H18C18 8.23858 20.2386 6 23 6V2C17.4772 2 13 6.47715 13 12V22H23V11Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-full bg-[#1A9E8F] flex items-center justify-center shrink-0 overflow-hidden border-2 border-white/10">
                  <img src={t.image} alt={t.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-black text-sm md:text-base leading-none mb-1.5 uppercase tracking-wide">{t.name}</h4>
                  <p className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2">{t.info}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#F5A623" className="text-[#F5A623]" />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-white text-sm md:text-base leading-relaxed font-bold relative z-10">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PreviewDivider = () => (
  <div className="w-full bg-black py-8 md:py-12 flex justify-center items-center">
    <h2 className="text-white text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center px-4">
      VEJA UMA PRÉVIA
    </h2>
  </div>
);

const WhatYouGetDivider = () => (
  <div className="w-full bg-black py-8 md:py-12 flex justify-center items-center">
    <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center px-4">
      O QUE VOU RECEBER?
    </h2>
  </div>
);

const HowYouGetDivider = () => (
  <div className="w-full bg-black py-8 md:py-12 flex justify-center items-center">
    <h2 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center px-4">
      👇 COMO VOU RECEBER? 👇
    </h2>
  </div>
);

const HowYouGetSteps = () => {
  const steps = [
    {
      icon: <Inbox className="w-6 h-6 md:w-7 md:h-7 text-[#0D3B5E]" strokeWidth={1.5} />,
      text: (
        <>
          Após confirmação do pagamento, um acesso individual COM SENHA será enviado ao seu e-mail para você acessar O SEU APLICATIVO. Verifique <strong className="font-bold text-red-600">CAIXA DE SPAM E LIXO ELETRÔNICO.</strong>
        </>
      )
    },
    {
      icon: <Mail className="w-6 h-6 md:w-7 md:h-7 text-[#0D3B5E]" strokeWidth={1.5} />,
      text: (
        <>
          O material é <strong className="font-bold text-red-600">DIGITAL</strong> e o acesso é feito pela plataforma. Você pode estudar nos seus dispositivos, como Computador, Tablet e Celular.
        </>
      )
    },
    {
      icon: <Smartphone className="w-6 h-6 md:w-7 md:h-7 text-[#0D3B5E]" strokeWidth={1.5} />,
      text: (
        <>
          <strong className="font-bold text-red-600">Pronto!</strong> Agora inicie sua Jornada de conhecimento rumo ao <strong className="font-bold text-red-600">Fígado Leve.</strong>
        </>
      )
    }
  ];

  return (
    <section className="py-10 md:py-24 px-4 md:px-6 bg-[#EFF6F5]">
      <div className="max-w-3xl mx-auto">
        
        {/* Instant Access Badge */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-white text-[#F5A623] px-4 py-2 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-lg shadow-sm border border-[#F5A623]/10">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
            <span>Acesso Instantâneo</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4 md:space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-row items-center gap-4 md:gap-6 text-left bg-white border border-[#CBD5E1] shadow-[0_4px_10px_rgba(0,0,0,0.03)] rounded-[20px] p-5 md:p-6">
              
              {/* Icon Container */}
              <div className="relative shrink-0">
                <div className="bg-white w-12 h-12 md:w-16 md:h-16 rounded-[14px] border border-[#CBD5E1] flex items-center justify-center">
                  {step.icon}
                </div>
                {/* Number Badge */}
                <div className="absolute -bottom-2 -right-2 bg-[#0D3B5E] text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center font-bold text-[11px] md:text-xs border-2 border-white">
                  {index + 1}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <p className="text-[#4B5563] text-[14px] md:text-[16px] leading-relaxed">
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
    <section className="pt-16 md:pt-32 pb-10 md:pb-24 px-4 md:px-6 bg-[#F5F7F6] relative">
      <div className="max-w-3xl mx-auto relative">
        {/* Floating Icon */}
        <div className="absolute -top-8 md:-top-10 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-[#1A9E8F] w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg">
            <Check className="text-white w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[24px] md:rounded-[32px] pt-12 md:pt-16 pb-8 md:pb-12 px-5 md:px-12 shadow-sm">
          <ul className="space-y-3 md:space-y-5">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3 md:gap-4">
                <div className="bg-[#1A9E8F] rounded-full p-1 md:p-1.5 mt-0.5 md:mt-1 shrink-0">
                  <Check className="text-white w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                </div>
                <span className="text-[#0D3B5E] font-medium text-sm md:text-lg leading-snug">
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
  const items = [
    "Plano alimentar específico para desinflamar o fígado — sem dietas genéricas que não funcionam",
    "Lista completa dos alimentos que curam e dos que pioram, sem achismo",
    "Cardápios prontos para o dia a dia, sem sofrimento e sem abrir mão de tudo",
    "Protocolo passo a passo com acompanhamento do início ao fim, sem se perder no caminho",
    "Guia definitivo para nunca mais ter dúvida ou medo na hora de comer"
  ];

  return (
    <section className="py-12 md:py-20 px-6 bg-[#FAFAFA] text-center font-poppins">
      <div className="max-w-[700px] mx-auto">
        <div className="inline-block bg-[#e6f6f4] text-[#1A9E8F] text-[11px] md:text-xs font-bold px-4 py-1.5 rounded-full mb-5 transition-all">
          A SOLUÇÃO DEFINITIVA
        </div>
        
        <h2 className="text-[#0D3B5E] text-[22px] md:text-[32px] md:leading-tight font-bold mb-4 tracking-tight">
          O que você vai encontrar no <span className="text-[#1A9E8F]">Protocolo Fígado Leve</span>
        </h2>
        
        <p className="text-[#4B5563] text-sm md:text-base font-medium mb-1">
          Você não precisa de dieta radical nem começar do zero.
        </p>
        <p className="text-[#4B5563] text-[15px] md:text-[17px] mb-8 leading-relaxed max-w-2xl mx-auto">
          Um método passo a passo para desinflamar o fígado, recuperar sua energia e finalmente ter clareza sobre o que colocar no prato.
        </p>

        <div className="bg-white rounded-[24px] border border-[#0D3B5E]/80 p-6 md:p-8 text-left mb-6 shadow-sm">
          <div className="flex flex-row items-center gap-3 mb-6">
            <div className="shrink-0 flex items-center justify-center">
              <FileText className="text-[#0D3B5E] w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </div>
            <h3 className="text-[#0D3B5E] font-bold text-lg md:text-xl">
              O que você vai aprender:
            </h3>
          </div>
          
          <ul className="space-y-3.5">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-[#1A9E8F] w-5 h-5 shrink-0 mt-[2px]" strokeWidth={2} />
                <span className="text-[#4B5563] text-sm md:text-[15px] leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-[24px] border border-[#1A9E8F]/40 p-6 md:p-8 flex flex-col items-center text-center mb-8 shadow-sm">
          <TrendingUp className="text-[#1A9E8F] w-7 h-7 md:w-8 md:h-8 mb-4" strokeWidth={2.5} />
          
          <div className="text-[#0D3B5E] font-bold text-base md:text-lg mb-3">
            RESULTADO REAL DE QUEM SEGUIU:
          </div>
          
          <p className="text-[#4B5563] text-sm md:text-[15px] leading-relaxed mb-5 max-w-xl">
            "Pessoas que seguiram o protocolo relatam redução do inchaço logo nas primeiras semanas, mais disposição no dia a dia e exames que finalmente começam a normalizar."
          </p>
          
          <p className="text-[#1A9E8F] font-bold text-lg md:text-[22px] leading-snug">
            = Menos dor. Mais leveza. Exames que finalmente melhoram.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 md:gap-3 text-[#1A9E8F] text-[13px] md:text-[15px] font-semibold">
          <span>Simples</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[#1A9E8F]" strokeWidth={2} />
          <span>Específico</span>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-[#1A9E8F]" strokeWidth={2} />
          <span>Resultado real</span>
        </div>
      </div>
    </section>
  );
};

const ModulesSection = () => {
  const modules = [
    {
      tag: "Módulo 1",
      title: "Por que nada funcionou até agora",
      icon: Search,
      bullets: [
        "Os erros silenciosos que continuam inflamando seu fígado",
        "Por que dietas comuns falham mesmo quando você faz tudo certo",
        "O que realmente impede seu corpo de responder"
      ]
    },
    {
      tag: "Módulo 2 · Reduzir",
      title: "Desinflamação Inicial",
      icon: Flame,
      bullets: [
        "Como reduzir a gordura no fígado sem radicalismo",
        "Ajustes simples que já geram alívio nos primeiros dias",
        "Os primeiros alimentos que você precisa ajustar agora"
      ]
    },
    {
      tag: "Módulo 3 · Reorganizar",
      title: "Estratégia Alimentar",
      icon: Utensils,
      bullets: [
        "Como montar refeições que ajudam o fígado a se recuperar",
        "Combinações inteligentes que aceleram o processo",
        "Lista prática de substituições para o dia a dia"
      ]
    },
    {
      tag: "Módulo 4 · Restaurar",
      title: "Recuperação do Fígado",
      icon: Heart,
      bullets: [
        "Como ativar o processo natural de regeneração do fígado",
        "Hábitos que aceleram a recuperação sem esforço extremo",
        "Sono, estresse e rotina: o impacto real na saúde hepática"
      ]
    }
  ];

  return (
    <section className="py-12 md:py-20 px-6 bg-[#F5F7F6] text-center font-poppins">
      <div className="max-w-[720px] mx-auto">
        <div className="inline-block bg-[#e6f6f4] text-[#0F6E56] border border-[#b2ddd8] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase mb-4 tracking-widest">
          ESPIE O QUE TEM DENTRO
        </div>
        
        <h2 className="text-[#0D3B5E] text-2xl md:text-3xl font-bold mb-4 tracking-tight">
          Veja <span className="text-[#1A9E8F]">exatamente</span> o que você vai seguir
        </h2>
        
        <p className="text-[#4B5563] text-base md:text-lg mb-10">
          Passo a passo completo, do primeiro ao último módulo — sem lacunas, sem dúvida.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-6">
          {modules.map((mod, i) => (
            <div key={i} className="bg-white p-6 rounded-[14px] border border-[#d1e8e5]">
              <div className="bg-[#e6f6f4] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <mod.icon className="text-[#1A9E8F] w-6 h-6" />
              </div>
              <div className="text-[#1A9E8F] text-xs font-bold uppercase tracking-wider mb-2">
                {mod.tag}
              </div>
              <h3 className="text-[#0D3B5E] font-bold text-lg mb-4 leading-snug">
                {mod.title}
              </h3>
              <ul className="space-y-3">
                {mod.bullets.map((bullet, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1A9E8F] shrink-0 mt-2"></div>
                    <span className="text-[#4B5563] text-sm leading-relaxed">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Wide Card */}
          <div className="bg-white p-6 md:p-8 rounded-[14px] border border-[#d1e8e5] md:col-span-2">
            <div className="bg-[#e6f6f4] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Layers className="text-[#1A9E8F] w-6 h-6" />
            </div>
            <div className="text-[#1A9E8F] text-xs font-bold uppercase tracking-wider mb-2">
              Módulo 5 · Integrar
            </div>
            <h3 className="text-[#0D3B5E] font-bold text-xl mb-6 leading-snug">
              O Método 3R na sua vida
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A9E8F] shrink-0 mt-2"></div>
                <span className="text-[#4B5563] text-sm leading-relaxed">
                  Como manter os resultados sem voltar aos hábitos antigos
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A9E8F] shrink-0 mt-2"></div>
                <span className="text-[#4B5563] text-sm leading-relaxed">
                  Rotina simples e sustentável para o dia a dia
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A9E8F] shrink-0 mt-2"></div>
                <span className="text-[#4B5563] text-sm leading-relaxed">
                  Checklist prático para nunca mais se perder
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[#4B5563] text-sm md:text-base mt-8">
          + Materiais práticos, guias e ferramentas para você aplicar tudo <span className="text-[#1A9E8F] font-bold">sem dificuldade</span>
        </p>
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
    <section className="py-12 md:py-20 px-6 bg-[#FAFAFA]">
      <div className="max-w-[760px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[#0F172A] text-2xl md:text-[28px] font-bold mb-2 tracking-tight">
            Para quem é (e para quem <span className="text-[#EF4444]">não é</span>)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Para quem é */}
          <div className="bg-white rounded-[20px] p-6 md:p-7 border-[2px] border-[#03A629] shadow-[0_8px_30px_rgba(3,166,41,0.08)]">
            <h3 className="text-[#0F172A] font-bold text-[15px] md:text-base mb-6 flex items-center gap-2">
              <div className="bg-[#03A629] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              Este guia É para você se:
            </h3>
            <ul className="space-y-3.5">
              {isFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#03A629] w-5 h-5 shrink-0 mt-[2px]" strokeWidth={2} />
                  <span className="text-[#334155] font-medium text-[13px] md:text-[14px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Para quem não é */}
          <div className="bg-white rounded-[20px] p-6 md:p-7 border border-[#334155] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <h3 className="text-[#0F172A] font-bold text-[15px] md:text-base mb-6 flex items-center gap-2">
              <div className="bg-[#E2E8F0] w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              Este guia NÃO é para você se:
            </h3>
            <ul className="space-y-3.5">
              {notFor.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-[2px] shrink-0 w-5 h-5 rounded-full border border-[#64748B] flex items-center justify-center">
                    <div className="w-[5px] h-[5px] rounded-full bg-[#64748B]"></div>
                  </div>
                  <span className="text-[#334155] font-medium text-[13px] md:text-[14px] leading-snug">{item}</span>
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
  return (
    <section className="py-12 md:py-28 px-6 bg-[#EFF6F5]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 flex flex-col items-center">
          <img 
            src="https://i.ibb.co/3m8hT13J/logo-removebg-preview.png" 
            alt="Protocolo Fígado Leve Logo" 
            loading="lazy"
            decoding="async"
            className="h-48 md:h-60 -mt-8 md:-mt-12 -mb-8 md:-mb-12 object-contain"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-[#0D3B5E] text-2xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight leading-tight">
            Veja como funciona o Protocolo Fígado Leve por dentro
          </h2>
          <p className="text-[#1A9E8F] font-bold text-xs md:text-sm uppercase tracking-widest max-w-2xl mx-auto">
            Você vai aprender de forma simples, prática e aplicável no seu dia a dia.
          </p>
        </div>

        {/* Video Player */}
        <VSLPlayer 
          videoSrc="https://file.garden/abrFdPrpWxJegn2H/0319%20(1)(1343).mp4"
          className="relative w-full max-w-[315px] mx-auto rounded-[16px] overflow-hidden shadow-[0_20px_50px_rgba(13,59,94,0.15)] bg-black mb-16 md:mb-20 cursor-pointer select-none group border-4 border-white/50"
          videoClassName="-mt-[12%]"
        />

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
    <section className="pt-12 md:pt-20 pb-4 px-6 bg-white">
      <div className="max-w-[760px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-[#0F172A] text-2xl md:text-[28px] font-bold mb-2 tracking-tight">
            O que você vai conquistar (e evitar)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Gains Block */}
          <div className="bg-white rounded-[20px] p-6 md:p-7 border border-[#bbf7d0] shadow-[0_8px_30px_rgba(3,166,41,0.05)]">
            <h3 className="text-[#03A629] font-semibold text-[15px] mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" strokeWidth={2} />
              Você vai conquistar:
            </h3>
            <ul className="space-y-4">
              {gains.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#03A629] w-4 h-4 shrink-0 mt-[3px]" strokeWidth={2.5} />
                  <span className="text-[#334155] font-medium text-[13px] md:text-[14px] leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Losses Block */}
          <div className="bg-white rounded-[20px] p-6 md:p-7 border border-[#fecaca] shadow-[0_8px_30px_rgba(239,68,68,0.05)]">
            <h3 className="text-[#EF4444] font-semibold text-[15px] mb-6 flex items-center gap-2">
              <div className="shrink-0 w-5 h-5 rounded-full border-[1.5px] border-[#EF4444] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></div>
              </div>
              Você vai evitar:
            </h3>
            <ul className="space-y-4">
              {losses.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-[3px] shrink-0 w-4 h-4 rounded-full border-[1.5px] border-[#EF4444] flex items-center justify-center">
                    <div className="w-[4px] h-[4px] rounded-full bg-[#EF4444]"></div>
                  </div>
                  <span className="text-[#334155] font-medium text-[13px] md:text-[14px] leading-snug">{item}</span>
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
      <div className="bg-black text-white py-8 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
          👀 Antes de você<br />continuar...
        </h2>
      </div>

      {/* Main Content */}
      <section className="py-12 md:py-24 px-6 bg-[#F5F7F6] flex flex-col items-center text-center font-poppins">
        
        <h2 className="text-[17px] md:text-xl text-black font-medium mb-12 md:mb-16 max-w-lg leading-tight uppercase font-poppins tracking-widest">
          Escolhendo o <strong className="font-black">COMBO<br/>COMPLETO</strong> você recebe<br/>
          de <strong className="text-red-600 font-black">BÔNUS</strong> todos esses <strong className="font-black">MATERIAIS</strong>:
          <span className="text-2xl mt-4 block">👇</span>
        </h2>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-y-[4.5rem] md:gap-y-[5.5rem] md:gap-x-10 lg:gap-x-12 justify-items-center">
          
          {/* Bonus 1 */}
          <div className="relative w-full max-w-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-max max-w-[95%]">
               <div className="bg-[#1A9E8F] text-white font-black text-[22px] md:text-[28px] px-8 md:px-10 py-2.5 rounded-[40px] flex items-center justify-center gap-3 shadow-lg">
                  <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] drop-shadow-md" />
                  <span className="tracking-tight whitespace-nowrap mt-1">BÔNUS 1</span>
                  <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] drop-shadow-md" />
               </div>
            </div>
            
            <div className="bg-white border-[2.5px] border-dashed border-[#0F172A] rounded-[32px] px-5 pb-6 pt-12 w-full text-center z-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative flex flex-col items-center">
              <h3 className="text-[22px] md:text-[25px] font-black uppercase mb-2 leading-[1.1] text-black w-full px-2">
                PLANO ALIMENTAR<br/>ANTI-INFLAMAÇÃO<br/>
                <span className="text-[#1A9E8F]">30 DIAS GUIADOS</span>
              </h3>
              
              <img src="https://i.ibb.co/xSHskD7y/1.png" alt="Plano Alimentar Anti-Inflamação" loading="lazy" decoding="async" className="w-[75%] md:w-[85%] max-w-[240px] h-auto object-contain hover:-translate-y-1 transition-transform duration-300 -mt-2 mb-1" />
              
              <div className="text-[17px] md:text-[19px] font-bold mb-2 leading-tight w-full">
                <span className="text-black">DE: </span>
                <span className="text-red-600 line-through">R$ 47</span><br/>
                <span className="text-black">HOJE: </span>
                <span className="text-[#00C853] font-black text-2xl md:text-[26px]">GRÁTIS!</span>
              </div>
              
              <div className="w-full h-[1px] border-t-2 border-dashed border-gray-200 my-4"></div>

              <p className="text-[13px] md:text-[14px] text-black leading-snug font-medium px-2 w-full">
                Um plano alimentar <strong className="font-bold">prático e direto ao ponto</strong> que te guia dia a dia para <strong className="font-bold text-[#1A9E8F]">reduzir a inflamação do fígado</strong> de forma <strong className="font-bold">simples, segura e sem radicalismo</strong>.
              </p>
            </div>
          </div>

          {/* Bonus 2 */}
          <div className="relative w-full max-w-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-max max-w-[95%]">
               <div className="bg-[#1A9E8F] text-white font-black text-[22px] md:text-[28px] px-8 md:px-10 py-2.5 rounded-[40px] flex items-center justify-center gap-3 shadow-lg">
                  <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] drop-shadow-md" />
                  <span className="tracking-tight whitespace-nowrap mt-1">BÔNUS 2</span>
                  <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] drop-shadow-md" />
               </div>
            </div>
            
            <div className="bg-white border-[2.5px] border-dashed border-[#0F172A] rounded-[32px] px-5 pb-6 pt-12 w-full text-center z-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative flex flex-col items-center">
              <h3 className="text-[22px] md:text-[25px] font-black uppercase mb-2 leading-[1.1] text-black w-full px-2">
                GUIA DE<br/>INTERPRETAÇÃO DOS<br/>
                <span className="text-[#1A9E8F]">EXAMES DO FÍGADO</span>
              </h3>
              
              <img src="https://i.ibb.co/chjsvRRx/2.png" alt="Guia de Exames do Fígado" loading="lazy" decoding="async" className="w-[75%] md:w-[85%] max-w-[240px] h-auto object-contain hover:-translate-y-1 transition-transform duration-300 -mt-2 mb-1" />
              
              <div className="text-[17px] md:text-[19px] font-bold mb-2 leading-tight w-full">
                <span className="text-black">DE: </span>
                <span className="text-red-600 line-through">R$ 47</span><br/>
                <span className="text-black">HOJE: </span>
                <span className="text-[#00C853] font-black text-2xl md:text-[26px]">GRÁTIS!</span>
              </div>
              
              <div className="w-full h-[1px] border-t-2 border-dashed border-gray-200 my-4"></div>

              <p className="text-[13px] md:text-[14px] text-black leading-snug font-medium px-2 w-full">
                Um guia detalhado e direto ao ponto com tudo que você precisa saber para <strong className="font-bold text-[#1A9E8F]">entender seus exames do fígado</strong> — <strong className="font-bold text-black">sem precisar de médico para traduzir cada resultado.</strong>
              </p>
            </div>
          </div>

          {/* Bonus 3 */}
          <div className="relative w-full max-w-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-max max-w-[95%]">
               <div className="bg-[#1A9E8F] text-white font-black text-[22px] md:text-[28px] px-8 md:px-10 py-2.5 rounded-[40px] flex items-center justify-center gap-3 shadow-lg">
                  <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] drop-shadow-md" />
                  <span className="tracking-tight whitespace-nowrap mt-1">BÔNUS 3</span>
                  <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] drop-shadow-md" />
               </div>
            </div>
            
            <div className="bg-white border-[2.5px] border-dashed border-[#0F172A] rounded-[32px] px-5 pb-6 pt-12 w-full text-center z-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative flex flex-col items-center">
              <h3 className="text-[22px] md:text-[25px] font-black uppercase mb-2 leading-[1.1] text-black w-full px-2">
                CARDÁPIO DE EMERGÊNCIA<br/>
                <span className="text-[#1A9E8F]">7 DIAS DE DESINFLAMAÇÃO</span>
              </h3>
              
              <img src="https://i.ibb.co/qLmfXN2d/3-removebg-preview.png" alt="Cardápio de Emergência" loading="lazy" decoding="async" className="w-[75%] md:w-[85%] max-w-[240px] h-auto object-contain hover:-translate-y-1 transition-transform duration-300 -mt-2 mb-1" />
              
              <div className="text-[17px] md:text-[19px] font-bold mb-2 leading-tight w-full">
                <span className="text-black">DE: </span>
                <span className="text-red-600 line-through">R$ 47</span><br/>
                <span className="text-black">HOJE: </span>
                <span className="text-[#00C853] font-black text-2xl md:text-[26px]">GRÁTIS!</span>
              </div>
              
              <div className="w-full h-[1px] border-t-2 border-dashed border-gray-200 my-4"></div>

              <p className="text-[13px] md:text-[14px] text-black leading-snug font-medium px-2 w-full">
                Um guia detalhado com <strong className="font-bold text-[#1A9E8F]">7 dias de cardápio prontos</strong> para você começar a <strong className="font-bold text-[#1A9E8F]">desinflamar o fígado imediatamente</strong> — <strong className="font-bold text-black">sem precisar pensar, só seguir.</strong>
              </p>
            </div>
          </div>

          {/* Bonus 4 */}
          <div className="relative w-full max-w-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-max max-w-[95%]">
               <div className="bg-[#1A9E8F] text-white font-black text-[22px] md:text-[28px] px-8 md:px-10 py-2.5 rounded-[40px] flex items-center justify-center gap-3 shadow-lg">
                  <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] drop-shadow-md" />
                  <span className="tracking-tight whitespace-nowrap mt-1">+ 7 BÔNUS</span>
                  <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-[30px] h-[30px] md:w-[38px] md:h-[38px] drop-shadow-md" />
               </div>
            </div>
            
            <div className="bg-white border-[2.5px] border-dashed border-[#0F172A] rounded-[32px] px-5 pb-6 pt-[3.5rem] w-full text-center z-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] relative flex flex-col items-center">
              <ul className="text-left text-[11px] font-bold text-black space-y-[7px] mb-4 px-2 w-full mx-auto">
                <li className="flex items-start gap-[6px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-[1px]" fill="#00C853" stroke="white" />
                  <span className="font-bold leading-tight">Lista Inteligente de Substituições Alimentares</span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-[1px]" fill="#00C853" stroke="white" />
                  <span className="font-bold leading-tight">Guia dos 15 Alimentos que Mais Inflamam o Fígado</span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-[1px]" fill="#00C853" stroke="white" />
                  <span className="font-bold leading-tight">Tabela Visual de Combinações Alimentares Anti-Inflamação</span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-[1px]" fill="#00C853" stroke="white" />
                  <span className="font-bold leading-tight">Checklist Diário do Método 3R</span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-[1px]" fill="#00C853" stroke="white" />
                  <span className="font-bold leading-tight">Planner Semanal do Fígado Leve</span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-[1px]" fill="#00C853" stroke="white" />
                  <span className="font-bold leading-tight">Áudios Curtos de Reprogramação Anti-Radicalismo</span>
                </li>
                <li className="flex items-start gap-[6px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-[1px]" fill="#00C853" stroke="white" />
                  <span className="font-bold leading-tight">Mini Guia: Sono, Estresse e Gordura no Fígado</span>
                </li>
              </ul>
              
              <img src="https://i.ibb.co/8L8HbdtH/7bonus-1.png" alt="+ 7 Bonus" loading="lazy" decoding="async" className="w-[75%] md:w-[85%] max-w-[240px] h-auto object-contain hover:-translate-y-1 transition-transform duration-300 -mt-2 mb-1" />
              
              <div className="text-[17px] md:text-[19px] font-bold mb-2 leading-tight w-full">
                <span className="text-black">DE: </span>
                <span className="text-red-600 line-through">R$ 147</span><br/>
                <span className="text-black">HOJE: </span>
                <span className="text-[#00C853] font-black text-2xl md:text-[26px]">GRÁTIS!</span>
              </div>
              
              <div className="w-full h-[1px] border-t-2 border-dashed border-gray-200 my-4"></div>

              <p className="text-[13px] md:text-[14px] text-black leading-snug font-medium px-2 w-full">
                Esses materiais foram cuidadosamente criados para te dar <strong className="font-bold text-black">tudo que você precisa</strong> para desinflamar o fígado de verdade — <strong className="font-bold text-[#1A9E8F]">sem achismo, sem radicalismo, sem complicação.</strong>
              </p>
            </div>
          </div>

        </div>

        {/* Combo Completo Confirmation */}
        <div className="mt-16 text-center px-4 max-w-lg mx-auto border-[2.5px] border-[#0F172A] rounded-2xl p-4 bg-white shadow-sm flex items-center justify-center gap-4">
          <img src="https://em-content.zobj.net/source/apple/354/wrapped-gift_1f381.png" alt="Presente" className="w-8 h-8 drop-shadow-sm shrink-0" />
          <p className="text-[14px] md:text-[15px] font-medium text-black leading-tight text-center">
            Escolhendo o <strong className="font-black">COMBO COMPLETO</strong> você tem <span className="text-[#00C853] font-black tracking-wide">ACESSO À TODOS</span> os materiais <strong className="font-black">ACIMA!</strong>
          </p>
        </div>

      </section>
    </div>
  );
};

const Offer = ({ onBasicClick }: { onBasicClick: (e: React.MouseEvent) => void }) => {
  return (
    <section className="py-14 md:py-32 px-6 bg-[#8c8c8c] relative overflow-hidden font-poppins" id="offer">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="mb-12">
          <p className="text-white text-xl md:text-2xl mb-4">
            Não perca tempo! <span className="font-bold uppercase">GARANTA AGORA O</span>
          </p>
          <img 
            src="https://i.ibb.co/Qvn6L8DP/logo-figado-leve-texto-branco.png" 
            alt="Protocolo Fígado Leve Logo" 
            loading="lazy"
            decoding="async"
            className="h-48 md:h-60 mx-auto -mt-10 -mb-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-white text-2xl sm:text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            + 10 BÔNUS ESPECIAIS!
          </h2>
          <p className="text-white/80 font-medium text-base md:text-lg">
            Acesso imediato após a confirmação do pagamento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-center">
          
          {/* Plano Básico */}
          <div id="offer-basic" className="lg:col-span-5 bg-white rounded-[2rem] shadow-sm p-8 flex flex-col text-left relative opacity-90 hover:opacity-100 transition-opacity scroll-mt-24">
            <div className="mb-6 text-center">
              <h3 className="text-[#0D3B5E] font-bold text-2xl mb-4 uppercase tracking-tight">PLANO BÁSICO</h3>
              
              <img 
                src="https://i.ibb.co/v639D7ZD/mockup-estudio-infinito-premium.png" 
                alt="Mockup Protocolo Fígado Leve" 
                loading="lazy"
                decoding="async"
                className="w-full max-w-[200px] mx-auto mb-6 drop-shadow-xl"
                referrerPolicy="no-referrer"
              />

              <div className="flex flex-col items-center mb-2">
                <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold mb-1">
                  <span className="text-black">DE</span>
                  <span className="text-red-600 relative">
                    R$ 57
                    <span className="absolute left-[-5%] top-1/2 w-[110%] h-[3px] bg-red-600 -translate-y-1/2"></span>
                  </span>
                </div>
                <p className="text-lg md:text-xl text-black font-light mb-3 uppercase tracking-wide">
                  POR APENAS
                </p>
                
                <div className="w-full max-w-[200px] h-[3px] bg-[#1A9E8F] shadow-[0_0_15px_rgba(26,158,143,0.6)] mb-2"></div>
                
                <div className="flex items-start justify-center text-[#1A9E8F] leading-none">
                  <span className="text-3xl md:text-4xl font-bold mt-2 md:mt-3 mr-1">R$</span>
                  <span className="text-[70px] md:text-[100px] font-black tracking-tighter leading-none">10</span>
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
                  <li key={i} className="flex items-start gap-2 text-[#F87171]">
                    <XCircle size={18} fill="#F87171" stroke="white" className="shrink-0 mt-0.5" />
                    <span className="text-sm line-through decoration-[#F87171]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-auto">
              <a 
                id="checkout-essencial"
                href="/#upsell"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onBasicClick}
                className="w-full block text-center bg-[#1A9E8F] text-white py-4 rounded-xl font-bold text-base uppercase shadow-lg hover:bg-[#158578] transition-colors mb-4"
              >
                COMPRAR O BÁSICO E RECEBER AGORA!
              </a>
              
              <div className="mt-6 text-center">
                <p className="text-[14px] md:text-[16px] text-[#8c8c8c] font-black italic uppercase leading-tight tracking-tight">
                  ACESSO PARA BAIXAR O APP GARANTIDO<br/>
                  E IMEDIATO NO E-MAIL CADASTRADO OU<br/>
                  SEU DINHEIRO DE VOLTA
                </p>
                
                <hr className="my-5 border-t-2 border-gray-300" />
                
                <p className="text-[16px] md:text-[18px] text-[#8c8c8c] font-bold leading-tight mb-4">
                  Temos uma <span className="text-[#E53935]">SUPER OFERTA</span> que se encaixa<br/>
                  ainda mais com o seu perfil
                </p>
                
                <div className="flex justify-center">
                  <div className="bg-[#E53935] rounded-full p-2">
                    <ArrowDown size={24} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plano Completo */}
          <div id="offer-complete" className="lg:col-span-7 bg-black rounded-[2.5rem] border-[4px] border-white p-8 md:p-10 flex flex-col text-left relative shadow-[0_20px_50px_rgba(245,166,35,0.2)] z-10 transform lg:scale-105 scroll-mt-24">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#EF4444] text-white font-bold text-xs md:text-sm px-6 py-2 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap flex items-center gap-2">
              🔥 MAIS VENDIDO
            </div>

            <div className="text-center mb-6 mt-2">
              <h3 className="text-white font-black text-3xl md:text-4xl tracking-tight mb-1 uppercase">
                PLANO COMPLETO
              </h3>
              <p className="text-white font-bold text-sm md:text-base mb-4">
                Protocolo Fígado Leve + 10 Bônus Especiais!
              </p>
              
              <p className="text-white font-bold text-base md:text-lg mb-6">
                95% DAS PESSOAS OPTAM POR ESTA OFERTA!
              </p>

              <img 
                src="https://i.ibb.co/7tgGXrVb/bundle-hero.png" 
                alt="Bundle Protocolo Fígado Leve" 
                loading="lazy"
                decoding="async"
                className="w-full max-w-[550px] mx-auto mb-6 drop-shadow-2xl scale-105"
                referrerPolicy="no-referrer"
              />

              <div className="flex flex-col items-center justify-center bg-transparent py-2">
                <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold mb-1">
                  <span className="text-[#8c8c8c]">DE</span>
                  <span className="text-[#8c8c8c] relative">
                    R$ 297
                    <span className="absolute left-[-5%] top-1/2 w-[110%] h-[3px] bg-[#8c8c8c] -translate-y-1/2"></span>
                  </span>
                </div>
                <p className="text-lg md:text-xl text-[#e5e5e5] font-light mb-3 uppercase tracking-wide">
                  POR APENAS
                </p>
                
                <div className="w-full max-w-[300px] h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-2"></div>
                
                <div className="flex items-start justify-center text-white leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  <span className="text-3xl md:text-4xl font-bold mt-2 md:mt-3 mr-1">R$</span>
                  <span className="text-[70px] md:text-[120px] font-black tracking-tighter leading-none">37</span>
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
                href="https://pay.wiapy.com/2YN9oWQpwa?payment_method=pix"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('Purchase', { value: 37.00, currency: 'BRL', content_name: 'Plano Completo' })}
                className="w-full block text-center bg-[#1A9E8F] text-white py-5 rounded-2xl font-black text-lg md:text-xl uppercase shadow-[0_10px_30px_rgba(26,158,143,0.3)] hover:bg-[#158578] transition-all animate-cta-pulse mb-6"
              >
                COMPRAR O COMPLETO E RECEBER AGORA!
              </a>
              
              <div className="mt-6 text-center">
                <p className="text-[14px] md:text-[16px] text-[#E2FF00] font-black italic uppercase leading-tight tracking-tight">
                  ACESSO PARA BAIXAR O APP GARANTIDO<br/>
                  E IMEDIATO NO E-MAIL CADASTRADO OU<br/>
                  SEU DINHEIRO DE VOLTA!
                </p>
                
                <hr className="my-5 border-t-2 border-white" />
                
                <p className="text-[16px] md:text-[18px] text-white leading-tight mb-4 animate-pulse">
                  <span className="font-black">APROVEITE AGORA:</span> ÚLTIMO DIA! Você não verá<br/>
                  essa oportunidade em outro momento!
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
    <section className="py-12 md:py-28 px-6 bg-[#F5F7F6] relative overflow-hidden">
      <div className="max-w-[700px] mx-auto text-center relative z-10 flex flex-col items-center">
        <div className="mb-6">
          <div className="bg-[#E5EBE8] w-20 h-20 rounded-full flex items-center justify-center">
            <Shield size={36} strokeWidth={2} className="text-[#0A3622]" />
          </div>
        </div>

        <h2 className="text-[#0A3622] text-2xl md:text-[32px] font-bold mb-6 tracking-tight">
          Garantia Incondicional de 7 Dias
        </h2>

        <p className="text-[#5A6B68] text-[17px] leading-relaxed mb-8 font-medium">
          Se por qualquer motivo você não ficar satisfeito com o material, basta enviar um e-mail em até 7 dias após a compra e devolvemos <span className="font-bold text-[#0A3622]">100% do seu dinheiro</span>. Sem perguntas, sem burocracia.
        </p>

        <div className="flex items-center justify-center gap-4 text-[#3A6B68] font-medium text-sm">
          <div className="flex items-center gap-2">
            <RefreshCw size={16} />
            <span>Reembolso rápido</span>
          </div>
          <span className="text-[#3A6B68] opacity-50 text-xs">•</span>
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <span>Sem risco</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqData = [
    { 
      question: "O programa é indicado para qualquer grau de gordura no fígado?", 
      answer: "O Fígado Leve foi desenvolvido para pessoas que receberam diagnóstico de gordura no fígado, independente do grau, e querem organizar a alimentação de forma prática e sustentável. Em casos mais avançados, recomendamos manter o acompanhamento médico paralelo." 
    },
    { 
      question: "Preciso de acompanhamento médico para seguir o plano?", 
      answer: "O Fígado Leve é um programa de organização alimentar educacional e não substitui o acompanhamento médico. Ele complementa as orientações do seu médico com um plano prático para o dia a dia — dando a direção concreta que muitas vezes falta após a consulta." 
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
      question: "A garantia de 7 dias vale mesmo?", 
      answer: "Vale 100%. Se por qualquer motivo você não ficar satisfeito, é só entrar em contato dentro de 7 dias e devolvemos o valor integral. Sem questionamentos, sem burocracia." 
    }
  ];

  return (
    <section className="py-12 md:py-28 px-6 bg-[#EFF6F5] relative overflow-hidden font-poppins">
      <div className="max-w-[780px] mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-[#1A9E8F] text-white text-sm font-bold px-4 py-1.5 rounded uppercase tracking-wider mb-6">
            TIRE SUAS DÚVIDAS
          </div>
          <h2 className="text-[#0D3B5E] text-2xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-gray-500 font-normal text-base md:text-lg">Respondemos as dúvidas mais comuns de quem está considerando começar.</p>
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
    <div className={`bg-white rounded-[12px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] border-l-[3px] transition-all duration-300 ${isOpen ? 'border-[#1A9E8F]' : 'border-transparent'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-6 flex justify-between items-center text-left focus:outline-none"
      >
        <span className="font-semibold text-[#0D3B5E] text-base md:text-lg pr-4">{question}</span>
        <span className={`text-[#1A9E8F] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
           <Plus size={24} />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="px-6 pb-6 pt-2 text-gray-600 font-normal text-base leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const CTASection = ({ 
  onBasicClick,
  basicText = "Plano Básico — R$10",
  basicLink = "#offer-basic",
  basicTarget = "_self",
  completeText = "Plano Completo — R$37",
  completeLink = "#offer-complete",
  onCompleteClick
}: { 
  onBasicClick?: (e: React.MouseEvent) => void;
  basicText?: string;
  basicLink?: string;
  basicTarget?: string;
  completeText?: string;
  completeLink?: string;
  onCompleteClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-[#E8EEF2] relative overflow-hidden font-poppins text-center">
      <div className="max-w-[850px] mx-auto flex flex-col items-center">
        
        <h2 className="text-[#2B3643] text-[26px] md:text-[34px] font-bold mb-10 tracking-[-0.03em] leading-tight max-w-[500px]">
          Agora, você tem duas opções
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-12">
          {/* Option 1 */}
          <div className="bg-[#FFF1EF] rounded-[16px] border border-[#f5b8b5] border-b-[4px] border-b-[#E53935] p-6 lg:p-8 text-left flex flex-col items-start shadow-sm transition-all hover:translate-y-[-2px]">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="bg-white rounded-full flex items-center justify-center p-1 md:p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E64B44] rounded-full flex items-center justify-center">
                  <X size={26} strokeWidth={4} className="text-white" />
                </div>
              </div>
              <h3 className="text-[#C81E18] text-[22px] md:text-[26px] font-bold tracking-tight">Opção 1</h3>
            </div>
            <p className="text-[#2B3643] text-[15px] md:text-[16px] leading-[1.5] font-medium">
              Continuar sem saber o que comer, acordando cansada, com o fígado inflamado, tentando dietas genéricas que não funcionam para o fígado e vendo o quadro piorar com o tempo.
            </p>
          </div>

          {/* Option 2 */}
          <div className="bg-[#EEF9F0] rounded-[16px] border border-[#aaeac3] border-b-[4px] border-b-[#03A629] p-6 lg:p-8 text-left flex flex-col items-start shadow-sm transition-all hover:translate-y-[-2px]">
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="bg-white rounded-full flex items-center justify-center p-1 md:p-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] shrink-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#02B35B] rounded-full flex items-center justify-center">
                  <Check size={26} strokeWidth={4} className="text-white" />
                </div>
              </div>
              <h3 className="text-[#0E8A42] text-[22px] md:text-[26px] font-bold tracking-tight">Opção 2</h3>
            </div>
            <p className="text-[#2B3643] text-[15px] md:text-[16px] leading-[1.5] font-medium">
              Acessar o Protocolo Fígado Leve hoje, seguir um método passo a passo feito especialmente para desinflamar o fígado, sem radicalismo, e finalmente ver resultado nos seus exames.
            </p>
          </div>
        </div>

        <div className="mb-10 px-4">
          <p className="text-[#2B3643] text-[20px] md:text-[26px] font-bold leading-[1.3] mb-6 tracking-tight">
            Eu sei, e você também sabe... A opção 2 é a mais inteligente e é a que você mais precisa.
          </p>
          <p className="text-[#176FA7] text-[17px] md:text-[22px] font-bold leading-[1.4] tracking-tight">
            A opção 2 é a mais inteligente e é a que você mais precisa, então clica no botão abaixo e garanta seu acesso agora!
          </p>
        </div>

        <div className="flex items-center justify-center w-full max-w-[600px] mb-6">
          <a 
            href="#offer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-[#03A629] text-white py-5 rounded-xl font-bold text-lg md:text-xl uppercase hover:bg-[#028f23] transition-all flex items-center justify-center shadow-[0_8px_20px_rgba(3,166,41,0.25)] animate-cta-pulse"
          >
            QUERO CUIDAR DO MEU FÍGADO AGORA
          </a>
        </div>

        <div className="text-[#6B7280] text-[13px] font-medium flex items-center justify-center gap-1.5 opacity-80">
          <ShieldCheck size={16} /> Acesso imediato • Garantia de 7 dias • 100% Seguro
        </div>
      </div>
    </section>
  );
};

const SupportSection = () => {
  return (
    <section className="py-12 md:py-28 px-6 bg-[#EFF6F5] relative overflow-hidden font-poppins text-center border-t border-[#E5EBE8]">
      <div className="max-w-[600px] mx-auto flex flex-col items-center">
        <div className="mb-6">
          <div className="bg-[#E5EBE8] w-16 h-16 rounded-full flex items-center justify-center">
            <HelpCircle size={32} strokeWidth={2} className="text-[#0A3622]" />
          </div>
        </div>

        <h2 className="text-[#0A3622] text-2xl md:text-3xl font-bold mb-4 tracking-tight">
          Ainda tem dúvidas?
        </h2>

        <p className="text-[#5A6B68] text-base leading-relaxed mb-8">
          Fique à vontade para nos chamar antes de comprar. Nossa equipe está pronta<br className="hidden md:block" />
          para te ajudar com qualquer dúvida.
        </p>

        <a 
          href="https://wa.me/5519998425443?text=Ol%C3%A1%2C%20Dra.%20Marina%20Albuquerque!%20Estou%20entrando%20em%20contato%20para%20solicitar%20suporte.%0A%0ADescri%C3%A7%C3%A3o%20do%20problema%3A"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-8 rounded-xl font-bold text-base hover:bg-[#20BD5A] transition-colors"
        >
          <MessageCircle size={20} />
          Falar com Suporte no WhatsApp
        </a>
      </div>
    </section>
  );
};

const DisclaimerAndFooter = () => {
  return (
    <footer className="bg-[#F5F7F6] py-12 px-6 font-poppins border-t border-[#E5EBE8]">
      <div className="max-w-[800px] mx-auto flex flex-col items-center">
        
        <div className="bg-[#F0F4F2] rounded-xl p-5 md:p-8 w-full mb-8 flex flex-col sm:flex-row gap-4">
          <div className="shrink-0 mt-1">
            <AlertTriangle size={24} className="text-[#5A6B68]" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-[#0A3622] text-sm mb-3">Aviso Importante</h4>
            <ul className="space-y-2 text-[#5A6B68] text-xs leading-relaxed">
              <li>• Este conteúdo é exclusivamente educativo e informativo.</li>
              <li>• O uso das informações é de total responsabilidade do comprador.</li>
              <li>• Este material não substitui orientação médica ou profissional.</li>
              <li>• O produto não possui vínculo com nenhuma instituição governamental.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-[#5A6B68] text-sm font-medium mb-8">
          <a href="https://wa.me/5519998425443?text=Ol%C3%A1%2C%20Dra.%20Marina%20Albuquerque!%20Estou%20entrando%20em%20contato%20para%20solicitar%20suporte.%0A%0ADescri%C3%A7%C3%A3o%20do%20problema%3A" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#0A3622] transition-colors">
            <MessageCircle size={18} />
            Falar com suporte no WhatsApp
          </a>
          <span className="text-[#E5EBE8]">•</span>
          <a href="https://www.instagram.com/figado.leve" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#0A3622] transition-colors">
            <Instagram size={18} />
            Seguir no Instagram
          </a>
        </div>

        <div className="text-[#8A9B98] text-xs text-center">
          © 2026 Protocolo Figado Leve. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

const SimpleFooter = () => {
  return (
    <footer className="bg-[#316A9B] py-12 px-6 font-poppins text-center text-white">
      <div className="max-w-[800px] mx-auto flex flex-col items-center">
        
        <div className="mb-6 flex flex-col items-center justify-center">
          <p className="text-[13px] md:text-[15px] font-medium tracking-[0.2em] uppercase opacity-90 mb-1">
            PROTOCOLO
          </p>
          <div className="flex items-center gap-2">
            <h2 className="text-[28px] md:text-[38px] font-black tracking-[-0.02em] leading-none uppercase">
              FÍGADO LEVE
            </h2>
          </div>
        </div>

        <p className="text-[16px] md:text-[20px] font-medium mb-1 mt-2">
          Tem dúvidas? Entre em contato:
        </p>
        <a 
          href="mailto:deskxsolutions@gmail.com" 
          className="text-[16px] md:text-[20px] font-normal underline hover:text-[#56C0FA] transition-colors mb-12 block"
        >
          deskxsolutions@gmail.com
        </a>

        <p className="text-[11px] md:text-[13px] leading-[1.6] opacity-90 mb-8 max-w-[750px] font-normal">
          Este site não é afiliado ao Facebook ou a qualquer entidade do Facebook. Depois que você sair do Facebook, a responsabilidade não é deles e sim do nosso site. A compra desse material não garante nenhum tipo de resultado. Fazemos todos os esforços para indicar claramente e mostrar todas as provas do produto e usamos resultados reais de alunos.
        </p>

        <p className="text-[12px] md:text-[15px] font-medium">
          Copyright © 2026 Todos os Direitos Reservados.
        </p>
      </div>
    </footer>
  );
};

const UpsellPage = () => {
  const [step, setStep] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleDecline = () => {
    if (step === 1) {
      setStep(2);
    } else {
      window.location.href = 'https://pay.wiapy.com/HrqBTS9Tk?payment_method=pix';
      trackEvent('Purchase', { value: 10.00, currency: 'BRL', content_name: 'Plano Básico' });
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6F5] selection:bg-[#1A9E8F]/10 antialiased overflow-x-hidden no-scrollbar font-poppins">
      <div 
        ref={scrollRef}
        className="w-full flex items-start justify-center p-4 bg-black/95 pt-8 md:pt-12 pb-16"
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-2xl relative my-4 md:my-8 flex flex-col items-center scroll-mt-24"
            id="offer-complete-upsell"
          >
            {/* Header Section */}
            <div className="w-full text-center mb-10 flex flex-col items-center px-4">
              <h2 className="text-[#E2FF00] text-xl sm:text-2xl md:text-4xl font-black mb-8 uppercase tracking-wide">
                {step === 1 ? 'ESPERA!' : 'ÚLTIMA CHANCE!'}
              </h2>
              <p className="text-white text-xl sm:text-2xl md:text-4xl font-bold mb-10 leading-snug max-w-3xl">
                Não tome essa decisão antes de conferir essa <span className="text-[#E2FF00]">SUPER CONDIÇÃO ESPECIAL</span> que preparamos para você.
              </p>
              <p className="text-[#E2FF00] font-black text-xl sm:text-2xl md:text-4xl uppercase tracking-widest">
                (APENAS HOJE)
              </p>
            </div>

            {/* Exact copy of Plano Completo card */}
            <div className="bg-black rounded-[2.5rem] border-[4px] border-white p-6 md:p-10 flex flex-col text-left relative shadow-[0_20px_50px_rgba(245,166,35,0.2)] z-10 w-full">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#EF4444] text-white font-bold text-xs md:text-sm px-6 py-2 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap flex items-center gap-2">
                🔥 MAIS VENDIDO
              </div>

              <div className="text-center mb-6 mt-2">
                <h3 className="text-white font-black text-3xl md:text-4xl tracking-tight mb-1 uppercase">
                  PLANO COMPLETO
                </h3>
                <p className="text-white font-bold text-sm md:text-base mb-4">
                  Protocolo Fígado Leve + 10 Bônus Especiais!
                </p>
                
                <p className="text-white font-bold text-base md:text-lg mb-6">
                  95% DAS PESSOAS OPTAM POR ESTA OFERTA!
                </p>

                <img 
                  src="https://i.ibb.co/7tgGXrVb/bundle-hero.png" 
                  alt="Bundle Protocolo Fígado Leve" 
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-[550px] mx-auto mb-6 drop-shadow-2xl scale-105"
                  referrerPolicy="no-referrer"
                />

                <div className="flex flex-col items-center justify-center bg-transparent py-2">
                  <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold mb-1">
                    <span className="text-[#8c8c8c]">DE</span>
                    <span className="text-[#8c8c8c] relative">
                      R$ 297
                      <span className="absolute left-[-5%] top-1/2 w-[110%] h-[3px] bg-[#8c8c8c] -translate-y-1/2"></span>
                    </span>
                  </div>
                  <p className="text-lg md:text-xl text-[#e5e5e5] font-light mb-3 uppercase tracking-wide">
                    POR APENAS
                  </p>
                  
                  <div className="w-full max-w-[300px] h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-2"></div>
                  
                  <div className="flex items-start justify-center text-white leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    <span className="text-3xl md:text-4xl font-bold mt-2 md:mt-3 mr-1">R$</span>
                    {step === 1 ? (
                      <span className="text-[70px] md:text-[120px] font-black tracking-tighter leading-none">27</span>
                    ) : (
                      <span className="text-[60px] md:text-[120px] font-black tracking-tighter leading-none">19<span className="text-4xl md:text-7xl">,90</span></span>
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
                  href={step === 1 ? "https://pay.wiapy.com/iBpg-3qq7?payment_method=pix" : "https://pay.wiapy.com/75EIStgfs?payment_method=pix"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('Purchase_Upsell', { value: step === 1 ? 27.00 : 19.90, currency: 'BRL', content_name: `Plano Completo Upsell Step ${step}` })}
                  className="w-full block text-center bg-[#1A9E8F] text-white py-5 rounded-2xl font-black text-lg md:text-xl uppercase shadow-[0_10px_30px_rgba(26,158,143,0.3)] hover:bg-[#158578] transition-all animate-cta-pulse mb-6"
                >
                  COMPRAR O COMPLETO E RECEBER AGORA!
                </a>
                
                <div className="mt-6 text-center mb-6">
                  <p className="text-[14px] md:text-[16px] text-[#E2FF00] font-black italic uppercase leading-tight tracking-tight">
                    ACESSO PARA BAIXAR O APP GARANTIDO<br/>
                    E IMEDIATO NO E-MAIL CADASTRADO OU<br/>
                    SEU DINHEIRO DE VOLTA!
                  </p>
                  
                  <hr className="my-5 border-t-2 border-white" />
                  
                  <p className="text-[16px] md:text-[18px] text-white leading-tight mb-4 animate-pulse">
                    <span className="font-black">APROVEITE AGORA:</span> ÚLTIMO DIA! Você não verá<br/>
                    essa oportunidade em outro momento!
                  </p>
                </div>

                <div className="text-center border-t border-white/20 pt-6">
                  <button 
                    onClick={handleDecline}
                    className="text-gray-400 text-sm md:text-base font-bold underline hover:text-white transition-colors py-3 px-4"
                  >
                    Não, quero continuar com o básico.
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <HowYouGetDivider />
      <HowYouGetSteps />
      <BenefitsAndAvoidanceSection />
      <PreviewSection />
      <Guarantee />
      <FAQ />
      <CTASection 
        onBasicClick={(e) => { e.preventDefault(); handleDecline(); }}
        basicText="Continuar com o Básico"
        completeText={`Plano Completo — R$${step === 1 ? '27' : '19,90'}`}
        completeLink="#offer-complete-upsell"
        onCompleteClick={() => {}}
      />
      <SupportSection />
      <DisclaimerAndFooter />
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isUpsellRoute, setIsUpsellRoute] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/upsell' || window.location.hash === '#upsell') {
      setIsUpsellRoute(true);
    }
  }, []);

  const handleBasicClick = (e: React.MouseEvent) => {
    trackEvent('Click_Basic_Checkout');
  };

  useEffect(() => {
    try {
      if (!localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', 'user_' + Math.random().toString(36).substring(2, 15));
      }
    } catch (e) {
      console.warn('localStorage is not available');
    }
  }, []);

  if (isUpsellRoute) {
    return <UpsellPage />;
  }

  return (
    <div className="min-h-screen bg-[#EFF6F5] selection:bg-[#1A9E8F]/10 antialiased overflow-x-hidden no-scrollbar font-poppins">
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
        <PreviewDivider />
        <PreviewSection />
        <SolutionSection />
        <BenefitsAndAvoidanceSection />
        <TargetAudienceSection />
        <BonusSection />
        <ExpertBioSection />
        <Offer onBasicClick={handleBasicClick} />
        <PreviewDivider />
        <PreviewSection />
        <Guarantee />
        <FAQ />
        <CTASection 
          onBasicClick={handleBasicClick} 
          basicLink="/#upsell"
          basicTarget="_blank"
        />
        <SimpleFooter />
      </main>
    </div>
  );
}
