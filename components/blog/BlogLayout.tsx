import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { getEmailMailtoLink } from '../../utils/email';
import { SOCIALS, BIO } from '../../constants';

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  twitter: <Twitter size={18} />,
  mail: <Mail size={18} />,
};

interface BlogLayoutProps {
  children: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-300 selection:bg-teal-500/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
      
      {/* Gradient atmosphere */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-teal-500/[0.07] via-cyan-500/[0.03] to-transparent rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-slate-500/[0.03] rounded-full blur-[80px] pointer-events-none z-0" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-[#0a0f1a]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/blog" className="flex items-center gap-3 group">
              <img 
                src={BIO.avatarUrl} 
                alt={BIO.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-lg font-medium text-slate-100 group-hover:text-teal-400 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Blog
              </span>
            </Link>
          </div>
          
          <nav className="flex items-center gap-1">
            {SOCIALS.filter(s => s.icon !== 'mail').map(social => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all"
              >
                {iconMap[social.icon]}
              </a>
            ))}
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 mt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img 
                src={BIO.avatarUrl} 
                alt={BIO.name}
                className="w-6 h-6 rounded object-cover"
              />
              <span className="text-sm text-slate-500">
                © 2026 Junior Joanis
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-500">
              <Link to="/" className="hover:text-teal-400 transition-colors">Portfolio</Link>
              <Link to="/blog" className="hover:text-teal-400 transition-colors">Blog</Link>
              <a href="/rss.xml" className="hover:text-teal-400 transition-colors" title="RSS Feed">RSS</a>
              <a href={getEmailMailtoLink()} className="hover:text-teal-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
