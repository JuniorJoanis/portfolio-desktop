import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppId, WindowState } from '../../types';
import { Battery, Wifi, BookOpen, Briefcase } from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: AppId | null;
  onToggleWindow: (id: AppId) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, activeWindowId, onToggleWindow }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isBlogActive = location.pathname.startsWith('/blog');
  const isConsultancyActive = location.pathname === '/';

  return (
    <div className="h-12 md:h-12 bg-[#1e293b]/80 backdrop-blur-md border-t border-white/10 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-2 md:px-4">
      {/* Start / Menu (Simplified) - Hidden on mobile */}
      <div className="hidden md:flex items-center gap-4">
        <button className="p-2 rounded hover:bg-white/10 transition-colors">
            <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
            </div>
        </button>
      </div>

      {/* Running Apps */}
      <div className="flex items-center gap-0.5 md:gap-1 flex-1 justify-center h-full overflow-x-auto scrollbar-hide">
        {windows.map((win) => {
            const Icon = win.icon;
            const isActive = activeWindowId === win.id && !win.isMinimized;
            
            return (
                <button
                    key={win.id}
                    onClick={() => onToggleWindow(win.id)}
                    className={`
                        group relative h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg transition-all flex-shrink-0 touch-manipulation
                        ${isActive ? 'bg-white/10' : 'hover:bg-white/5 active:bg-white/10'}
                        ${win.isOpen ? 'opacity-100' : 'opacity-50'}
                    `}
                    title={win.title}
                >
                    <Icon size={18} className={`md:w-5 md:h-5 ${isActive ? 'text-blue-400' : 'text-slate-300'}`} />
                    {/* Active Indicator */}
                    {win.isOpen && (
                        <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isActive ? 'bg-blue-400' : 'bg-slate-500'}`} />
                    )}
                </button>
            )
        })}
        
        {/* Blog Button - Always visible for quick access */}
        <button
          onClick={() => navigate('/blog')}
          className={`
            group relative h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg transition-all flex-shrink-0 touch-manipulation
            ${isBlogActive ? 'bg-white/10 opacity-100' : 'hover:bg-white/5 active:bg-white/10 opacity-50'}
          `}
          title="Blog"
        >
          <BookOpen size={18} className={`md:w-5 md:h-5 ${isBlogActive ? 'text-blue-400' : 'text-slate-300'}`} />
          {/* Active Indicator */}
          {isBlogActive && (
            <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-400" />
          )}
        </button>
        
        {/* Consultancy Button */}
        <button
          onClick={() => navigate('/')}
          className={`
            group relative h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-lg transition-all flex-shrink-0 touch-manipulation
            ${isConsultancyActive ? 'bg-white/10 opacity-100' : 'hover:bg-white/5 active:bg-white/10 opacity-50'}
          `}
          title="Consultancy"
        >
          <Briefcase size={18} className={`md:w-5 md:h-5 ${isConsultancyActive ? 'text-blue-400' : 'text-slate-300'}`} />
          {/* Active Indicator */}
          {isConsultancyActive && (
            <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-blue-400" />
          )}
        </button>
      </div>

      {/* System Tray */}
      <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300 flex-shrink-0">
        <div className="flex items-center gap-2">
            <Wifi size={14} />
            <Battery size={14} />
        </div>
        <div className="flex flex-col items-end leading-none gap-1.5">
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] text-slate-500">{time.toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Mobile: Show time only */}
      <div className="md:hidden flex items-center text-xs font-medium text-slate-300 flex-shrink-0 px-2">
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};

export default Taskbar;
