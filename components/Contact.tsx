import React from 'react';
import SectionWrapper from './SectionWrapper';
import { SOCIALS } from '../constants';
import { Mail, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-background border-t border-white/5">
      <SectionWrapper id="contact" className="py-24">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Ready to scale your engineering?
            </h2>
            <p className="text-lg text-secondary mb-10 max-w-2xl mx-auto">
                I'm currently open to discussing CTO roles, technical advisory, and challenging engineering leadership opportunities in AI & Fintech.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                <a 
                    href="mailto:junior.joanis@gmail.com" 
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-accent hover:text-white transition-all shadow-lg shadow-white/10"
                >
                    <Mail size={20} />
                    junior.joanis@gmail.com
                </a>
                <a 
                    href="https://www.linkedin.com/in/juniorjoanis/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-surface border border-white/10 text-white font-medium rounded-full hover:bg-surfaceHighlight transition-all"
                >
                    <Linkedin size={20} />
                    Connect on LinkedIn
                </a>
            </div>

            <div className="flex justify-center gap-8 border-t border-white/5 pt-12">
                 {SOCIALS.map((social) => {
                    if(social.platform === "Email") return null;
                    return (
                        <a 
                            key={social.platform} 
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-secondary hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            {social.icon === 'github' && <Github size={18} />}
                            {social.icon === 'linkedin' && <Linkedin size={18} />}
                            {social.icon === 'twitter' && <Twitter size={18} />}
                            <span className="hidden md:inline">{social.platform}</span>
                        </a>
                    )
                 })}
            </div>
        </div>
      </SectionWrapper>
      
      <footer className="py-8 bg-black/40 text-center">
        <p className="text-xs text-secondary/50">
            © {new Date().getFullYear()} Junior Joanis. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Contact;