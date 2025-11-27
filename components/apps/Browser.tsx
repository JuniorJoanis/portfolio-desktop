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
            <div className="h-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex flex-col">
                {/* Compact Header */}
                <div className="flex-shrink-0 px-8 py-6 border-b border-slate-200/50 bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Globe size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                My Work
                            </h1>
                            <p className="text-xs text-slate-600">Exploring innovative solutions across Fintech, HealthTech, and AR/VR</p>
                        </div>
                    </div>
                </div>

                {/* Projects Grid - Fits in viewport */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full max-w-7xl mx-auto px-6 py-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                            {PROJECTS.map((project, index) => (
                                <div 
                                    key={project.id} 
                                    onClick={() => navigateTo(`https://portfolio.dev/project/${project.id}`)}
                                    className="group relative bg-white/90 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl border border-slate-200/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
                                >
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
                                    
                                    {/* Content */}
                                    <div className="relative p-4 flex flex-col h-full">
                                        {/* Icon & Title Row */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                                                <Globe size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {project.title}
                                                </h3>
                                                {project.metric && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200/50">
                                                        {project.metric}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {/* Description */}
                                        <p className="text-xs text-slate-600 leading-relaxed mb-3 flex-grow line-clamp-3">
                                            {project.description}
                                        </p>
                                        
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mt-auto">
                                            {project.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    {tag}
                                                </span>
                                            ))}
                                            {project.tags.length > 2 && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    +{project.tags.length - 2}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Hover Arrow */}
                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                                                <ExternalLink size={12} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                </div>
                            ))}
                        </div>
                    </div>
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
                                {activeProject.about || `This project represents a key milestone in my career, leveraging advanced technologies to solve complex problems in the ${activeProject.tags[0]} space.`}
                            </p>
                            
                            {activeProject.features && activeProject.features.length > 0 && (
                                <>
                                    <h3 className="text-xl font-bold mb-4 text-slate-900">Key Features</h3>
                                    <ul className="space-y-3">
                                        {activeProject.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5"></div>
                                                <p className="text-slate-600">{feature}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
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

                            {activeProject.role && (
                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <h4 className="font-bold text-slate-900 mb-2">Role</h4>
                                    <p className="text-sm text-slate-600">{activeProject.role}</p>
                                </div>
                            )}
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