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
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && !isMaximized && e.touches.length > 0) {
        e.preventDefault();
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - dragOffset.x,
          y: touch.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset, isMaximized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized || isMobile) return; // Disable dragging on mobile
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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMaximized || isMobile) return; // Disable dragging on mobile
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
  };

  // Allow content to trigger drag if it has the specific class
  const handleContentMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return; // Disable dragging on mobile
    const target = e.target as HTMLElement;
    const dragHandle = target.closest('.window-drag-handle');
    // Prevent dragging if clicking interactive elements inside the handle
    const isInteractive = target.closest('button, input, a, [role="button"]');
    
    if (dragHandle && !isInteractive) {
      handleMouseDown(e);
    }
  };

  const handleContentTouchStart = (e: React.TouchEvent) => {
    if (isMobile) return; // Disable dragging on mobile
    const target = e.target as HTMLElement;
    const dragHandle = target.closest('.window-drag-handle');
    const isInteractive = target.closest('button, input, a, [role="button"]');
    
    if (dragHandle && !isInteractive) {
      handleTouchStart(e);
    }
  };

  if (!isOpen || isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col bg-[#151A22] border border-white/5 rounded-xl overflow-hidden window-shadow transition-all duration-100 ${
        isMaximized ? 'inset-0 w-full h-[calc(100%-48px)] rounded-none' : ''
      }`}
      style={{
        transform: isMaximized ? 'none' : isMobile ? `translate(-50%, -50%)` : `translate(${position.x}px, ${position.y}px)`,
        width: isMaximized ? '100%' : `${size.w}px`,
        height: isMaximized ? 'calc(100% - 48px)' : `${size.h}px`,
        zIndex,
        maxWidth: isMaximized ? '100%' : isMobile ? '100%' : '90vw',
        maxHeight: isMaximized ? '100%' : isMobile ? '100%' : '80vh',
        left: isMaximized ? 0 : isMobile ? '50%' : 'auto',
        top: isMaximized ? 0 : isMobile ? '50%' : 'auto',
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-3 py-2 md:py-2 py-3 bg-[#151A22] border-b border-white/5 select-none touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onDoubleClick={!isMobile ? onMaximize : undefined}
      >
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          {/* Traffic Lights */}
          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="w-3 h-3 md:w-3 md:h-3 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors flex items-center justify-center group touch-manipulation"
            >
              <X size={8} className="text-red-900 opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 group-active:opacity-100" />
            </button>
            {!isMobile && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); onMinimize(); }}
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group touch-manipulation"
                >
                  <Minus size={8} className="text-yellow-900 opacity-0 group-hover:opacity-100" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onMaximize(); }}
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group touch-manipulation"
                >
                   {isMaximized ? 
                     <Square size={6} className="text-green-900 opacity-0 group-hover:opacity-100 fill-current" /> : 
                     <Maximize2 size={6} className="text-green-900 opacity-0 group-hover:opacity-100" />
                   }
                </button>
              </>
            )}
          </div>
          
          {/* Title */}
          <div className="flex items-center gap-2 text-xs md:text-xs font-medium text-slate-400 min-w-0 flex-1">
             <Icon size={14} className="flex-shrink-0 text-slate-300" />
             <span className="truncate">{title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-auto bg-[#151A22] text-slate-200 relative"
        onMouseDown={handleContentMouseDown}
        onTouchStart={handleContentTouchStart}
      >
        {children}
      </div>
    </div>
  );
};

export default Window;