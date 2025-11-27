import React, { useState, useEffect, useRef } from 'react';
import { Hash, Search, Bell, Info, Smile, Paperclip, Send, Clock } from 'lucide-react';

// Mock Data Types
type User = {
  id: string;
  name: string;
  avatar: string;
  status?: 'online' | 'offline' | 'busy';
};

type Message = {
  id: number;
  userId: string;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number }[];
};

type Channel = {
  id: string;
  name: string;
  topic: string;
  messages: Message[];
};

// Mock Users
const USERS: Record<string, User> = {
  'me': { id: 'me', name: 'Junior Joanis', avatar: 'JJ', status: 'online' },
  'alex': { id: 'alex', name: 'Alex (Lead Dev)', avatar: 'AL', status: 'busy' },
  'sarah': { id: 'sarah', name: 'Sarah (Product)', avatar: 'SA', status: 'online' },
  'mike': { id: 'mike', name: 'Mike (Junior Dev)', avatar: 'MI', status: 'offline' },
  'david': { id: 'david', name: 'David (DevOps)', avatar: 'DA', status: 'online' },
};

// Mock Data Content
const CHANNELS: Channel[] = [
  {
    id: 'architecture',
    name: 'architecture',
    topic: 'System design, scalability discussions & tech debt',
    messages: [
      {
        id: 1,
        userId: 'alex',
        timestamp: '10:30 AM',
        content: '@junior We are hitting a bottleneck with the current Postgres instance on the analytics reporting. Queries are taking ~4s.',
      },
      {
        id: 2,
        userId: 'me',
        timestamp: '10:45 AM',
        content: 'I noticed the I/O spike in Datadog. It\'s the `events_log` table join, right? We have two options: materialized views for the daily reports or offloading historical data to BigQuery.',
        reactions: [{ emoji: '👀', count: 2 }]
      },
      {
        id: 3,
        userId: 'alex',
        timestamp: '10:48 AM',
        content: 'Materialized views would be faster to implement, but BigQuery scales better long term.',
      },
      {
        id: 4,
        userId: 'me',
        timestamp: '10:55 AM',
        content: 'Let\'s go with Materialized Views for now to fix the SLA breach immediately (takes <1 day), but let\'s add the Data Warehouse migration to the Q3 roadmap. We shouldn\'t be doing heavy analytics on the production OLTP DB anyway.',
        reactions: [{ emoji: '🔥', count: 3 }, { emoji: '✅', count: 1 }]
      },
      {
        id: 5,
        userId: 'david',
        timestamp: '11:02 AM',
        content: 'Agreed. I\'ll provision a read replica specifically for the views so we don\'t lock the writer.',
      }
    ]
  },
  {
    id: 'product-strategy',
    name: 'product-strategy',
    topic: 'Roadmap, features, and business alignment',
    messages: [
      {
        id: 1,
        userId: 'sarah',
        timestamp: 'Yesterday',
        content: 'Junior, the investors are asking if we can rush the AI Copilot feature for the board meeting next week. Is it doable?',
      },
      {
        id: 2,
        userId: 'me',
        timestamp: 'Yesterday',
        content: 'Technically, yes, we could hack a prototype. But safely? No. We haven\'t finished the PII scrubbing layer for the LLM context window yet. Sending raw client financial data to OpenAI would be a GDPR violation.',
      },
      {
        id: 3,
        userId: 'sarah',
        timestamp: 'Yesterday',
        content: 'Good point. I don\'t want to risk compliance. What\'s the alternative?',
      },
      {
        id: 4,
        userId: 'me',
        timestamp: 'Yesterday',
        content: 'I can record a demo using synthetic/dummy data. It shows the capability without the risk. I\'ll have the team deploy the dummy environment by Tuesday.',
        reactions: [{ emoji: '🚀', count: 4 }]
      }
    ]
  },
  {
    id: 'mentorship',
    name: 'dev-mentorship',
    topic: 'System Design, Rails Architecture & DB Setup',
    messages: [
      {
        id: 1,
        userId: 'mike',
        timestamp: '1:15 PM',
        content: 'Hey Junior, I\'m spinning up the new billing service. Should I stick with the default SQLite for dev, or setup Postgres locally? Also, how should we handle multi-tenancy?',
      },
      {
        id: 2,
        userId: 'me',
        timestamp: '1:25 PM',
        content: 'Always use Postgres in dev. We want dev parity with prod to avoid "it works on my machine" issues, especially with JSONB columns and unique constraints. I\'ll send you the `docker-compose.yml` snippet.',
      },
      {
        id: 3,
        userId: 'me',
        timestamp: '1:27 PM',
        content: 'For multi-tenancy, since we are B2B, let\'s avoid a separate schema per tenant (too much overhead/migrations pain).',
      },
      {
        id: 4,
        userId: 'me',
        timestamp: '1:28 PM',
        content: 'Go with a single schema but enforce `organization_id` on every critical table. We can use the `acts_as_tenant` gem for app-level scoping, but I prefer enabling Row Level Security (RLS) in Postgres for absolute safety.',
        reactions: [{ emoji: '🛡️', count: 1 }, { emoji: '🐘', count: 2 }]
      },
      {
        id: 5,
        userId: 'mike',
        timestamp: '1:32 PM',
        content: 'Got it. RLS sounds robust. What about caching? Should I add Redis now?',
      },
      {
        id: 6,
        userId: 'me',
        timestamp: '1:35 PM',
        content: 'Yes, you\'ll need Redis for Sidekiq jobs anyway. But don\'t over-engineer the caching layer yet. Stick to "Monolith First". Premature microservices are the root of all evil.',
        reactions: [{ emoji: '🔥', count: 3 }]
      }
    ]
  }
];

