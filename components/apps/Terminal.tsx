import React, { useState, useRef, useEffect } from 'react';
import { BIO, EXPERIENCE, PROJECTS, SKILLS } from '../../constants';
import { getObfuscatedEmail, getEmailMailtoLink } from '../../utils/email';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; content: React.ReactNode }>>([
    { type: 'output', content: 'Welcome to JuniorOS v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Auto-focus input when clicking anywhere in terminal
  const handleContainerClick = () => {
      // Don't focus if the user is selecting text
      if (window.getSelection()?.toString()) return;
      inputRef.current?.focus();
  }

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    const newHistory = [...history, { type: 'input', content: cmd } as const];

    let output: React.ReactNode = '';

    switch (cleanCmd) {
      case 'help':
        output = (
          <div className="text-yellow-300">
            Available commands:<br/>
            - <span className="text-white font-bold">about</span>: Display bio<br/>
            - <span className="text-white font-bold">skills</span>: List technical skills<br/>
            - <span className="text-white font-bold">experience</span>: Show work history<br/>
            - <span className="text-white font-bold">projects</span>: List recent projects<br/>
            - <span className="text-white font-bold">contact</span>: Show contact info<br/>
            - <span className="text-white font-bold">clear</span>: Clear terminal<br/>
          </div>
        );
        break;
      case 'about':
        output = BIO.fullBio;
        break;
      case 'skills':
        output = (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKILLS.map(cat => (
                    <div key={cat.category}>
                        <div className="text-blue-400 font-bold mb-1">{cat.category}</div>
                        <div className="text-slate-300 text-sm">{cat.skills.join(', ')}</div>
                    </div>
                ))}
            </div>
        )
        break;
      case 'experience':
        output = (
            <div className="space-y-4">
                {EXPERIENCE.map(job => (
                    <div key={job.id}>
                        <div className="text-green-400 font-bold">{job.role} @ {job.company}</div>
                        <div className="text-slate-500 text-xs">{job.period} | {job.location}</div>
                        <ul className="list-disc list-inside text-slate-300 text-sm pl-2">
                            {job.description.slice(0, 2).map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        )
        break;
      case 'projects':
        output = (
            <div className="space-y-3">
                {PROJECTS.map(proj => (
                    <div key={proj.id}>
                        <div className="text-purple-400 font-bold">{proj.title}</div>
                        <div className="text-slate-300 text-sm">{proj.description}</div>
                        <div className="text-slate-500 text-xs">Tags: {proj.tags.join(', ')}</div>
                    </div>
                ))}
            </div>
        );
        break;
      case 'contact':
        output = (
            <div>
                <div>Email: <a href={getEmailMailtoLink()} className="text-blue-400 underline">{getObfuscatedEmail()}</a></div>
                <div>GitHub: <a href="https://github.com/JuniorJoanis" className="text-blue-400 underline">github.com/JuniorJoanis</a></div>
                <div>Twitter: <a href="https://x.com/juniorjoanis" className="text-blue-400 underline">@juniorjoanis</a></div>
            </div>
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        output = <span className="text-red-400">Command not found: {cleanCmd}. Type "help" for a list of commands.</span>;
    }

    setHistory([...newHistory, { type: 'output', content: output }]);
    setInput('');
  };

  return (
    <div className="window-drag-handle h-full bg-black/90 p-4 font-mono text-sm overflow-hidden flex flex-col" onClick={handleContainerClick}>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {history.map((entry, i) => (
          <div key={i} className={`${entry.type === 'input' ? 'text-white mt-4' : 'text-slate-300'}`}>
            {entry.type === 'input' ? (
              <span className="flex gap-2">
                <span className="text-green-500">➜</span>
                <span className="text-blue-400">~</span>
                <span>{entry.content}</span>
              </span>
            ) : (
              entry.content
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <span className="text-green-500">➜</span>
        <span className="text-blue-400">~</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCommand(input)}
          className="flex-1 bg-transparent outline-none text-white placeholder-slate-600"
          placeholder="Type 'help'..."
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;