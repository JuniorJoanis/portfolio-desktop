import React from 'react';
import { ArrowRight, ChevronRight, Layers, Layout, Users } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { BIO } from '../constants';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-20">
      <SectionWrapper id="hero" className="flex flex-col items-start justify-center z-10 w-full py-0">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Available for CTO & Engineering Leadership roles
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white leading-[1.1] mb-8 animate-fade-in [animation-delay:100ms]">
          Scaling <span className="text-secondary">AI-First</span> <br />
          SaaS Platforms.
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl text-lg md:text-xl text-secondary leading-relaxed mb-10 animate-fade-in [animation-delay:200ms]">
          I bridge the gap between technical excellence and product strategy. 
          With 12+ years of experience, I build and grow financial tools serving 100k+ users 
          for companies like AXA and BNP Paribas.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 animate-fade-in [animation-delay:300ms]">
          <a 
            href="#projects" 
            className="group flex items-center gap-2 bg-white text-black px-8 py-4 text-sm font-semibold rounded-full hover:bg-accent hover:text-white transition-all shadow-lg shadow-white/5"
          >
            View Selected Work
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#about" 
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 text-sm font-semibold rounded-full hover:bg-white/10 transition-all"
          >
            More About Me
          </a>
        </div>

        {/* Metrics Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-white/10 pt-12 animate-fade-in [animation-delay:400ms]">
           <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2 text-secondary text-sm font-medium mb-1">
               <Layers size={18} className="text-accent" />
               Expertise
             </div>
             <div className="text-xl text-white font-display font-semibold">
               Full-stack Architecture
             </div>
             <p className="text-sm text-secondary/60">Ruby on Rails, React, Node.js</p>
           </div>

           <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2 text-secondary text-sm font-medium mb-1">
               <Layout size={18} className="text-accent" />
               Focus
             </div>
             <div className="text-xl text-white font-display font-semibold">
               AI & Fintech SaaS
             </div>
             <p className="text-sm text-secondary/60">LLMs, Payments, Compliance</p>
           </div>

           <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2 text-secondary text-sm font-medium mb-1">
               <Users size={18} className="text-accent" />
               Leadership
             </div>
             <div className="text-xl text-white font-display font-semibold">
               Scaling Teams
             </div>
             <p className="text-sm text-secondary/60">Hiring, Strategy, Fundraising</p>
           </div>
        </div>

      </SectionWrapper>
    </div>
  );
};

export default Hero;