import React, { useState, useEffect, useRef } from 'react';
import { Hash, Search, Bell, Info, Smile, Paperclip, Send, Clock, Menu, X } from 'lucide-react';

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
};

// Direct Message Conversations
const DIRECT_MESSAGES: Record<string, Message[]> = {
  'alex': [
    {
      id: 1,
      userId: 'alex',
      timestamp: '4:15 PM',
      content: "Junior, I've been thinking about our payment reconciliation flow. The current fuzzy matching is working, but I'm seeing edge cases where we're creating duplicate invoices when the same payment comes through multiple channels.",
    },
    {
      id: 2,
      userId: 'me',
      timestamp: '4:18 PM',
      content: "Good observation. Are you seeing this with specific payment providers or across the board?",
      reactions: [{ emoji: '🤔', count: 1 }]
    },
    {
      id: 3,
      userId: 'alex',
      timestamp: '4:20 PM',
      content: "Mainly with BNPL providers — they send webhook confirmations at different stages (authorization, capture, settlement). Our matching logic treats each as a separate payment.",
    },
    {
      id: 4,
      userId: 'me',
      timestamp: '4:23 PM',
      content: "We need to deduplicate by payment intent, not just transaction ID. Build a state machine: pending → authorized → captured → settled. Only create an invoice on 'settled'. Store the intermediate states for audit but don't trigger reconciliation.",
      reactions: [{ emoji: '💡', count: 2 }, { emoji: '✅', count: 1 }]
    },
    {
      id: 5,
      userId: 'alex',
      timestamp: '4:26 PM',
      content: "That's cleaner. Should I add idempotency keys to the webhook handler too? In case we get duplicate webhooks.",
    },
    {
      id: 6,
      userId: 'me',
      timestamp: '4:28 PM',
      content: "Yes, absolutely. Use Redis with TTL for idempotency — store the webhook signature + timestamp. And add a unique constraint on (payment_intent_id, status) in the DB as a safety net.",
      reactions: [{ emoji: '🛡️', count: 1 }]
    },
    {
      id: 7,
      userId: 'alex',
      timestamp: '4:31 PM',
      content: "Perfect. One more thing — should I refactor the matching service now or wait until after we ship the AI Copilot?",
    },
    {
      id: 8,
      userId: 'me',
      timestamp: '4:34 PM',
      content: "Do it now. Payment reconciliation is core infrastructure — it affects every customer. The Copilot can wait a sprint. Fix the foundation first.",
      reactions: [{ emoji: '🎯', count: 1 }, { emoji: '🔥', count: 1 }]
    },
    {
      id: 9,
      userId: 'alex',
      timestamp: '4:36 PM',
      content: "Makes sense. I'll have a PR ready by Wednesday. Thanks for the guidance!",
      reactions: [{ emoji: '👍', count: 1 }]
    },
  ],
  'sarah': [
    {
      id: 1,
      userId: 'sarah',
      timestamp: '2:15 PM',
      content: "Junior, I've been talking to our enterprise prospects. They're all asking about SSO and advanced permissions. Should we prioritize this over the AI features?",
    },
    {
      id: 2,
      userId: 'me',
      timestamp: '2:18 PM',
      content: "SSO is a blocker for enterprise deals — we need it. But we can do both: SSO is mostly configuration work, AI is engineering. They don't conflict.",
      reactions: [{ emoji: '💡', count: 1 }]
    },
    {
      id: 3,
      userId: 'sarah',
      timestamp: '2:20 PM',
      content: "That makes sense. What's your estimate on SSO implementation? One of the prospects wants to move fast.",
    },
    {
      id: 4,
      userId: 'me',
      timestamp: '2:23 PM',
      content: "If we use a service like Auth0 or Okta, it's about 1 week. Custom SAML is 2-3 weeks. I'd recommend Auth0 for speed — we can migrate later if needed.",
      reactions: [{ emoji: '⚡', count: 1 }]
    },
    {
      id: 5,
      userId: 'sarah',
      timestamp: '2:25 PM',
      content: "Perfect. I'll update the roadmap. Also, the AI Copilot demo went really well — they loved the dispute detection flow. Can we accelerate that?",
    },
    {
      id: 6,
      userId: 'me',
      timestamp: '2:28 PM',
      content: "Yes, but we need to finish PII redaction first. I'll have Alex prioritize it. We can't ship AI features without proper data privacy controls.",
      reactions: [{ emoji: '🛡️', count: 1 }]
    },
    {
      id: 7,
      userId: 'sarah',
      timestamp: '2:30 PM',
      content: "Understood. Compliance first. I'll manage expectations with sales — we'll have a solid demo ready in 3 weeks.",
    },
    {
      id: 8,
      userId: 'me',
      timestamp: '2:32 PM',
      content: "Perfect. And let's make sure the demo uses realistic but synthetic data. No real customer data in demos — ever.",
      reactions: [{ emoji: '✅', count: 1 }, { emoji: '🔒', count: 1 }]
    },
  ],
};

