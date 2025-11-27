import React, { useEffect, useState } from 'react';
import { AppId, WindowState } from '../../types';
import { Battery, Wifi } from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: AppId | null;
  onToggleWindow: (id: AppId) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ windows, activeWindowId, onToggleWindow }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-12 bg-[#1e293b]/80 backdrop-blur-md border-t border-white/10 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4">
      {/* Start / Menu (Simplified) */}
      <div className="flex items-center gap-4">
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
      <div className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2 h-full">
        {windows.map((win) => {
            const Icon = win.icon;
            const isActive = activeWindowId === win.id && !win.isMinimized;
            
            return (
                <button
                    key={win.id}
                    onClick={() => onToggleWindow(win.id)}
                    className={`
                        group relative h-10 w-10 flex items-center justify-center rounded-lg transition-all
                        ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                        ${win.isOpen ? 'opacity-100' : 'opacity-50'}
                    `}
                    title={win.title}
                >
                    <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-300'} />
                    {/* Active Indicator */}
                    {win.isOpen && (
                        <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isActive ? 'bg-blue-400' : 'bg-slate-500'}`} />
                    )}
                </button>
            )
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
        <div className="flex items-center gap-2">
            <Wifi size={14} />
            <Battery size={14} />
        </div>
        <div className="flex flex-col items-end leading-none gap-1.5">
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] text-slate-500">{time.toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
