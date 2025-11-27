import React from 'react';
import SectionWrapper from './SectionWrapper';
import { SKILLS } from '../constants';
import { Code2, Cpu, Users } from 'lucide-react';

const Skills: React.FC = () => {
  const getIcon = (category: string) => {
    if (category.includes("Engineering")) return <Code2 size={24} className="text-accent" />;
    if (category.includes("AI")) return <Cpu size={24} className="text-purple-500" />;
    return <Users size={24} className="text-emerald-500" />;
  };

  return (
    <SectionWrapper id="skills" className="relative overflow-hidden">
      <div className="mb-16 max-w-3xl">
        <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Core Competencies</h2>
        <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Technical & Strategic Stack</h3>
        <p className="text-secondary text-lg">
          A comprehensive toolkit honed over a decade of building scalable SaaS products and leading high-performing teams.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {SKILLS.map((group) => (
          <div key={group.category} className="group bg-surface/50 border border-white/5 hover:border-white/10 rounded-2xl p-8 transition-all hover:bg-surface hover:shadow-xl hover:-translate-y-1">
            <div className="mb-6 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
              {getIcon(group.category)}
            </div>
            
            <h4 className="text-xl font-bold text-white font-display mb-4">{group.category}</h4>
            
            <ul className="space-y-3">
              {group.skills.map((skill) => (
                <li key={skill} className="flex items-center gap-3 text-secondary group-hover:text-white/90 transition-colors text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-accent transition-colors"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Skills;