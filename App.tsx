
import React, { useState } from 'react';
import Taskbar from './components/os/Taskbar';
import Window from './components/os/Window';
import Terminal from './components/apps/Terminal';
import Resume from './components/apps/Resume';
import Game from './components/apps/Game';
import Slack from './components/apps/Slack';
import Browser from './components/apps/Browser';
import { AppId, WindowState } from './types';
import { TerminalSquare, FileText, Globe, Gamepad2, Hash } from 'lucide-react';

const INITIAL_WINDOWS: WindowState[] = [
  {
    id: 'terminal',
    title: 'Terminal',
    icon: TerminalSquare,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 50, y: 50 },
  },
  {
    id: 'resume',
    title: 'Resume.pdf (Preview)',
    icon: FileText,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 9,
    position: { x: 100, y: 80 },
  },
  {
    id: 'browser',
    title: 'Chrome - Portfolio',
    icon: Globe,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 8,
    position: { x: 150, y: 110 },
  },
  {
    id: 'game',
    title: 'CTO_Quest.exe',
    icon: Gamepad2,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 7,
    position: { x: 200, y: 140 },
  },
  {
    id: 'slack',
    title: 'TeamChat',
    icon: Hash,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 6,
    position: { x: 250, y: 170 },
  }
];

function App() {
  const [windows, setWindows] = useState<WindowState[]>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<AppId | null>('terminal');
  const [highestZ, setHighestZ] = useState(10);

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
      // Open
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: highestZ + 1 } : w));
      setHighestZ(highestZ + 1);
      setActiveWindowId(id);
    }
  };

  const closeWindow = (id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const updateWindowState = (id: AppId, updates: Partial<WindowState>) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  return (
    <div className="h-full w-full bg-[#111827] text-slate-100 overflow-hidden relative selection:bg-blue-500/30 font-sans">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-60 pointer-events-none" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)' }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent pointer-events-none"></div>

      {/* Desktop Icons */}
      <div className="absolute top-8 left-8 flex flex-col gap-8 z-0">
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
    className="group flex flex-col items-center gap-2 w-20 text-center hover:bg-white/10 p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95"
  >
    <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-105 transition-transform group-hover:bg-white/20">
      <Icon className="text-white drop-shadow-md" size={32} strokeWidth={1.5} />
    </div>
    <span className="text-xs font-medium text-white drop-shadow-lg shadow-black tracking-wide">{label}</span>
  </button>
);

export default App;
