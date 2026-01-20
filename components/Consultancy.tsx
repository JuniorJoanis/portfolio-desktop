import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Linkedin, Github, Monitor, BookOpen,
  ArrowRight, ArrowLeft, Brain, Layers, Users,
  ExternalLink, MapPin, Calendar
} from 'lucide-react';
import { getObfuscatedEmail } from '@/utils/email';
import { SOCIALS, BIO } from '@/constants';

// Helper to get social URL by platform
const getSocialUrl = (platform: string): string => {
  const social = SOCIALS.find(s => s.platform.toLowerCase().includes(platform.toLowerCase()));
  return social?.url || '';
};

// Blueprint line that draws itself
const BlueprintLine = ({ 
  d, 
  delay = 0, 
  duration = 1.5,
  isActive 
}: { 
  d: string; 
  delay?: number; 
  duration?: number;
  isActive: boolean;
  key?: number;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  
  useEffect(() => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = `${length}`;
    pathRef.current.style.strokeDashoffset = isActive ? '0' : `${length}`;
  }, [isActive]);

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke="#2563eb"
      strokeWidth="1"
      strokeLinecap="round"
      style={{
        transition: `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
      }}
    />
  );
};

// Client logos - using Wikimedia Commons Special:FilePath for reliable redirects
const clientLogos = [
  { 
    name: 'AXA', 
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/AXA_Logo.svg?width=200'
  },
  { 
    name: 'BNP Paribas', 
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/BNP_Paribas_logo.svg?width=200'
  },
  { 
    name: 'Deutsche Bank', 
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Deutsche_Bank_logo_without_wordmark.svg?width=200'
  },
  { 
    name: 'ENGIE', 
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Engie_logo.png?width=200'
  },
  { 
    name: 'Deloitte', 
    logo: 'https://commons.wikimedia.org/wiki/Special:FilePath/Deloitte.svg?width=200'
  },
];

// Company logos for employers - using local files from public/logos
const companyLogos: Record<string, string> = {
  'Abbove': '/logos/abbove_logo.jpeg',
  'Delfyn': '/logos/delfyn.jpeg',
  'Moodwork': '/logos/moodwork.ico',
};

// Client logo component with fallback
const ClientLogo = ({ name, logo }: { name: string; logo: string; key?: string }) => {
  const [failed, setFailed] = useState(false);
  
  if (failed) {
    return (
      <div 
        className="h-8 sm:h-10 px-2 sm:px-4 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
        title={name}
      >
        <span className="text-xs sm:text-sm font-bold text-gray-500">{name}</span>
      </div>
    );
  }
  
  return (
    <div 
      className="h-8 sm:h-10 px-2 sm:px-3 bg-white border border-gray-100 rounded-lg flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
      title={name}
    >
      <img 
        src={logo} 
        alt={name}
        className="h-4 sm:h-6 w-auto object-contain max-w-[70px] sm:max-w-[100px]"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

// Company logo component with fallback  
const CompanyLogo = ({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) => {
  const [failed, setFailed] = useState(false);
  const logo = companyLogos[name];
  const dimensions = size === 'sm' ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10';
  const imgSize = size === 'sm' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5 sm:w-6 sm:h-6';
  
  // Get initials for fallback
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);
  
  if (failed || !logo) {
    return (
      <div className={`${dimensions} rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0`}>
        <span className="text-[10px] sm:text-xs font-bold text-blue-600">{initials}</span>
      </div>
    );
  }
  
  return (
    <div className={`${dimensions} rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0`}>
      <img 
        src={logo} 
        alt={name}
        className={`${imgSize} object-contain`}
        onError={() => setFailed(true)}
      />
    </div>
  );
};

// Section data
const sections = [
  {
    id: 'intro',
    title: BIO.name,
    subtitle: 'CTO & Technical Architect',
    icon: null,
    description: 'I help startups and scaleups build and scale SaaS products, backed by 12+ years of experience with industry leaders.',
    blueprint: [
      // Board outer frame
      'M 20 25 L 220 25 L 220 155 L 20 155 Z',
      // Column dividers
      'M 87 25 L 87 155',
      'M 153 25 L 153 155',
      // Column headers
      'M 20 45 L 220 45',
      // Header labels (small lines)
      'M 35 35 L 70 35',
      'M 100 35 L 140 35',
      'M 168 35 L 205 35',
      // Column 1 cards (To Do)
      'M 28 55 L 79 55 L 79 75 L 28 75 Z',
      'M 28 82 L 79 82 L 79 102 L 28 102 Z',
      'M 28 109 L 79 109 L 79 129 L 28 129 Z',
      // Column 2 cards (In Progress)
      'M 95 55 L 145 55 L 145 75 L 95 75 Z',
      'M 95 82 L 145 82 L 145 102 L 95 102 Z',
      // Column 3 cards (Done)
      'M 161 55 L 212 55 L 212 75 L 161 75 Z',
      'M 161 82 L 212 82 L 212 102 L 161 102 Z',
      'M 161 109 L 212 109 L 212 129 L 161 129 Z',
      'M 161 136 L 212 136 L 212 150 L 161 150 Z',
    ],
    content: {
      stats: [
        { value: '12+', label: 'Years Experience' },
        { value: '100k+', label: 'Users Served' },
        { value: '10+', label: 'Engineers Led' },
      ],
      clients: clientLogos,
      links: [
        { icon: Mail, label: 'Email', href: getSocialUrl('Email') },
        { icon: Linkedin, label: 'LinkedIn', href: getSocialUrl('LinkedIn') },
        { icon: Github, label: 'Github', href: getSocialUrl('GitHub') },
      ]
    }
  },
  {
    id: 'ai',
    title: 'AI Orchestration',
    subtitle: 'Intelligent Systems',
    icon: Brain,
    description: 'I design and implement AI-first architectures, from LLM orchestration to scalable copilots and intelligent automation.',
    blueprint: [
      // Chip outer frame
      'M 70 40 L 170 40 L 170 140 L 70 140 Z',
      // Chip inner frame
      'M 80 50 L 160 50 L 160 130 L 80 130 Z',
      // Top pins
      'M 90 40 L 90 25',
      'M 110 40 L 110 25',
      'M 130 40 L 130 25',
      'M 150 40 L 150 25',
      // Bottom pins
      'M 90 140 L 90 155',
      'M 110 140 L 110 155',
      'M 130 140 L 130 155',
      'M 150 140 L 150 155',
      // Left pins
      'M 70 60 L 55 60',
      'M 70 80 L 55 80',
      'M 70 100 L 55 100',
      'M 70 120 L 55 120',
      // Right pins
      'M 170 60 L 185 60',
      'M 170 80 L 185 80',
      'M 170 100 L 185 100',
      'M 170 120 L 185 120',
      // Internal circuit - AI core
      'M 100 70 L 140 70 L 140 110 L 100 110 Z',
      // Circuit traces
      'M 95 90 L 100 90',
      'M 140 90 L 145 90',
      'M 120 65 L 120 70',
      'M 120 110 L 120 115',
      // "LLM" text inside core
      'M 105 82 L 105 98 L 111 98',
      'M 115 82 L 115 98 L 121 98',
      'M 125 98 L 125 82 L 130 92 L 135 82 L 135 98',
    ],
    content: {
      skills: ['LangChain', 'Vertex AI', 'HuggingFace', 'LLM Orchestration', 'AI Copilots'],
      projects: [
        { name: 'Delfyn', desc: 'AI copilots for accounts receivable automation', period: '2023-2025' },
        { name: 'Abbove', desc: 'Wealth planning AI advisory systems', period: '2026-Present' },
      ]
    }
  },
  {
    id: 'scale',
    title: 'Scaling',
    subtitle: 'Architecture & Infrastructure',
    icon: Layers,
    description: 'I scale products from zero to 100k+ users through resilient multi-cloud infrastructure, high availability, and performance optimization.',
    blueprint: [
      // Rocket nose
      'M 120 25 L 100 60 L 140 60 Z',
      // Rocket body left
      'M 100 60 L 100 115',
      // Rocket body right
      'M 140 60 L 140 115',
      // Rocket body bottom
      'M 100 115 L 140 115',
      // Window
      'M 120 75 L 112 85 L 120 95 L 128 85 Z',
      // Left fin
      'M 100 100 L 80 125 L 100 115',
      // Right fin
      'M 140 100 L 160 125 L 140 115',
      // Flames center
      'M 108 115 L 105 140 L 120 130 L 135 140 L 132 115',
      // Flames small left
      'M 100 118 L 95 135',
      // Flames small right
      'M 140 118 L 145 135',
      // Speed lines left
      'M 70 40 L 45 40',
      'M 75 55 L 40 55',
      'M 70 70 L 35 70',
      'M 75 85 L 45 85',
      // Speed lines right
      'M 170 40 L 195 40',
      'M 165 55 L 200 55',
      'M 170 70 L 205 70',
      'M 165 85 L 195 85',
    ],
    content: {
      skills: ['Ruby on Rails', 'Python', 'Node.js', 'React', 'GCP', 'AWS', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
      achievements: [
        '99.9% SLA multi-cloud infrastructure',
        '30 servers deployed in China for YHD partnership',
        'Data lake & analytics pipelines for enterprise clients',
      ]
    }
  },
  {
    id: 'leadership',
    title: 'Leadership',
    subtitle: 'Teams & Strategy',
    icon: Users,
    description: 'I build and lead high-performance engineering teams, from startup co-founder to enterprise CTO.',
    blueprint: [
      'M 120 30 L 120 50',
      'M 120 50 L 60 90 M 120 50 L 180 90',
      'M 60 90 L 60 110 M 180 90 L 180 110',
      'M 60 110 L 30 140 M 60 110 L 90 140',
      'M 180 110 L 150 140 M 180 110 L 210 140',
      'M 30 140 L 30 160 M 90 140 L 90 160 M 150 140 L 150 160 M 210 140 L 210 160',
    ],
    content: {
      roles: [
        { title: 'Technical Architect', company: 'Abbove', location: 'Brussels (Remote)', period: 'Jan 2026 – Present', current: true },
        { title: 'Co-Founder & CTO', company: 'Delfyn', location: 'Amsterdam', period: 'Dec 2023 – Oct 2025' },
        { title: 'CTO', company: 'Moodwork', location: 'Paris', period: 'Dec 2016 – Nov 2023' },
      ]
    }
  },
];

function Consultancy() {
  const [activeSection, setActiveSection] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [introPhase, setIntroPhase] = useState(0); // 0: initial, 1: grid moving, 2: settling, 3: ready
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccumulator = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Intro sequence - grid and content fade in
  useEffect(() => {
    // Show grid
    const phase1 = setTimeout(() => setIntroPhase(1), 100);
    // Show content
    const phase2 = setTimeout(() => {
      setIntroPhase(2);
      setHasLoaded(true);
    }, 300);
    
    return () => {
      clearTimeout(phase1);
      clearTimeout(phase2);
    };
  }, []);

  // Mouse tracking for grid parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Navigation function - defined before hooks that use it
  const navigateSection = useCallback((direction: number) => {
    const newIndex = activeSection + direction;
    if (newIndex >= 0 && newIndex < sections.length) {
      setIsTransitioning(true);
      setActiveSection(newIndex);
      // Slightly longer cooldown for smoother feel
      setTimeout(() => setIsTransitioning(false), 900);
    }
  }, [activeSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigateSection(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigateSection(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, navigateSection]);

  // Wheel navigation (horizontal pan) with smooth accumulation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning) return;
      
      // Accumulate scroll delta with smoothing factor
      const delta = e.deltaY * 0.5; // Reduce sensitivity
      scrollAccumulator.current += delta;
      
      // Clear existing timeout for decay
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Check if accumulated scroll exceeds threshold
      const threshold = 80;
      if (Math.abs(scrollAccumulator.current) > threshold) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;
        scrollAccumulator.current = 0; // Reset accumulator
        navigateSection(direction);
      } else {
        // Decay the accumulator if no further scrolling
        scrollTimeout.current = setTimeout(() => {
          scrollAccumulator.current *= 0.5; // Gradual decay
          if (Math.abs(scrollAccumulator.current) < 5) {
            scrollAccumulator.current = 0;
          }
        }, 100);
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [isTransitioning, navigateSection]);

  // Touch/swipe navigation for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchStartX.current - touchEndX;
      const deltaY = touchStartY.current - touchEndY;
      
      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        navigateSection(deltaX > 0 ? 1 : -1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isTransitioning, navigateSection]);

  // Grid transform based on mouse
  const gridTransform = `
    perspective(1000px) 
    rotateX(${(mousePos.y - 0.5) * 8}deg) 
    rotateY(${(mousePos.x - 0.5) * -8}deg)
  `;

  const currentSection = sections[activeSection];

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen overflow-hidden bg-[#FAFAFA] text-[#1a1a1a] selection:bg-blue-100 cursor-default"
    >
      {/* CSS Keyframes for CTA pulse */}
      <style>{`
        @keyframes cta-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
          50% { transform: scale(1.03); box-shadow: 0 0 20px 4px rgba(59, 130, 246, 0.3); }
        }
      `}</style>

      {/* Isometric Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-[1.2s] ease-out"
        style={{ 
          transform: gridTransform,
          opacity: introPhase >= 1 ? 1 : 0,
          scale: introPhase >= 1 ? '1' : '1.05',
        }}
      >
        <svg className="w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="iso-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 30 L 60 60 L 120 30 Z" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
              <path d="M 0 30 L 60 0" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
              <path d="M 60 60 L 60 0" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="200%" height="200%" x="-50%" y="-50%" fill="url(#iso-grid)" />
        </svg>
      </div>

      {/* Navigation Bar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 sm:py-6 transition-all duration-700 ease-out bg-[#FAFAFA]/80 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none ${
          hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: hasLoaded ? '0ms' : '0ms', paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <span 
              className="text-lg font-semibold tracking-tight cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => { setIsTransitioning(true); setActiveSection(0); setTimeout(() => setIsTransitioning(false), 900); }}
            >
              JJ
            </span>
            {/* Section indicator - visible on all screen sizes */}
            <div className="flex items-center gap-1 text-xs text-gray-400 font-mono">
              <span className="text-blue-600">{String(activeSection + 1).padStart(2, '0')}</span>
              <span>/</span>
              <span>{String(sections.length).padStart(2, '0')}</span>
              <span className="hidden sm:inline ml-2 text-gray-300">·</span>
              <span className="hidden sm:inline text-gray-400 capitalize">{sections[activeSection].id}</span>
            </div>
          </div>
          
          <a 
            href={getSocialUrl('Calendar')}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full transition-all text-sm ${
              activeSection === sections.length - 1 ? 'ring-4 ring-blue-400/50 ring-offset-2 ring-offset-[#FAFAFA]' : ''
            }`}
            style={activeSection === sections.length - 1 ? { animation: 'cta-pulse 2s ease-in-out infinite' } : {}}
          >
            <Calendar size={16} />
            <span className="hidden sm:inline">Schedule a call</span>
            <span className="sm:hidden">Book</span>
          </a>
        </div>
      </nav>

      {/* Section Navigation Dots - Desktop only */}
      <div 
        className={`fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 transition-all duration-700 ease-out ${
          hasLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
        }`}
        style={{ transitionDelay: hasLoaded ? '200ms' : '0ms' }}
      >
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => { 
              if (!isTransitioning) {
                setIsTransitioning(true); 
                setActiveSection(index); 
                setTimeout(() => setIsTransitioning(false), 900); 
              }
            }}
            className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeSection 
                ? 'bg-blue-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
            }`}
          >

          </button>
        ))}
      </div>

      {/* Arrow Navigation */}
      <div 
        className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 sm:gap-4 transition-all duration-700 ease-out safe-area-bottom ${
          hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: hasLoaded ? '300ms' : '0ms', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <button
          onClick={() => !isTransitioning && navigateSection(-1)}
          disabled={activeSection === 0 || isTransitioning}
          className={`p-3 sm:p-3 rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
            activeSection === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : 'bg-white shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-110 text-gray-700 hover:text-blue-600'
          }`}
          aria-label="Previous section"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        </button>
        
        <div className="flex items-center gap-1.5 sm:gap-2 px-2">
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning && index !== activeSection) {
                  setIsTransitioning(true);
                  setActiveSection(index);
                  setTimeout(() => setIsTransitioning(false), 900);
                }
              }}
              className={`h-1.5 sm:h-1 rounded-full transition-all duration-500 ${
                index === activeSection 
                  ? 'w-6 sm:w-8 bg-blue-600' 
                  : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${section.title}`}
            />
          ))}
        </div>
        
        <button
          onClick={() => !isTransitioning && navigateSection(1)}
          disabled={activeSection === sections.length - 1 || isTransitioning}
          className={`p-3 sm:p-3 rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center ${
            activeSection === sections.length - 1 
              ? 'opacity-30 cursor-not-allowed' 
              : 'bg-white shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-110 text-gray-700 hover:text-blue-600'
          }`}
          aria-label="Next section"
        >
          <ArrowRight size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Horizontal Canvas */}
      <div 
        className={`h-full transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex ${
          hasLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          width: `${sections.length * 100}vw`,
          transform: `translateX(-${activeSection * 100}vw)`,
        }}
      >
        {sections.map((section, index) => {
          const isActive = index === activeSection;
          const Icon = section.icon;
          
          return (
            <section 
              key={section.id}
              className="h-full w-screen flex-shrink-0 overflow-y-auto"
            >
              {/* Mobile Layout */}
              <div className="lg:hidden min-h-full flex flex-col justify-center px-5 py-20">
                <div 
                  className="transition-all duration-500 ease-out"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: isActive ? '0.2s' : '0s',
                  }}
                >
                  {/* Section indicator */}
                  {Icon && (
                    <div className="inline-flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Icon size={16} className="text-blue-600" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        {section.subtitle}
                      </span>
                    </div>
                  )}
                  
                  {/* Title */}
                  <h1 className="text-3xl font-bold tracking-tight mb-3 leading-tight">
                    {section.title}
                  </h1>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {section.description}
                  </p>

                  {/* Mobile-specific section content rendered below */}
                  {section.id === 'intro' && section.content && (
                    <div className="space-y-5">
                      <div className="flex justify-between">
                        {section.content.stats?.map((stat) => (
                          <div key={stat.label}>
                            <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                            <div className="text-[10px] text-gray-400">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Trusted by</p>
                        <div className="flex flex-wrap gap-1.5">
                          {section.content.clients?.slice(0, 4).map((client) => (
                            <ClientLogo key={client.name} name={client.name} logo={client.logo} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={getSocialUrl('Calendar')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-3 rounded-full text-sm"
                        >
                          <Calendar size={16} />
                          Let's Talk
                        </a>
                        {section.content.links?.map(({ icon: LinkIcon, label, href }) => (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 text-gray-400 hover:text-blue-600 rounded-full"
                            aria-label={label}
                          >
                            <LinkIcon size={20} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.id === 'ai' && section.content && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {section.content.skills?.map((skill) => (
                          <span key={skill} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {section.content.projects?.map((project) => (
                          <div key={project.name} className="p-3 bg-white rounded-lg border border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">{project.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{project.period}</span>
                            </div>
                            <p className="text-xs text-gray-500">{project.desc}</p>
                            {project.name === 'Delfyn' && (
                              <Link 
                                target="_blank"
                                rel="noopener noreferrer"
                                to="/blog/building-ai-copilot-accounts-receivable" 
                                className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-medium mt-2"
                              >
                                <BookOpen size={12} />
                                Read the technical deep dive
                                <ArrowRight size={10} />
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.id === 'scale' && section.content && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {section.content.skills?.slice(0, 6).map((skill) => (
                          <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                        {(section.content.skills?.length ?? 0) > 6 && (
                          <span className="text-xs text-gray-400 px-2 py-1.5">+{(section.content.skills?.length ?? 0) - 6} more</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {section.content.achievements?.map((achievement, i) => (
                          <div key={i} className="flex gap-2 items-start">
                            <span className="text-blue-600 text-sm">→</span>
                            <span className="text-sm text-gray-600">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.id === 'leadership' && section.content && (
                    <div className="space-y-2">
                      {section.content.roles?.map((role) => (
                        <div key={role.company} className={`p-3 rounded-lg border ${role.current ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">{role.title}</span>
                            {role.current && <span className="text-[8px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-bold">NOW</span>}
                          </div>
                          <div className="text-blue-600 text-sm font-medium">{role.company}</div>
                          <div className="flex gap-3 text-[11px] text-gray-400 mt-1">
                            <span>{role.period}</span>
                            <span>{role.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex h-full items-center justify-center px-20">
                <div className="max-w-6xl w-full grid grid-cols-2 gap-16 items-center">
                  {/* Blueprint Visualization */}
                  <div className="relative">
                    <svg 
                      viewBox="0 0 240 180" 
                      className="w-full max-w-md mx-auto"
                      style={{ filter: 'drop-shadow(0 4px 20px rgba(37, 99, 235, 0.1))' }}
                    >
                      <rect x="10" y="10" width="220" height="160" fill="none" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 2" />
                      {section.blueprint.map((d, i) => (
                        <BlueprintLine key={i} d={d} delay={i * 0.15} duration={0.8} isActive={isActive && hasLoaded} />
                      ))}
                      <path d="M 10 25 L 10 10 L 25 10" fill="none" stroke="#2563eb" strokeWidth="2" />
                      <path d="M 215 10 L 230 10 L 230 25" fill="none" stroke="#2563eb" strokeWidth="2" />
                      <path d="M 230 155 L 230 170 L 215 170" fill="none" stroke="#2563eb" strokeWidth="2" />
                      <path d="M 25 170 L 10 170 L 10 155" fill="none" stroke="#2563eb" strokeWidth="2" />
                    </svg>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-gray-400 tracking-widest uppercase">
                      {section.id}.blueprint
                    </div>
                  </div>

                  {/* Content */}
                  <div 
                    className="transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateX(0)' : 'translateX(40px)',
                      transitionDelay: isActive ? '0.3s' : '0s',
                    }}
                  >
                    {Icon && (
                      <div className="inline-flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <Icon size={20} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">{section.subtitle}</span>
                      </div>
                    )}
                    
                    <h1 className="text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[0.95]">{section.title}</h1>
                    <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-lg">{section.description}</p>

                    {section.id === 'intro' && section.content && (
                      <div className="space-y-8">
                        <div className="flex gap-8">
                          {section.content.stats?.map((stat) => (
                            <div key={stat.label}>
                              <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                              <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Platforms I’ve built and maintain serve</p>
                          <div className="flex flex-wrap items-center gap-4">
                            {section.content.clients?.map((client) => (
                              <ClientLogo key={client.name} name={client.name} logo={client.logo} />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={getSocialUrl('Calendar')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-full transition-all text-sm">
                            <Calendar size={16} />Let's Talk
                          </a>
                          <span className="text-gray-300 mx-1">|</span>
                          {section.content.links?.map(({ icon: LinkIcon, label, href }) => (
                            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all" title={label}>
                              <LinkIcon size={20} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.id === 'ai' && section.content && (
                      <div className="space-y-8">
                        <div className="flex flex-wrap gap-2">
                          {section.content.skills?.map((skill) => (
                            <span key={skill} className="text-sm bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-lg font-medium">{skill}</span>
                          ))}
                        </div>
                        <div className="space-y-4">
                          {section.content.projects?.map((project) => (
                            <div key={project.name} className="p-4 bg-white rounded-xl border border-gray-100">
                              <div className="flex items-center gap-3 mb-2">
                                <CompanyLogo name={project.name} size="sm" />
                                <div className="flex-1 flex items-center justify-between">
                                  <span className="font-semibold">{project.name}</span>
                                  <span className="text-xs text-gray-400 font-mono">{project.period}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 ml-11">{project.desc}</p>
                              {project.name === 'Delfyn' && (
                                <Link 
                                  to="/blog/building-ai-copilot-accounts-receivable" 
                                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mt-3 ml-11 transition-colors"
                                >
                                  <BookOpen size={14} />
                                  Read the technical deep dive
                                  <ArrowRight size={12} />
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.id === 'scale' && section.content && (
                      <div className="space-y-8">
                        <div className="flex flex-wrap gap-2">
                          {section.content.skills?.map((skill) => (
                            <span key={skill} className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium">{skill}</span>
                          ))}
                        </div>
                        <div className="space-y-3">
                          {section.content.achievements?.map((achievement, i) => (
                            <div key={i} className="flex gap-3 items-start">
                              <span className="text-blue-600 mt-1">→</span>
                              <span className="text-gray-600">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {section.id === 'leadership' && section.content && (
                      <div className="space-y-4">
                        {section.content.roles?.map((role) => (
                          <div key={role.company} className={`p-5 rounded-xl border ${role.current ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                            <div className="flex items-start gap-4 mb-2">
                              <CompanyLogo name={role.company} size="sm" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{role.title}</span>
                                  {role.current && <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">NOW</span>}
                                </div>
                                <div className="text-blue-600 font-medium">{role.company}</div>
                              </div>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-400 ml-14">
                              <span className="flex items-center gap-1"><Calendar size={12} />{role.period}</span>
                              <span className="flex items-center gap-1"><MapPin size={12} />{role.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Scroll hint (only on intro) */}
      {activeSection === 0 && hasLoaded && (
        <div 
          className={`fixed bottom-[72px] lg:bottom-24 left-1/2 -translate-x-1/2 text-[10px] lg:text-xs text-gray-400 font-mono animate-pulse text-center px-4 transition-all duration-700 ease-out ${
            hasLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <span className="hidden lg:inline">Scroll or use arrows to navigate</span>
          <span className="lg:hidden">Swipe or tap arrows</span>
        </div>
      )}

      {/* Footer - Company info (left) - Desktop only */}
      <div 
        className={`fixed bottom-8 left-8 z-50 hidden lg:block transition-all duration-700 ease-out ${
          hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: hasLoaded ? '400ms' : '0ms' }}
      >
        <div className="text-[10px] font-mono text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            <span>Joanis Innovative Ventures B.V.</span>
          </div>
          <div className="pl-3.5 text-gray-300">VAT NL866400485B01</div>
        </div>
      </div>

      {/* Footer links (right) - Desktop only */}
      <div 
        className={`fixed bottom-8 right-8 z-50 hidden lg:flex items-center gap-4 text-xs text-gray-400 transition-all duration-700 ease-out ${
          hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: hasLoaded ? '400ms' : '0ms' }}
      >
        <Link to="/blog" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
          <BookOpen size={14} />
          Blog
        </Link>
        <span>·</span>
        <Link to="/desktop" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
          <Monitor size={14} />
          Desktop
        </Link>
        <span>·</span>
        <a href={getSocialUrl('GitHub')} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Github</a>
        <span>·</span>
        <a href={getSocialUrl('LinkedIn')} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">LinkedIn</a>
      </div>
      
      {/* Mobile footer with Blog/Desktop links */}
      <div 
        className={`fixed bottom-4 right-4 z-40 flex lg:hidden items-center gap-2 transition-all duration-700 ease-out ${
          hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: hasLoaded ? '400ms' : '0ms', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <Link 
          to="/blog" 
          className="p-2.5 bg-white/80 backdrop-blur-sm text-gray-500 hover:text-blue-600 rounded-full shadow-sm border border-gray-100"
          aria-label="Blog"
        >
          <BookOpen size={18} />
        </Link>
        <Link 
          to="/desktop" 
          className="p-2.5 bg-white/80 backdrop-blur-sm text-gray-500 hover:text-blue-600 rounded-full shadow-sm border border-gray-100"
          aria-label="Desktop"
        >
          <Monitor size={18} />
        </Link>
      </div>
    </div>
  );
}

export default Consultancy;
