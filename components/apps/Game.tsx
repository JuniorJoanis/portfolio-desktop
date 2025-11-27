
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SKILLS } from '../../constants';
import { Play, RotateCcw, Trophy, Cpu, Zap, Target } from 'lucide-react';

const GRID_SIZE = 20;
const SPEED = 120; // Slightly faster for better feel

type Point = { x: number; y: number };
type GameState = 'START' | 'PLAYING' | 'GAME_OVER';
type FloatingText = { id: number; x: number; y: number; text: string };

const Game: React.FC = () => {
  // Flatten skills for the game content
  const allSkills = React.useMemo(() => 
    SKILLS.flatMap(cat => cat.skills).sort(() => Math.random() - 0.5), 
  []);

  const [gameState, setGameState] = useState<GameState>('START');
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentSkill, setCurrentSkill] = useState<string>(allSkills[0]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const gameLoopRef = useRef<number | null>(null);

  // Initialize Food
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
    const randomSkill = allSkills[Math.floor(Math.random() * allSkills.length)];
    setCurrentSkill(randomSkill);
  }, [allSkills]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameState('PLAYING');
    setFloatingTexts([]);
    generateFood([{ x: 10, y: 10 }]);
  };

  const gameOver = () => {
    setGameState('GAME_OVER');
    if (score > highScore) setHighScore(score);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  const addFloatingText = (text: string, x: number, y: number) => {
    const newText = { id: Date.now(), x, y, text };
    setFloatingTexts(prev => [...prev, newText]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 1000);
  };

  // Input Handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'PLAYING') return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, direction]);

  // Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        
        // Calculate new head position with wrap-around logic
        let newX = head.x + direction.x;
        let newY = head.y + direction.y;

        if (newX < 0) newX = GRID_SIZE - 1;
        if (newX >= GRID_SIZE) newX = 0;
        if (newY < 0) newY = GRID_SIZE - 1;
        if (newY >= GRID_SIZE) newY = 0;

        const newHead = { x: newX, y: newY };

        // Self Collision Check Only
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          gameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          addFloatingText(`+ ${currentSkill}`, newHead.x, newHead.y);
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    gameLoopRef.current = window.setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, direction, food, currentSkill, generateFood]);

  return (
    <div className="h-full w-full bg-slate-950 text-green-500 font-mono flex flex-col relative overflow-hidden select-none">
      
      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
      
      {/* Header Bar */}
      <div className="h-14 bg-slate-900 border-b border-green-900/50 flex items-center justify-between px-6 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Cpu className="text-green-400" size={20} />
          <div>
            <h1 className="text-lg font-bold tracking-widest text-green-400 leading-none">CTO_QUEST</h1>
            <p className="text-[10px] text-green-600 font-medium">SYSTEM STATUS: ONLINE</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <div className="text-[10px] text-green-600 uppercase">High Score</div>
              <div className="text-lg font-bold leading-none text-green-700">{highScore.toString().padStart(3, '0')}</div>
           </div>
           <div className="text-right">
              <div className="text-[10px] text-green-600 uppercase">Current Score</div>
              <div className="text-2xl font-bold leading-none text-white">{score.toString().padStart(3, '0')}</div>
           </div>
        </div>
      </div>

      {/* Main Game Container - Flex 1 to fill remaining height */}
      <div className="flex-1 relative flex items-center justify-center p-4 min-h-0 bg-slate-950/50">
        
        {/* Responsive Board Wrapper */}
        <div className="relative aspect-square h-full max-h-full max-w-full bg-black/80 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] rounded-sm overflow-hidden">
            
            {/* Grid Rendering */}
            <div 
              className="w-full h-full grid"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                const isSnakeHead = snake[0].x === x && snake[0].y === y;
                const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
                const isFood = food.x === x && food.y === y;

                let cellContent = null;
                
                if (isSnakeHead) {
                    cellContent = <div className="w-full h-full bg-green-400 rounded-sm shadow-[0_0_10px_rgba(74,222,128,0.8)]" />;
                } else if (isSnakeBody) {
                    cellContent = <div className="w-full h-full bg-green-700/80 rounded-sm border border-black/20" />;
                } else if (isFood) {
                    cellContent = (
                        <div className="w-full h-full flex items-center justify-center animate-pulse">
                            <div className="w-[80%] h-[80%] bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                        </div>
                    );
                } else {
                    // Grid lines
                    cellContent = <div className="w-full h-full border-[0.5px] border-green-900/10" />;
                }

                return <div key={i} className="w-full h-full">{cellContent}</div>;
              })}
            </div>

            {/* Floating Texts Layer */}
            {floatingTexts.map(ft => (
                <div 
                    key={ft.id}
                    className="absolute pointer-events-none text-xs md:text-sm font-bold text-white z-40 whitespace-nowrap animate-float-up"
                    style={{
                        left: `${(ft.x / GRID_SIZE) * 100}%`,
                        top: `${(ft.y / GRID_SIZE) * 100}%`,
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}
                >
                    {ft.text}
                </div>
            ))}

            {/* In-Game HUD - Top Center */}
            {gameState === 'PLAYING' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30 z-30">
                    <Target size={16} className="text-red-400 animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-green-500/70 uppercase leading-none font-bold">Acquire Skill</span>
                        <span className="text-sm text-white font-bold leading-none tracking-wide">{currentSkill}</span>
                    </div>
                </div>
            )}

            {/* Start Screen Overlay */}
            {gameState === 'START' && (
                <div className="absolute inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 mb-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <Trophy className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">CAREER_PATH.EXE</h2>
                    <p className="text-green-400/80 text-sm mb-8 max-w-[280px] leading-relaxed">
                        Navigate the grid. Collect technical skills to level up your resume. 
                    </p>
                    <button 
                        onClick={startGame}
                        className="group relative px-8 py-3 bg-green-600 hover:bg-green-500 text-black font-bold text-sm tracking-wider rounded overflow-hidden transition-all hover:scale-105 active:scale-95"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="flex items-center gap-2 relative z-10">
                            <Play size={16} fill="currentColor" /> INITIALIZE
                        </span>
                    </button>
                    <div className="mt-8 text-[10px] text-slate-500 font-mono">
                        ARROWS to Move • Borders Wrap Around
                    </div>
                </div>
            )}

            {/* Game Over Screen */}
            {gameState === 'GAME_OVER' && (
                <div className="absolute inset-0 bg-red-950/90 z-50 flex flex-col items-center justify-center text-center p-8">
                    <div className="mb-2 text-red-500 animate-pulse">
                        <Zap size={48} />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-widest">CRASHED</h2>
                    <p className="text-red-300/70 text-sm font-mono mb-6">Circular Dependency Detected</p>
                    
                    <div className="bg-black/40 p-4 rounded-lg border border-red-500/20 mb-8 w-full max-w-[200px]">
                        <div className="text-xs text-red-400 uppercase mb-1">Final Score</div>
                        <div className="text-3xl font-bold text-white">{score} <span className="text-sm font-normal text-red-300/50">Skills</span></div>
                    </div>

                    <button 
                        onClick={startGame}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-red-900 font-bold rounded shadow-lg shadow-red-900/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <RotateCcw size={16} /> REBOOT SYSTEM
                    </button>
                </div>
            )}
        </div>
      </div>
      
      {/* CSS Animation Styles */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-20px) scale(1.1); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Game;
