import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Rss, Github, Linkedin, Twitter } from 'lucide-react';
import { getEmailMailtoLink } from '../../utils/email';

interface BlogLayoutProps {
  children: React.ReactNode;
  showBackToHome?: boolean;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, showBackToHome = true }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#e4e4e7] selection:bg-amber-500/30">
      {/* Geometric background pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Gradient orbs */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {showBackToHome && (
              <Link 
                to="/" 
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-amber-400 transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono">~/home</span>
              </Link>
            )}
            <Link to="/blog" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center font-mono font-bold text-black text-sm">
                JJ
              </div>
              <span className="font-mono text-lg font-medium text-zinc-100 group-hover:text-amber-400 transition-colors">
                /blog
              </span>
            </Link>
          </div>
          
          <nav className="flex items-center gap-4">
            <a 
              href="https://github.com/JuniorJoanis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <Github size={18} />
            </a>
            <a 
              href="https://linkedin.com/in/juniorjoanis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <Linkedin size={18} />
            </a>
            <a 
              href="https://x.com/juniorjoanis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <Twitter size={18} />
            </a>
            <div className="w-px h-4 bg-zinc-700 mx-2" />
            <button className="p-2 text-zinc-500 hover:text-amber-400 transition-colors">
              <Rss size={18} />
            </button>
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-24">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded flex items-center justify-center font-mono font-bold text-black text-xs">
                JJ
              </div>
              <span className="text-sm text-zinc-500">
                © 2026 Junior Joanis. Engineering thoughts & technical deep-dives.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-600">
              <Link to="/" className="hover:text-amber-400 transition-colors">Portfolio</Link>
              <Link to="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
              <a href={getEmailMailtoLink()} className="hover:text-amber-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;

