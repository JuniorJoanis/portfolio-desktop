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
    <div className="min-h-screen bg-[#FAFAF9] text-stone-600 selection:bg-stone-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Subtle noise texture overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Gradient atmosphere */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-stone-400/[0.10] via-stone-400/[0.04] to-transparent rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-stone-400/[0.06] rounded-full blur-[80px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#FAFAF9]/85 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/blog" className="flex items-center gap-3 group">
              <img
                src={BIO.avatarUrl}
                alt={BIO.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                className="p-2.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-all"
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
      <footer className="relative z-10 border-t border-stone-200 mt-24">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img
                src={BIO.avatarUrl}
                alt={BIO.name}
                className="w-6 h-6 rounded object-cover"
              />
              <span className="text-sm text-stone-500">
                © {new Date().getFullYear()} Junior Joanis
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm text-stone-500">
              <Link to="/" className="hover:text-stone-900 transition-colors">Consultancy</Link>
              <Link to="/desktop" className="hover:text-stone-900 transition-colors">Desktop</Link>
              <a href="/blog" className="hover:text-stone-900 transition-colors" title="Blog">Blog</a>
              <a href={getEmailMailtoLink()} className="hover:text-stone-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogLayout;