// Mock Data Content
export const CHANNELS = [
  {
    id: 'product',
    name: 'product',
    topic: 'Shipping AI features safely, fast, and aligned with business impact',
    messages: [
      {
        id: 1,
        userId: 'pm',
        timestamp: '09:10 AM',
        content:
          "Junior, can we launch the AI Collections Copilot this month? Sales says it will help close two mid-market deals."
      },
      {
        id: 2,
        userId: 'me',
        timestamp: '09:12 AM',
        content:
          "Feasible, but only if we cut scope. Right now the model ingests raw invoice data — we can't ship without completing the PII redaction layer. That's a GDPR blocker."
      },
      {
        id: 3,
        userId: 'pm',
        timestamp: '09:15 AM',
        content:
          "What's the safest way to still create momentum for the board?"
      },
      {
        id: 4,
        userId: 'me',
        timestamp: '09:18 AM',
        content:
          "We build a full demo using synthetic datasets. Same features, same flows, no compliance risk. It creates strong perceived progress and buys us 2 sprints to finish redaction + retrieval accuracy.",
        reactions: [{ emoji: '💡', count: 3 }, { emoji: '✅', count: 2 }]
      },
      {
        id: 5,
        userId: 'pm',
        timestamp: '09:20 AM',
        content:
          "Perfect. Can you align engineering and define the final scope?",
        reactions: [{ emoji: '👍', count: 1 }]
      },
      {
        id: 6,
        userId: 'me',
        timestamp: '09:22 AM',
        content:
          "I'll drive it. Sending the trimmed MVP spec today: 3 flows only — dispute detection, payment forecast, and suggested dunning actions.",
        reactions: [{ emoji: '🚀', count: 2 }]
      }
    ]
  },

  {
    id: 'technical',
    name: 'technical',
    topic: 'AI-first system design, scalability, observability, reliability',
    messages: [
      {
        id: 1,
        userId: 'alex',
        timestamp: '10:30 AM',
        content:
          "Import pipeline is spiking again. PDF parsing + LLM enrichment saturates CPUs at 9AM for every enterprise client."
      },
      {
        id: 2,
        userId: 'me',
        timestamp: '10:33 AM',
        content:
          "We fix it in two steps: 1) isolate OCR + embeddings to a dedicated autoscaled worker pool with HPA rules on queue length; 2) introduce a layout-fingerprint cache so we reuse embeddings for identical invoice formats.",
        reactions: [{ emoji: '🔥', count: 4 }, { emoji: '👀', count: 2 }]
      },
      {
        id: 3,
        userId: 'david',
        timestamp: '10:36 AM',
        content:
          "Should we split queues by job type and add circuit breakers for LLM calls?",
        reactions: [{ emoji: '💭', count: 1 }]
      },
      {
        id: 4,
        userId: 'me',
        timestamp: '10:39 AM',
        content:
          "Yes. And move the LLM interaction behind a thin internal API. Strict timeouts + circuit breaking so the AI layer can't take the monolith down. Add metrics on token usage and latency — we need cost visibility.",
        reactions: [{ emoji: '✅', count: 3 }, { emoji: '🛡️', count: 2 }]
      },
      {
        id: 5,
        userId: 'alex',
        timestamp: '10:42 AM',
        content:
          "Understood. I'll add dashboards for cache hit-rate and run cost benchmarks between models.",
        reactions: [{ emoji: '👍', count: 2 }]
      }
    ]
  },

  {
    id: 'business',
    name: 'gtm',
    topic: 'Strategy, positioning, value creation for finance teams',
    messages: [
      {
        id: 1,
        userId: 'ceo',
        timestamp: 'Yesterday',
        content:
          "Investors want us to explain how Delfyn reduces DSO in measurable terms. How should we frame it?"
      },
      {
        id: 2,
        userId: 'me',
        timestamp: 'Yesterday',
        content:
          "We frame it around 3 levers: 1) predictive dunning that contacts late payers before they go silent, 2) dynamic discounting that accelerates cash-in for buyers under liquidity pressure, 3) automated reconciliation reducing finance-team workload. Together, they drive a measurable 12–18% DSO improvement.",
        reactions: [{ emoji: '📊', count: 3 }, { emoji: '💡', count: 2 }]
      },
      {
        id: 3,
        userId: 'ceo',
        timestamp: 'Yesterday',
        content:
          "And for pricing? Should we lead with per-invoice or usage-based?",
        reactions: [{ emoji: '🤔', count: 1 }]
      },
      {
        id: 4,
        userId: 'me',
        timestamp: 'Yesterday',
        content:
          "For SMB/Mid-market: usage-based tied to processed revenue. For enterprise: fixed platform fee + variable AI usage. Predictable costs for finance leaders — no surprises.",
        reactions: [{ emoji: '✅', count: 2 }, { emoji: '💰', count: 1 }]
      },
      {
        id: 5,
        userId: 'ceo',
        timestamp: 'Yesterday',
        content:
          "Great. Can you prepare a 1-page for the investor deck?",
        reactions: [{ emoji: '👍', count: 1 }]
      },
      {
        id: 6,
        userId: 'me',
        timestamp: 'Yesterday',
        content:
          "Absolutely — I'll structure it as: workflow → bottleneck → intervention → measurable impact. Clear and data-backed.",
        reactions: [{ emoji: '📈', count: 2 }, { emoji: '🎯', count: 1 }]
      }
    ]
  },

  {
    id: 'mentorship',
    name: 'developer-coaching',
    topic: 'Growing engineers through system design, clarity, and autonomy',
    messages: [
      {
        id: 1,
        userId: 'dev',
        timestamp: '2:05 PM',
        content:
          "Hey Junior, I’m working on the new payment-matching module. I’m not sure if I should create a separate service for it or keep it inside the main app."
      },
      {
        id: 2,
        userId: 'me',
        timestamp: '2:08 PM',
        content:
          "Keep it in the monolith for now. Payment matching is still evolving and you'll iterate much faster here. Microservices make sense only when the domain and interfaces are stable.",
        reactions: [{ emoji: '💡', count: 2 }]
      },
      {
        id: 3,
        userId: 'dev',
        timestamp: '2:10 PM',
        content:
          "Got it. How should I structure the matching logic? It's getting messy with all the edge cases.",
        reactions: [{ emoji: '🤔', count: 1 }]
      },
      {
        id: 4,
        userId: 'me',
        timestamp: '2:13 PM',
        content:
          "Extract the decision-making into a pure Ruby object. Keep the Rails models thin. You want deterministic, testable matching rules. Start simple: exact match → amount tolerance → fuzzy payer reference.",
        reactions: [{ emoji: '✅', count: 3 }, { emoji: '🎯', count: 1 }]
      },
      {
        id: 5,
        userId: 'dev',
        timestamp: '2:15 PM',
        content:
          "That makes sense. Any advice for testing?",
        reactions: [{ emoji: '👍', count: 1 }]
      },
      {
        id: 6,
        userId: 'me',
        timestamp: '2:17 PM',
        content:
          "Yes: write tests as if someone else will maintain the module in 6 months. Cover the edge cases, but more importantly, document *why* each rule exists. It accelerates onboarding and prevents regressions.",
        reactions: [{ emoji: '📚', count: 2 }, { emoji: '🔥', count: 1 }]
      }
    ]
  }
];


