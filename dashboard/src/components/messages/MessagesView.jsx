import { useState } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  Hash,
  User,
  CheckCheck,
  Paperclip,
  Smile,
  Bot,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const INITIAL_THREADS = [
  {
    id: 'chan_general',
    type: 'channel',
    name: 'general-agency',
    description: 'Company-wide updates, announcements & agency discussion',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'Mahmud Hasan (CEO)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
        text: 'Team, we just passed $20k MRR this week. Excellent job on shipping the Dental Clinic voice bot!',
        time: '10:14 AM',
        isMe: false,
      },
      {
        id: 2,
        sender: 'Salung Prastyo (Sales)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        text: 'Thanks Mahmud! Apex Dental signed the $850/mo recurring maintenance retainer this morning.',
        time: '10:20 AM',
        isMe: false,
      },
      {
        id: 3,
        sender: 'Alex Rivera (AI Ops)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        text: 'Twilio telephony latency is down to 480ms. The ElevenLabs voice model feels completely human.',
        time: '10:25 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'chan_leads',
    type: 'channel',
    name: 'leads-and-sales',
    description: 'Live inbound lead alerts and closed deal notifications',
    unread: 2,
    messages: [
      {
        id: 1,
        sender: 'Aeitron Radar Bot',
        avatar: '/aeitron_icon_fb.png',
        text: '🔥 High-Value Lead Alert: Nexus Real Estate requested a demo for 5 agent seats.',
        time: '09:30 AM',
        isMe: false,
      },
      {
        id: 2,
        sender: 'Salung Prastyo (Sales)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        text: 'Engaged with Ryan from Nexus. Discovery call booked for tomorrow 2 PM.',
        time: '09:42 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'chan_deployments',
    type: 'channel',
    name: 'ai-deployments',
    description: 'Live webhook feeds, production cutovers and QA reports',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'Alex Rivera (AI Ops)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        text: 'Live cutover for Skyline E-Commerce returns bot scheduled for Friday 5 PM EST.',
        time: 'Yesterday',
        isMe: false,
      },
    ],
  },
  {
    id: 'dm_apex',
    type: 'client',
    name: 'Dr. Michael (Apex Dental)',
    subtitle: 'Apex Dental Group • Active Client',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&h=120&fit=crop&crop=faces',
    unread: 1,
    messages: [
      {
        id: 1,
        sender: 'Dr. Michael',
        avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&h=120&fit=crop&crop=faces',
        text: 'Hi Salung, the voice receptionist handled 18 calls yesterday without any human intervention! Patients loved it.',
        time: '11:05 AM',
        isMe: false,
      },
      {
        id: 2,
        sender: 'Salung Prastyo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        text: 'That is fantastic to hear Dr. Michael! We will monitor the call recordings today to fine-tune the pricing objection handling.',
        time: '11:15 AM',
        isMe: true,
      },
    ],
  },
  {
    id: 'dm_sophia',
    type: 'client',
    name: 'Sophia Chen (Skyline)',
    subtitle: 'Skyline E-Commerce • In Development',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'Sophia Chen',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces',
        text: 'Invoice #04910 has been processed via bank wire. Can we review the Shopify webhook integration tomorrow?',
        time: 'Yesterday',
        isMe: false,
      },
    ],
  },
];

