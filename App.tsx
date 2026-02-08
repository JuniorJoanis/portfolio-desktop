
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Taskbar from './components/os/Taskbar';
import Window from './components/os/Window';
import Terminal from './components/apps/Terminal';
import Resume from './components/apps/Resume';
import Game from './components/apps/Game';
import Slack from './components/apps/Slack';
import Browser from './components/apps/Browser';
import { AppId, WindowState } from './types';
import { TerminalSquare, FileText, Globe, Gamepad2, Hash, BookOpen, Briefcase } from 'lucide-react';

// Helper function to detect mobile devices
const isMobile = (): boolean => {
  return window.innerWidth < 768;
};

// Helper function to get responsive window size
const getWindowSize = (defaultWidth: number = 800, defaultHeight: number = 500): { w: number; h: number } => {
  const taskbarHeight = 48;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight - taskbarHeight;
  
  if (isMobile()) {
    // On mobile, use 95% of viewport with small padding
    return {
      w: Math.floor(viewportWidth * 0.95),
      h: Math.floor(viewportHeight * 0.9),
    };
  }
  
  // On desktop, use provided defaults but ensure they fit
  return {
    w: Math.min(defaultWidth, Math.floor(viewportWidth * 0.9)),
    h: Math.min(defaultHeight, Math.floor(viewportHeight * 0.85)),
  };
};

// Helper function to calculate centered position
const getCenteredPosition = (): { x: number; y: number } => {
  const size = getWindowSize();
  const taskbarHeight = 48;
  
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight - taskbarHeight;
  
  return {
    x: (viewportWidth - size.w) / 2,
    y: (viewportHeight - size.h) / 2,
  };
};

// Helper function to calculate offset position for cascading windows
const getOffsetPosition = (index: number, windowWidth: number = 800, windowHeight: number = 500): { x: number; y: number } => {
  const taskbarHeight = 48;
  const offsetX = isMobile() ? 0 : 50; // No offset on mobile
  const offsetY = isMobile() ? 0 : 50;
  
  const size = getWindowSize(windowWidth, windowHeight);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight - taskbarHeight;
  
  const centeredX = (viewportWidth - size.w) / 2;
  const centeredY = (viewportHeight - size.h) / 2;
  
  return {
    x: centeredX + (offsetX * index),
    y: centeredY + (offsetY * index),
  };
};

// Helper function to calculate browser size based on screen dimensions
const getBrowserSize = (): { w: number; h: number } => {
  const taskbarHeight = 48;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight - taskbarHeight;
  
  if (isMobile()) {
    // On mobile, use 95% of viewport
    return {
      w: Math.floor(viewportWidth * 0.95),
      h: Math.floor(viewportHeight * 0.9),
    };
  }
  
  // Use 85% of viewport width and 75% of viewport height, with minimum sizes
  const width = Math.max(1000, Math.floor(viewportWidth * 0.85));
  const height = Math.max(600, Math.floor(viewportHeight * 0.75));
  
  return { w: width, h: height };
};

// Initialize windows with mobile detection
const getInitialWindows = (): WindowState[] => {
  const mobile = isMobile();
  return [
    {
      id: 'terminal',
      title: 'Terminal',
      icon: TerminalSquare,
      isOpen: true,
      isMinimized: false,
      isMaximized: mobile, // Auto-maximize on mobile
      zIndex: 10,
      position: getCenteredPosition(),
    },
    {
      id: 'resume',
      title: 'Resume.pdf (Preview)',
      icon: FileText,
      isOpen: false,
      isMinimized: false,
      isMaximized: mobile,
      zIndex: 9,
      position: getOffsetPosition(1),
    },
    {
      id: 'browser',
      title: 'Chrome - Portfolio',
      icon: Globe,
      isOpen: false,
      isMinimized: false,
      isMaximized: mobile,
      zIndex: 8,
      position: (() => {
        const browserSize = getBrowserSize();
        return getOffsetPosition(2, browserSize.w, browserSize.h);
      })(),
      size: getBrowserSize(),
    },
    {
      id: 'game',
      title: 'CTO_Quest.exe',
      icon: Gamepad2,
      isOpen: false,
      isMinimized: false,
      isMaximized: mobile,
      zIndex: 7,
      position: getOffsetPosition(3),
    },
    {
      id: 'slack',
      title: 'TeamChat',
      icon: Hash,
      isOpen: false,
      isMinimized: false,
      isMaximized: mobile,
      zIndex: 6,
      position: getOffsetPosition(4, 800, 700),
      size: { w: 800, h: 700 },
    }
  ];
};

const INITIAL_WINDOWS: WindowState[] = getInitialWindows();