const Slack: React.FC = () => {
  const [activeChannelId, setActiveChannelId] = useState('product');
  const [activeDMUserId, setActiveDMUserId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'channel' | 'dm'>('channel');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false); // Auto-close sidebar when switching to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const activeChannel = CHANNELS.find(c => c.id === activeChannelId) || CHANNELS[0];
  const activeDM = activeDMUserId ? DIRECT_MESSAGES[activeDMUserId] : null;
  const activeDMUser = activeDMUserId ? USERS[activeDMUserId] : null;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleChannelClick = (channelId: string) => {
    setActiveChannelId(channelId);
    setViewMode('channel');
    setActiveDMUserId(null);
    if (isMobile) setSidebarOpen(false); // Close sidebar on mobile after selection
  };
  
  const handleDMClick = (userId: string) => {
    setActiveDMUserId(userId);
    setViewMode('dm');
    setActiveChannelId('');
    if (isMobile) setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-full bg-[#1A1D21] text-[#D1D2D3] font-sans overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed left-0 top-0 bottom-0 z-50 transform transition-transform duration-300' : 'relative'}
        ${sidebarOpen ? 'translate-x-0' : isMobile ? '-translate-x-full' : ''}
        w-[260px] md:w-[260px] bg-[#3F0E40] flex flex-col flex-shrink-0 h-full
      `}>
        {/* Workspace Header */}
        <div className="window-drag-handle h-12 flex items-center justify-between px-4 font-bold text-white border-b border-white/10 hover:bg-[#350d36] transition-colors cursor-pointer">
          <span>Junior's Workspace <span className="ml-1 text-[10px] opacity-70">▼</span></span>
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-white/10 rounded"
            >
              <X size={18} />
            </button>
          )}
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
                onClick={() => handleChannelClick(channel.id)}
                className={`
                  px-4 py-2 md:py-1 flex items-center cursor-pointer mb-[2px] touch-manipulation
                  ${viewMode === 'channel' && activeChannelId === channel.id ? 'bg-[#1164A3] text-white' : 'text-[#D1D2D3]/80 hover:bg-[#350d36] active:bg-[#350d36]'}
                `}
              >
                <Hash size={14} className="mr-2 opacity-70 flex-shrink-0" />
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
              <div 
                key={user.id} 
                onClick={() => handleDMClick(user.id)}
                className={`
                  px-4 py-2 md:py-1 flex items-center gap-2 cursor-pointer mb-[2px] touch-manipulation
                  ${viewMode === 'dm' && activeDMUserId === user.id ? 'bg-[#1164A3] text-white' : 'text-[#D1D2D3]/80 hover:bg-[#350d36] active:bg-[#350d36]'}
                `}
              >
                <div className="relative flex-shrink-0">
                    <div className="w-5 h-5 md:w-4 md:h-4 rounded bg-white/10 flex items-center justify-center text-[9px] md:text-[8px]">{user.avatar}</div>
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
        <div className="window-drag-handle h-12 border-b border-white/10 flex items-center justify-between px-2 md:px-4 flex-shrink-0">
          <div className="font-bold flex items-center gap-2 text-white min-w-0 flex-1">
            {isMobile && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-white/10 rounded mr-1 flex-shrink-0"
              >
                <Menu size={20} />
              </button>
            )}
            {viewMode === 'channel' ? (
              <>
                <Hash size={16} className="text-white/50 flex-shrink-0" />
                <span className="truncate">{activeChannel.name}</span> 
                <span className="text-[10px] px-2 text-white/40 font-normal hidden lg:inline truncate max-w-[300px]">{activeChannel.topic}</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {activeDMUser?.avatar}
                </div>
                <span className="truncate">{activeDMUser?.name}</span>
                {activeDMUser?.status === 'online' && (
                  <span className="text-[10px] text-green-400 flex-shrink-0">●</span>
                )}
                {activeDMUser?.status === 'busy' && (
                  <span className="text-[10px] text-red-400 flex-shrink-0">●</span>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 text-white/60 flex-shrink-0">
             {viewMode === 'channel' && !isMobile && (
               <div className="flex -space-x-2">
                  {Object.values(USERS).slice(0, 3).map(u => (
                      <div key={u.id} className="w-6 h-6 rounded bg-white/10 border border-[#1A1D21] flex items-center justify-center text-[9px] text-white">{u.avatar}</div>
                  ))}
                  <div className="w-6 h-6 rounded bg-white/5 border border-[#1A1D21] flex items-center justify-center text-[9px] text-white">+2</div>
               </div>
             )}
             <button className="p-1.5 hover:bg-white/10 rounded touch-manipulation">
               <Info size={18} />
             </button>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 md:py-6 custom-scrollbar">
          {viewMode === 'channel' ? (
            <>
              {/* Welcome Message */}
              <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                    <Hash size={24} className="md:w-8 md:h-8" />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Welcome to #{activeChannel.name}!</h1>
                <p className="text-sm md:text-base text-white/60">
                  This is the start of the <span className="font-bold text-[#1164A3]">#{activeChannel.name}</span> channel. 
                  {activeChannel.topic}.
                </p>
              </div>

              {activeChannel.messages.map((msg, idx) => {
                const user = USERS[msg.userId] || { id: msg.userId, name: 'Unknown User', avatar: '??', status: 'offline' as const };
                const isMe = msg.userId === 'me';
                const showHeader = idx === 0 || activeChannel.messages[idx - 1].userId !== msg.userId;

                return (
                  <div key={msg.id} className={`group flex gap-2 md:gap-3 ${showHeader ? 'mt-4' : 'mt-1'} py-1 hover:bg-[#222529] -mx-2 md:-mx-4 px-2 md:px-4 transition-colors`}>
                    {showHeader ? (
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-white">
                        {user.avatar}
                      </div>
                    ) : (
                      <div className="w-8 md:w-9 flex-shrink-0 text-[9px] md:text-[10px] text-white/20 text-right opacity-0 group-hover:opacity-100 select-none pt-1">
                        {msg.timestamp.split(' ')[0]}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {showHeader && (
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm md:text-base">{user.name}</span>
                          <span className="text-[10px] md:text-xs text-white/40">{msg.timestamp}</span>
                        </div>
                      )}
                      <p className="text-[#D1D2D3] leading-relaxed whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>
                      
                      {/* Reactions */}
                      {msg.reactions && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                            {msg.reactions.map((r, i) => (
                                <div key={i} className="bg-[#222529] border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] md:text-xs flex items-center gap-1 cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all touch-manipulation">
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
            </>
          ) : (
            <>
              {/* DM Welcome */}
              {activeDMUser && (
                <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/10">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 md:mb-4">
                    <span className="text-xl md:text-2xl font-bold text-white">{activeDMUser.avatar}</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-white mb-2">{activeDMUser.name}</h1>
                  <p className="text-sm md:text-base text-white/60">
                    {activeDMUser.status === 'online' && 'Active now'}
                    {activeDMUser.status === 'busy' && 'Busy'}
                    {activeDMUser.status === 'offline' && 'Away'}
                  </p>
                </div>
              )}

              {activeDM?.map((msg, idx) => {
                const user = USERS[msg.userId] || { id: msg.userId, name: 'Unknown User', avatar: '??', status: 'offline' as const };
                const isMe = msg.userId === 'me';
                const showHeader = idx === 0 || activeDM[idx - 1].userId !== msg.userId;

                return (
                  <div key={msg.id} className={`group flex gap-2 md:gap-3 ${showHeader ? 'mt-4' : 'mt-1'} py-1 hover:bg-[#222529] -mx-2 md:-mx-4 px-2 md:px-4 transition-colors`}>
                    {showHeader ? (
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-[10px] md:text-xs font-bold text-white">
                        {user.avatar}
                      </div>
                    ) : (
                      <div className="w-8 md:w-9 flex-shrink-0 text-[9px] md:text-[10px] text-white/20 text-right opacity-0 group-hover:opacity-100 select-none pt-1">
                        {msg.timestamp.split(' ')[0]}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {showHeader && (
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm md:text-base">{user.name}</span>
                          <span className="text-[10px] md:text-xs text-white/40">{msg.timestamp}</span>
                        </div>
                      )}
                      <p className="text-[#D1D2D3] leading-relaxed whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>
                      
                      {/* Reactions */}
                      {msg.reactions && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                            {msg.reactions.map((r, i) => (
                                <div key={i} className="bg-[#222529] border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] md:text-xs flex items-center gap-1 cursor-pointer hover:bg-white/5 hover:border-white/30 transition-all touch-manipulation">
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
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-2 md:px-4 pb-3 md:pb-4 pt-2">
          <div className="border border-white/20 rounded-lg bg-[#222529] overflow-hidden focus-within:border-white/40 transition-colors">
            {/* Toolbar - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-[#222529] border-b border-white/5">
                <button className="p-1 hover:bg-white/5 rounded text-white/60 touch-manipulation"><span className="font-bold">B</span></button>
                <button className="p-1 hover:bg-white/5 rounded text-white/60 touch-manipulation"><span className="italic">I</span></button>
                <button className="p-1 hover:bg-white/5 rounded text-white/60 touch-manipulation"><span className="line-through">S</span></button>
            </div>
            
            <div className="p-2 md:p-2 min-h-[36px] md:min-h-[40px] text-white/40 text-xs md:text-sm flex items-center">
                {viewMode === 'channel' ? `Message #${activeChannel.name}` : `Message ${activeDMUser?.name || ''}`}
            </div>
            
            <div className="flex justify-between items-center p-1.5 md:p-1 bg-[#222529]">
                <div className="flex gap-1 md:gap-2">
                    <button className="p-1.5 md:p-1.5 hover:bg-white/5 active:bg-white/10 rounded-full text-white/60 touch-manipulation"><Paperclip size={14} className="md:w-4 md:h-4"/></button>
                    <button className="p-1.5 md:p-1.5 hover:bg-white/5 active:bg-white/10 rounded-full text-white/60 touch-manipulation"><Smile size={14} className="md:w-4 md:h-4"/></button>
                </div>
                <button className="p-2 bg-transparent text-white/20 rounded cursor-not-allowed touch-manipulation">
                    <Send size={14} className="md:w-4 md:h-4" />
                </button>
            </div>
          </div>
          <div className="text-center mt-1.5 md:mt-2 text-[9px] md:text-[10px] text-white/30">
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