import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';

interface WindowProps {
  id: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  initialPosition: { x: number; y: number };
  size?: { w: number; h: number };
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon: Icon,
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  initialPosition,
  size = { w: 800, h: 500 },
  children,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Allow content to trigger drag if it has the specific class
  const handleContentMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const dragHandle = target.closest('.window-drag-handle');
    // Prevent dragging if clicking interactive elements inside the handle
    const isInteractive = target.closest('button, input, a, [role="button"]');
    
    if (dragHandle && !isInteractive) {
      handleMouseDown(e);
    }
  };

  if (!isOpen || isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-[#1e1e1e] border border-white/10 rounded-lg overflow-hidden window-shadow transition-all duration-75 ${
        isMaximized ? 'inset-0 w-full h-[calc(100%-48px)] rounded-none' : ''
      }`}
      style={{
        transform: isMaximized ? 'none' : `translate(${position.x}px, ${position.y}px)`,
        width: isMaximized ? '100%' : `${size.w}px`,
        height: isMaximized ? 'calc(100% - 48px)' : `${size.h}px`,
        zIndex,
        maxWidth: isMaximized ? '100%' : '90vw',
        maxHeight: isMaximized ? '100%' : '80vh',
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-[#2d2d2d] border-b border-black/20 select-none"
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-3">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
            >
              <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group"
            >
              <Minus size={8} className="text-yellow-900 opacity-0 group-hover:opacity-100" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
            >
               {isMaximized ? 
                 <Square size={6} className="text-green-900 opacity-0 group-hover:opacity-100 fill-current" /> : 
                 <Maximize2 size={6} className="text-green-900 opacity-0 group-hover:opacity-100" />
               }
            </button>
          </div>
          
          {/* Title */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
             <Icon size={14} />
             <span>{title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-auto bg-[#1e1e1e] text-gray-200 relative"
        onMouseDown={handleContentMouseDown}
      >
        {children}
      </div>
    </div>
  );
};

export default Window;