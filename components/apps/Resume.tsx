import React from 'react';
import { BIO, EXPERIENCE, SKILLS } from '../../constants';
import { Download, Mail, MapPin } from 'lucide-react';

const Resume: React.FC = () => {
  // Obfuscate email to prevent bot scraping
  const emailParts = ['junior', '.', 'joanis', '@', 'gmail', '.', 'com'];
  const email = emailParts.join('');

  return (
    <div className="h-full bg-[#525659] overflow-y-auto w-full">
      <div className="min-h-full flex justify-center p-4 md:p-8">
        <div className="bg-white text-black w-full max-w-[800px] min-h-[1000px] h-fit shadow-2xl p-8 md:p-12 font-sans text-sm relative">
          
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-6 mb-6 flex justify-between items-start">
              <div>
                  <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{BIO.name}</h1>
                  <h2 className="text-lg font-medium text-gray-600">CTO & Full-stack Engineer</h2>
              </div>
              <div className="text-right text-xs space-y-1">
                  <div className="flex items-center justify-end gap-2">
                      <Mail size={12} /> 
                      <a 
                        href={`mailto:${email}`}
                        className="hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `mailto:${email}`;
                        }}
                      >
                        {email}
                      </a>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                      <MapPin size={12} /> Amsterdam / Paris
                  </div>
                  <div className="text-blue-600 font-bold mt-2 cursor-pointer hover:underline flex items-center justify-end gap-1">
                      <a 
                        href="/resume.pdf"
                        download="resume.pdf"
                        className="hover:underline"
                      >
                        <Download size={12} /> Download PDF
                      </a>
                  </div>
                </div>
              </div>
          </div>

          {/* Summary */}
          <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">Summary</h3>
              <p className="text-gray-700 leading-relaxed">
                  {BIO.fullBio}
              </p>
          </div>

          {/* Skills */}
          <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-800">Core Competencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SKILLS.map((cat) => (
                      <div key={cat.category}>
                          <h4 className="font-bold text-xs text-gray-900 mb-1">{cat.category}</h4>
                          <div className="text-gray-600 text-xs leading-relaxed">
                              {cat.skills.join(' • ')}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Experience */}
          <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-4 text-gray-800">Professional Experience</h3>
              <div className="space-y-6">
                  {EXPERIENCE.map((job) => (
                      <div key={job.id}>
                          <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-bold text-base">{job.role}</h4>
                              <span className="text-gray-500 text-xs font-mono">{job.period}</span>
                          </div>
                          <div className="flex justify-between items-baseline mb-2">
                              <span className="text-blue-800 font-medium italic">{job.company}</span>
                              <span className="text-gray-500 text-xs">{job.location}</span>
                          </div>
                          <ul className="list-disc list-outside ml-4 space-y-1">
                              {job.description.map((point, i) => (
                                  <li key={i} className="text-gray-700 leading-snug pl-1">{point}</li>
                              ))}
                          </ul>
                      </div>
                  ))}
              </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Resume;