function App() {
  const navigate = useNavigate();
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>('terminal');
  const [highestZ, setHighestZ] = useState(10);
  const [isMobileDevice, setIsMobileDevice] = useState(isMobile());

  // Handle window resize and auto-maximize on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = isMobile();
      setIsMobileDevice(mobile);
      
      // Auto-maximize all open windows on mobile
      if (mobile) {
        setWindows(prev => prev.map(w => 
          w.isOpen && !w.isMinimized ? { ...w, isMaximized: true } : w
        ));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const focusWindow = (id: AppId) => {
    const newZ = highestZ + 1;
    setHighestZ(newZ);
    setActiveWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w));
  };

  const toggleWindow = (id: AppId) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;

    if (win.isOpen && activeWindowId === id && !win.isMinimized) {
      // Minimize
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
      setActiveWindowId(null);
    } else if (win.isOpen && win.isMinimized) {
      // Restore
      focusWindow(id);
    } else if (win.isOpen && activeWindowId !== id) {
      // Focus
      focusWindow(id);
    } else {
      // Open - auto-maximize on mobile
      const shouldMaximize = isMobileDevice;
      setWindows(prev => prev.map(w => w.id === id ? { 
        ...w, 
        isOpen: true, 
        isMinimized: false, 
        isMaximized: shouldMaximize,
        zIndex: highestZ + 1 
      } : w));
      setHighestZ(highestZ + 1);
      setActiveWindowId(id);
    }
  };

  const closeWindow = (id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const updateWindowState = (id: AppId, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        const newState = { ...w, ...updates };
        // On mobile, ensure windows stay maximized when opened
        if (isMobileDevice && newState.isOpen && !newState.isMinimized && !updates.isMaximized) {
          newState.isMaximized = true;
        }
        return newState;
      }
      return w;
    }));
  };

  return (
    <div className="h-full w-full bg-[#0F1217] text-slate-100 overflow-hidden relative selection:bg-blue-500/20 font-sans">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(148,163,184,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(125,211,252,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,rgba(59,130,246,0.06),transparent_55%)]" />
      </div>

      {/* Desktop Icons - Hidden on mobile, shown on desktop */}
      <div className="hidden md:block absolute top-8 left-8 flex flex-col gap-8 z-0">
        <DesktopIcon 
          icon={TerminalSquare} 
          label="Terminal" 
          onClick={() => toggleWindow('terminal')} 
        />
        <DesktopIcon 
          icon={FileText} 
          label="Resume" 
          onClick={() => toggleWindow('resume')} 
        />
        <DesktopIcon 
          icon={Globe} 
          label="Chrome" 
          onClick={() => toggleWindow('browser')} 
        />
        <DesktopIcon 
          icon={Gamepad2} 
          label="CTO Quest" 
          onClick={() => toggleWindow('game')} 
        />
        <DesktopIcon 
          icon={Hash} 
          label="TeamChat" 
          onClick={() => toggleWindow('slack')} 
        />
        <DesktopIcon 
          icon={BookOpen} 
          label="Blog" 
          onClick={() => navigate('/blog')} 
        />
        <DesktopIcon 
          icon={Briefcase} 
          label="Consultancy" 
          onClick={() => navigate('/')} 
        />
      </div>

      {/* Windows Area */}
      <div className="absolute inset-0 pb-12 pointer-events-none">
        {windows.map((win) => (
          <div key={win.id} className="pointer-events-auto">
             <Window
               {...win}
               onClose={() => closeWindow(win.id)}
               onMinimize={() => updateWindowState(win.id, { isMinimized: true })}
               onMaximize={() => updateWindowState(win.id, { isMaximized: !win.isMaximized })}
               onFocus={() => focusWindow(win.id)}
               initialPosition={win.position}
               size={win.size}
             >
                {win.id === 'terminal' && <Terminal />}
                {win.id === 'resume' && <Resume />}
                {win.id === 'browser' && <Browser />}
                {win.id === 'game' && <Game />}
                {win.id === 'slack' && <Slack />}
             </Window>
          </div>
        ))}
      </div>

      <Taskbar windows={windows} activeWindowId={activeWindowId} onToggleWindow={toggleWindow} />
    </div>
  );
}

// Simple Components helpers
const DesktopIcon = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="group flex flex-col items-center gap-2 w-20 text-center rounded-lg px-2 py-2 text-slate-300 hover:text-slate-100 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
  >
    <div className="w-12 h-12 border border-white/10 bg-white/5 rounded-xl flex items-center justify-center">
      <Icon className="text-slate-200" size={28} strokeWidth={1.5} />
    </div>
    <span className="text-xs font-medium tracking-wide">{label}</span>
  </button>
);

export default App;