export default function MessagesView() {
  const { currentUser } = useAuth();
  const [threads, setThreads] = useState(() => {
    try {
      const stored = localStorage.getItem('aeitron_chat_threads');
      return stored ? JSON.parse(stored) : INITIAL_THREADS;
    } catch {
      return INITIAL_THREADS;
    }
  });

  const [activeThreadId, setActiveThreadId] = useState('chan_general');
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: currentUser?.name || 'Operator',
      avatar: currentUser?.avatar || '/aeitron_icon_fb.png',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    const updated = threads.map((t) =>
      t.id === activeThreadId
        ? { ...t, messages: [...t.messages, newMsg], unread: 0 }
        : t
    );

    setThreads(updated);
    try {
      localStorage.setItem('aeitron_chat_threads', JSON.stringify(updated));
    } catch {}
    setInputText('');
  };

  const filteredThreads = threads.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
          <MessageSquare className="text-accent" size={24} />
          Unified Agency Communications & Client Messages
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Real-time internal team collaboration channels and direct client communication.
        </p>
      </div>

      {/* Main Chat Layout */}
      <div className="bg-bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden h-[620px] flex">
        {/* Left Sidebar: Threads List */}
        <div className="w-72 border-r border-border/80 flex flex-col bg-bg/40">
          {/* Search */}
          <div className="p-3 border-b border-border/80">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-bg-card border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* Team Channels */}
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Agency Channels
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredThreads
                  .filter((t) => t.type === 'channel')
                  .map((t) => {
                    const isActive = t.id === activeThreadId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveThreadId(t.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-slate-900 text-white dark:bg-accent font-semibold'
                            : 'text-text-muted hover:text-text hover:bg-bg'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Hash size={14} className={isActive ? 'text-white' : 'text-text-muted'} />
                          <span className="truncate">{t.name}</span>
                        </div>
                        {t.unread > 0 && (
                          <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold">
                            {t.unread}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Direct Client Chats */}
            <div>
              <div className="px-2 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Client Direct Messages
              </div>
              <div className="space-y-1 mt-1">
                {filteredThreads
                  .filter((t) => t.type === 'client')
                  .map((t) => {
                    const isActive = t.id === activeThreadId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveThreadId(t.id)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs transition-colors ${
                          isActive
                            ? 'bg-slate-900 text-white dark:bg-accent'
                            : 'text-text hover:bg-bg'
                        }`}
                      >
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-7 h-7 rounded-lg object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0 flex-1 text-left">
                          <div className={`font-semibold truncate ${isActive ? 'text-white' : 'text-text'}`}>
                            {t.name}
                          </div>
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-white/70' : 'text-text-muted'
                            }`}
                          >
                            {t.subtitle}
                          </div>
                        </div>
                        {t.unread > 0 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Chat Canvas */}
        <div className="flex-1 flex flex-col justify-between bg-bg-card">
          {/* Active Header */}
          <div className="p-3.5 px-5 border-b border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeThread.type === 'channel' ? (
                <div className="w-8 h-8 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                  <Hash size={16} />
                </div>
              ) : (
                <img
                  src={activeThread.avatar}
                  alt={activeThread.name}
                  className="w-8 h-8 rounded-lg object-cover border border-border"
                />
              )}
              <div>
                <h3 className="text-xs font-bold text-text flex items-center gap-1.5">
                  {activeThread.name}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                </h3>
                <p className="text-[11px] text-text-muted">
                  {activeThread.description || activeThread.subtitle}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-text-muted bg-bg px-2.5 py-1 rounded-lg border border-border/60">
              Session Active
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-xl ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-7 h-7 rounded-lg object-cover border border-border shrink-0 mt-0.5"
                />
                <div>
                  <div className={`flex items-center gap-2 mb-1 ${msg.isMe ? 'justify-end' : ''}`}>
                    <span className="text-[11px] font-bold text-text">{msg.sender}</span>
                    <span className="text-[10px] text-text-muted">{msg.time}</span>
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.isMe
                        ? 'bg-accent text-white rounded-tr-xs shadow-xs'
                        : 'bg-bg text-text border border-border/80 rounded-tl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 px-5 border-t border-border/80 bg-bg/20">
            <div className="flex items-center gap-2 bg-bg border border-border rounded-2xl px-3 py-1.5 focus-within:border-accent">
              <input
                type="text"
                placeholder={`Message #${activeThread.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent text-xs text-text outline-none placeholder:text-text-muted/50 py-1"
              />
              <button
                type="submit"
                className="p-1.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors shadow-xs"
              >
                <Send size={13} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
