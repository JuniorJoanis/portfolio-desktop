import React, { useState } from 'react';
import { PROJECTS } from '../../constants';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Home, Star, Globe, ExternalLink } from 'lucide-react';

const Browser: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('https://portfolio.dev/home');
  const [history, setHistory] = useState<string[]>(['https://portfolio.dev/home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigateTo = (url: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(url);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentUrl(url);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(history[historyIndex + 1]);
    }
  };

  const activeProject = PROJECTS.find(p => `https://portfolio.dev/project/${p.id}` === currentUrl);
  const isHome = currentUrl === 'https://portfolio.dev/home';

  return (
    <div className="flex flex-col h-full bg-[#35363A] text-white overflow-hidden font-sans">
      
      {/* Chrome Toolbar */}
      <div className="window-drag-handle flex items-center gap-2 p-2 bg-[#202124] border-b border-[#3c4043]">
        <div className="flex gap-2">
          <button onClick={handleBack} disabled={historyIndex === 0} className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
            <ArrowLeft size={16} />
          </button>
          <button onClick={handleForward} disabled={historyIndex === history.length - 1} className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
            <ArrowRight size={16} />
          </button>
          <button onClick={() => setCurrentUrl(currentUrl)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <RotateCw size={16} />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 bg-[#202124] border border-[#5f6368] rounded-full h-8 flex items-center px-4 gap-2 text-sm relative group focus-within:border-blue-400 focus-within:bg-[#202124]">
          <Lock size={12} className="text-green-500" />
          <input 
            type="text" 
            value={currentUrl} 
            onChange={(e) => setCurrentUrl(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-white/90"
          />
          <Star size={14} className="text-white/30 hover:text-blue-400 cursor-pointer transition-colors" />
        </div>

        <button onClick={() => navigateTo('https://portfolio.dev/home')} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <Home size={18} />
        </button>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-4 px-3 py-1.5 bg-[#202124] border-b border-[#3c4043] text-xs text-white/80">
         <button onClick={() => navigateTo('https://portfolio.dev/home')} className="hover:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
            <Home size={12} /> Home
         </button>
         {PROJECTS.map(p => (
             <button key={p.id} onClick={() => navigateTo(`https://portfolio.dev/project/${p.id}`)} className="hover:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1 truncate max-w-[100px]">
                <Globe size={12} /> {p.title}
             </button>
         ))}
      </div>

      {/* Viewport */}
      <div className="flex-1 overflow-y-auto bg-white text-slate-900 scroll-smooth">
        
        {/* HOMEPAGE VIEW */}
        {isHome && (
            <div className="min-h-full flex flex-col items-center pt-[10%] bg-[#F8F9FA]">
                <div className="mb-8 flex flex-col items-center gap-4 animate-fade-in">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Globe size={48} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-700">My Work</h1>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full px-4">
                    {PROJECTS.map((project) => (
                        <div 
                            key={project.id} 
                            onClick={() => navigateTo(`https://portfolio.dev/project/${project.id}`)}
                            className="group relative aspect-square bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 cursor-pointer transition-all hover:-translate-y-1 flex flex-col items-center justify-center p-4 text-center overflow-hidden"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Globe size={24} />
                            </div>
                            <h3 className="font-medium text-gray-800 text-sm">{project.title}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* PROJECT VIEW */}
        {activeProject && (
            <div className="min-h-full bg-white">
                {/* Hero */}
                <div className="bg-slate-900 text-white py-16 px-8 md:px-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0"></div>
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium mb-4 backdrop-blur-sm border border-white/10">{activeProject.metric}</span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{activeProject.title}</h1>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto">{activeProject.description}</p>
                        
                        <a 
                            href={activeProject.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                        >
                            Visit Live Site <ExternalLink size={16} />
                        </a>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto py-12 px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="col-span-2">
                            <h3 className="text-xl font-bold mb-4 text-slate-900">About the Project</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                This project represents a key milestone in my career, leveraging advanced technologies to solve complex problems in the {activeProject.tags[0]} space.
                                It involved orchestrating high-performance infrastructure and delivering a seamless user experience.
                            </p>
                            
                            <h3 className="text-xl font-bold mb-4 text-slate-900">Key Features</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5"></div>
                                    <p className="text-slate-600">Scalable Architecture handling high throughput.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5"></div>
                                    <p className="text-slate-600">Seamless Integration with third-party APIs.</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5"></div>
                                    <p className="text-slate-600">Advanced Analytics and Reporting Dashboards.</p>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6 h-fit border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-4">Tech Stack</h4>
                            <div className="flex flex-wrap gap-2">
                                {activeProject.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-600">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h4 className="font-bold text-slate-900 mb-2">Role</h4>
                                <p className="text-sm text-slate-600">CTO & Lead Engineer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Browser;