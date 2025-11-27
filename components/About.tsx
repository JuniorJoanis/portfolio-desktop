import React from 'react';
import SectionWrapper from './SectionWrapper';
import { Quote } from 'lucide-react';

const About: React.FC = () => {
  return (
    <SectionWrapper id="about" className="bg-surface/30">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        
        {/* Narrative */}
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-8">
            Strategic Engineering Leader
          </h2>
          
          <div className="space-y-6 text-secondary text-lg leading-relaxed">
            <p>
              My journey began over 12 years ago, writing code for early-stage startups in San Francisco. Since then, I've evolved into a technical leader, architecting platforms for enterprise giants and co-founding successful SaaS ventures.
            </p>
            <p>
              I don't just write code; I build systems. My expertise lies at the intersection of <span className="text-white font-medium">robust architecture</span> and <span className="text-white font-medium">product strategy</span>. I have led engineering teams through rapid scaling phases, navigated complex Fintech compliance landscapes, and delivered AI-driven solutions that solve real business problems.
            </p>
            <p>
              Today, I focus on bridging the gap between traditional SaaS stability and the transformative potential of Large Language Models (LLMs).
            </p>
          </div>
        </div>

        {/* Highlight Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50"></div>
          <div className="relative bg-surface border border-white/10 p-10 rounded-2xl">
            <Quote className="text-accent mb-6 w-10 h-10 opacity-50" />
            <blockquote className="text-2xl font-display font-medium text-white mb-8 leading-relaxed">
              "Great engineering isn't just about code quality—it's about aligning technical decisions with business goals to build resilient, scalable products."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10"></div>
              <div>
                <div className="text-white font-bold">Junior Joanis</div>
                <div className="text-secondary text-sm">CTO & Co-Founder</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
};

export default About;