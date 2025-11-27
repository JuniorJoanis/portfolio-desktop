import React from 'react';
import SectionWrapper from './SectionWrapper';
import { PROJECTS } from '../constants';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';

const Projects: React.FC = () => {
  return (
    <SectionWrapper id="projects" className="bg-surface/30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
           <h2 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Selected Work</h2>
           <h3 className="text-3xl md:text-4xl font-display font-bold text-white">Featured Projects</h3>
        </div>
        
        <a 
          href="https://github.com/JuniorJoanis" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white hover:text-accent transition-colors text-sm font-medium border border-white/10 hover:border-accent px-4 py-2 rounded-full"
        >
          <FolderGit2 size={16} />
          Browse Full Portfolio
        </a>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <div key={project.id} className="group flex flex-col h-full bg-background border border-white/5 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300 hover:-translate-y-1">
            
            <div className="p-8 flex-grow">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-surface rounded-xl text-white">
                        <FolderGit2 size={24} />
                    </div>
                    <a href={project.link || "#"} className="text-secondary hover:text-white transition-colors">
                        <ArrowUpRight size={20} />
                    </a>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 font-display">{project.title}</h3>
                <p className="text-secondary text-sm leading-relaxed mb-6">
                    {project.description}
                </p>
                
                {project.metric && (
                   <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full mb-6">
                      {project.metric}
                   </div>
                )}
            </div>

            <div className="px-8 py-4 border-t border-white/5 bg-surface/50">
                <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-secondary/70">#{tag}</span>
                ))}
                </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Projects;