const Slack: React.FC = () => {
  const [activeChannelId, setActiveChannelId] = useState('architecture');
  const activeChannel = CHANNELS.find(c => c.id === activeChannelId) || CHANNELS[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full bg-[#1A1D21] text-[#D1D2D3] font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-[260px] bg-[#3F0E40] flex flex-col flex-shrink-0">
        {/* Workspace Header */}
        <div className="window-drag-handle h-12 flex items-center px-4 font-bold text-white border-b border-white/10 hover:bg-[#350d36] transition-colors cursor-pointer">
          Junior's Workspace <span className="ml-1 text-[10px] opacity-70">▼</span>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
          
          {/* Section: Channels */}
          <div className="mb-6">
            <div className="px-4 flex items-center justify-between group mb-1">
               <span className="text-white/60 text-xs font-medium group-hover:text-white/80 transition-colors">Channels</span>
            </div>
            {CHANNELS.map(channel => (
              <div 
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                className={`
                  px-4 py-1 flex items-center cursor-pointer mb-[2px]
                  ${activeChannelId === channel.id ? 'bg-[#1164A3] text-white' : 'text-[#D1D2D3]/80 hover:bg-[#350d36]'}
                `}
              >
                <Hash size={14} className="mr-2 opacity-70" />
                <span className="truncate">{channel.name}</span>
              </div>
            ))}
          </div>

          {/* Section: Direct Messages */}
          <div>
            <div className="px-4 flex items-center justify-between group mb-1">
               <span className="text-white/60 text-xs font-medium group-hover:text-white/80 transition-colors">Direct messages</span>
            </div>
            {Object.values(USERS).filter(u => u.id !== 'me').map(user => (
              <div key={user.id} className="px-4 py-1 flex items-center gap-2 cursor-pointer text-[#D1D2D3]/80 hover:bg-[#350d36]">
                <div className="relative">
                    <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center text-[8px]">{user.avatar}</div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 border-2 border-[#3F0E40] rounded-full ${user.status === 'online' ? 'bg-green-500' : user.status === 'busy' ? 'bg-red-500' : 'border-2 border-white/30'}`}></div>
                </div>
                <span className="truncate opacity-90">{user.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#1A1D21]">
        
        {/* Header */}
        <div className="window-drag-handle h-12 border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0">
          <div className="font-bold flex items-center gap-1 text-white">
            <Hash size={16} className="text-white/50" />
            {activeChannel.name} 
            <span className="text-[10px] px-2 text-white/40 font-normal hidden md:inline truncate max-w-[300px]">{activeChannel.topic}</span>
          </div>
          
          <div className="flex items-center gap-4 text-white/60">
             <div className="flex -space-x-2">
                {Object.values(USERS).slice(0, 3).map(u => (
                    <div key={u.id} className="w-6 h-6 rounded bg-white/10 border border-[#1A1D21] flex items-center justify-center text-[9px] text-white">{u.avatar}</div>
                ))}
                <div className="w-6 h-6 rounded bg-white/5 border border-[#1A1D21] flex items-center justify-center text-[9px] text-white">+2</div>
             </div>
             <Info size={18} />
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {/* Welcome Message */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <Hash size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to #{activeChannel.name}!</h1>
            <p className="text-white/60">
              This is the start of the <span className="font-bold text-[#1164A3]">#{activeChannel.name}</span> channel. 
              {activeChannel.topic}.
            </p>
          </div>

          {activeChannel.messages.map((msg, idx) => {
            const user = USERS[msg.userId];
            const isMe = msg.userId === 'me';
            const showHeader = idx === 0 || activeChannel.messages[idx - 1].userId !== msg.userId;

            return (
              <div key={msg.id} className={`group flex gap-3 ${showHeader ? 'mt-4' : 'mt-1'} py-1 hover:bg-[#222529] -mx-4 px-4 transition-colors`}>
                {showHeader ? (
                  <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">
                    {user.avatar}
                  </div>
                ) : (
                  <div className="w-9 flex-shrink-0 text-[10px] text-white/20 text-right opacity-0 group-hover:opacity-100 select-none pt-1">
                    {msg.timestamp.split(' ')[0]}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {showHeader && (
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-white">{user.name}</span>
                      <span className="text-xs text-white/40">{msg.timestamp}</span>
                    </div>
                  )}
                  <p className="text-[#D1D2D3] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Reactions */}
                  {msg.reactions && (
                    <div className="flex gap-1 mt-1">
                        {msg.reactions.map((r, i) => (
                            <div key={i} className="bg-[#222529] border border-white/10 rounded-full px-1.5 py-0.5 text-xs flex items-center gap-1 cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all">
                                <span>{r.emoji}</span>
                                <span className="text-blue-400 font-medium">{r.count}</span>
                            </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 pb-4 pt-2">
          <div className="border border-white/20 rounded-lg bg-[#222529] overflow-hidden focus-within:border-white/40 transition-colors">
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-1 bg-[#222529] border-b border-white/5">
                <button className="p-1 hover:bg-white/5 rounded text-white/60"><span className="font-bold">B</span></button>
                <button className="p-1 hover:bg-white/5 rounded text-white/60"><span className="italic">I</span></button>
                <button className="p-1 hover:bg-white/5 rounded text-white/60"><span className="line-through">S</span></button>
            </div>
            
            <div className="p-2 min-h-[40px] text-white/40 text-sm">
                Message #{activeChannel.name}
            </div>
            
            <div className="flex justify-between items-center p-1 bg-[#222529]">
                <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/5 rounded-full text-white/60"><Paperclip size={16}/></button>
                    <button className="p-1.5 hover:bg-white/5 rounded-full text-white/60"><Smile size={16}/></button>
                </div>
                <button className="p-2 bg-transparent text-white/20 rounded cursor-not-allowed">
                    <Send size={16} />
                </button>
            </div>
          </div>
          <div className="text-center mt-2 text-[10px] text-white/30">
             Junior is currently offline. Replies may be delayed.
          </div>
        </div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default Slack;