import React from 'react';
import SectionWrapper from './SectionWrapper';
import { EXPERIENCE } from '../constants';
import { Calendar } from 'lucide-react';

const Experience: React.FC = () => {
  return (
    <SectionWrapper id="experience">
      <div className="mb-16 md:text-center max-w-2xl mx-auto">
        <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Career History</h2>
        <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Professional Journey</h3>
        <p className="text-secondary">
          A timeline of my leadership roles and technical contributions across international markets.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-px bg-white/10 md:-translate-x-1/2"></div>

        <div className="space-y-12">
          {EXPERIENCE.map((role, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={role.id} className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-[27px] md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-accent md:-translate-x-1/2 mt-1.5 z-10 shadow-[0_0_0_4px_rgba(9,9,11,1)]"></div>

                {/* Content Side */}
                <div className={`pl-16 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <div className="mb-2">
                    <h4 className="text-xl font-bold text-white font-display">{role.role}</h4>
                    <div className={`flex flex-wrap items-center gap-2 text-accent text-sm font-medium mt-1 mb-2 ${isEven ? 'md:justify-end' : ''}`}>
                      <span>{role.company}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-xs text-secondary mb-4 ${isEven ? 'md:justify-end' : ''}`}>
                    <Calendar size={12} />
                    <span>{role.period}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>{role.location}</span>
                  </div>

                  <p className="text-secondary text-sm leading-relaxed mb-4">
                    {role.description[0]} {role.description[1]}
                  </p>

                  <div className={`flex flex-wrap gap-2 ${isEven ? 'md:justify-end' : ''}`}>
                    {role.techStack.slice(0, 4).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-white/5 rounded text-xs text-secondary/80 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spacer Side */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Experience;