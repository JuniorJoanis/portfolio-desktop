import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Twitter } from 'lucide-react';
import { SOCIALS } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Expertise', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Work', href: '#projects' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className={`
            mx-auto rounded-full transition-all duration-300 flex justify-between items-center
            ${isScrolled ? 'bg-surface/80 backdrop-blur-md border border-white/5 pl-6 pr-2 py-2 shadow-lg shadow-black/20' : 'bg-transparent px-0 py-0'}
          `}>
            
            {/* Logo */}
            <a 
              href="#" 
              className="group relative flex items-center gap-2 font-display font-bold text-xl tracking-tight transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                {/* Gradient text effect */}
                <span className="relative z-10 bg-gradient-to-r from-white via-white to-accent bg-clip-text text-transparent group-hover:from-accent group-hover:via-white group-hover:to-accent transition-all duration-500">
                  Junior Joanis
                </span>
                {/* Glow effect on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-accent/20 via-white/10 to-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
              </div>
              {/* Animated dot */}
              <span className="relative inline-block w-2 h-2">
                <span className="absolute inset-0 bg-gradient-to-br from-accent to-accent/60 rounded-full animate-pulse"></span>
                <span className="absolute inset-0 bg-accent rounded-full blur-sm opacity-50 animate-ping"></span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center">
              <div className="flex items-center gap-1 bg-surfaceHighlight/50 rounded-full px-2 py-1 border border-white/5 mx-6 backdrop-blur-sm">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="px-4 py-1.5 text-sm font-medium text-secondary hover:text-white hover:bg-white/5 rounded-full transition-all"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                {SOCIALS.map((social) => {
                  if(social.platform === "Email") return null;
                  return (
                    <a 
                      key={social.platform} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 text-secondary hover:text-white hover:bg-white/10 rounded-full transition-all"
                      aria-label={social.platform}
                    >
                        {social.icon === 'github' && <Github size={18} />}
                        {social.icon === 'linkedin' && <Linkedin size={18} />}
                        {social.icon === 'twitter' && <Twitter size={18} />}
                    </a>
                  )
                })}
                <a 
                  href="#contact" 
                  className="ml-2 px-5 py-2 bg-white text-black hover:bg-accent hover:text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Contact
                </a>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col justify-center items-center md:hidden">
          <nav className="flex flex-col items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-2xl font-display font-medium text-secondary hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="h-px w-12 bg-white/10 my-4"></div>
            <a 
              href="#contact" 
              className="px-8 py-3 bg-white text-black font-bold rounded-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get in Touch
            </a>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;