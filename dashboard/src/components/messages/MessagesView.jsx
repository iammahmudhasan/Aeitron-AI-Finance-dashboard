import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  Hash,
  Sparkles,
  CheckCheck,
  Check,
  Zap,
  Users,
  Bell,
  MessageSquare,
  ShieldCheck,
  Plus,
  X,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications, playNotificationSound } from '../../context/NotificationContext';
import { NOTIFICATION_TYPES } from '../../utils/constants';

const STORAGE_KEY = 'aeitron_team_hub_channel_v4';

// 100% Pure Internal Agency Channels (NO CLIENTS)
const INITIAL_CHANNELS = [
  {
    id: 'chan_general',
    type: 'channel',
    name: 'general-agency',
    displayName: '# general-agency',
    description: 'Company-wide updates, announcements & agency discussion',
    topic: 'Daily agency operations & company growth',
    unread: 0,
    messages: [
      {
        id: 101,
        sender: 'Mahmud Hasan (CEO)',
        senderId: 'usr_ceo',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
        time: '10:14 AM',
        text: 'Team, we just passed $20k MRR this week. Excellent job on shipping the Dental Clinic voice bot!',
        reactions: ['🔥 3', '🚀 2'],
      },
      {
        id: 102,
        sender: 'Salung Prastyo (Sales)',
        senderId: 'usr_sales',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        time: '10:20 AM',
        text: 'Thanks Mahmud! Apex Dental signed the $850/mo recurring maintenance retainer this morning.',
        reactions: ['👍 2'],
      },
      {
        id: 103,
        sender: 'Alex Rivera (AI Ops)',
        senderId: 'usr_ops',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        time: '10:25 AM',
        text: 'Twilio telephony latency is down to 480ms. The ElevenLabs voice model feels completely human.',
        reactions: ['💯 4'],
      },
      {
        id: 104,
        sender: 'Sarah Jenkins (Finance)',
        senderId: 'usr_finance',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
        time: '10:30 AM',
        text: 'All contractor payouts and commission bonuses have been calculated in the treasury ledger.',
        reactions: ['💰 2'],
      },
    ],
  },
  {
    id: 'chan_sales',
    type: 'channel',
    name: 'leads-and-sales',
    displayName: '# leads-and-sales',
    description: 'High-ticket retainer leads, enterprise pitches & deals pipeline',
    topic: 'Targeting $50k MRR sprint',
    unread: 2,
    messages: [
      {
        id: 201,
        sender: 'Salung Prastyo (Sales)',
        senderId: 'usr_sales',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        time: '11:00 AM',
        text: 'Nexus Real Estate requested 5 voice agent seats. Sending proposal for $1,200/mo retainer.',
        reactions: ['💼 1'],
      },
    ],
  },
  {
    id: 'chan_deploy',
    type: 'channel',
    name: 'ai-deployments',
    description: 'Autonomous voice agents, webhooks & n8n production pipelines',
    topic: 'Twilio SIP & OpenAI Realtime Voice',
    unread: 0,
    messages: [
      {
        id: 301,
        sender: 'Alex Rivera (AI Ops)',
        senderId: 'usr_ops',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        time: '09:15 AM',
        text: 'All 28 n8n automated workflows and Twilio voice SIP lines are running with 99.98% uptime.',
        reactions: ['🤖 3'],
      },
    ],
  },
  {
    id: 'chan_finance',
    type: 'channel',
    name: 'finance-and-payouts',
    description: 'Internal payroll, contractor payouts & agency cashflow',
    topic: 'Weekly cashflow & revenue allocations',
    unread: 0,
    messages: [
      {
        id: 401,
        sender: 'Sarah Jenkins (Finance)',
        senderId: 'usr_finance',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
        time: '09:45 AM',
        text: 'Monthly contractor disbursements and API credit allocations have been synchronized.',
        reactions: ['✅ 2'],
      },
    ],
  },
];

// 100% Pure Internal Team Direct Messages (NO CLIENTS)
const INITIAL_TEAM_MEMBERS = [
  {
    id: 'dm_salung',
    type: 'team',
    name: 'Salung Prastyo',
    role: 'Sales Operator',
    email: 'salung@aeitron.ai',
    subtitle: 'Sales & Inbound Closings',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    online: true,
    lastSeen: 'Active now',
    unread: 1,
    messages: [
      {
        id: 501,
        sender: 'Salung Prastyo',
        senderId: 'usr_sales',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        time: '10:05 AM',
        text: 'Mahmud, should we offer Apex Dental the annual prepayment discount on their bot maintenance?',
      },
    ],
  },
  {
    id: 'dm_alex',
    type: 'team',
    name: 'Alex Rivera',
    role: 'AI Operations Lead',
    email: 'alex@aeitron.ai',
    subtitle: 'Autonomous Telephony & n8n',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    online: true,
    lastSeen: 'Active now',
    unread: 0,
    messages: [
      {
        id: 601,
        sender: 'Alex Rivera',
        senderId: 'usr_ops',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        time: '09:40 AM',
        text: 'The OpenAI latency spike from earlier has subsided. System health is 100%.',
      },
    ],
  },
  {
    id: 'dm_sarah',
    type: 'team',
    name: 'Sarah Jenkins',
    role: 'Finance Manager',
    email: 'sarah@aeitron.ai',
    subtitle: 'Treasury & Client Invoices',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
    online: true,
    lastSeen: 'Active now',
    unread: 0,
    messages: [
      {
        id: 701,
        sender: 'Sarah Jenkins',
        senderId: 'usr_finance',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
        time: '09:45 AM',
        text: 'Payment received for Invoice #04910 ($41,400). Payout calculations have been synchronized.',
      },
    ],
  },
];

// Quick auto-responses for dynamic team interactions
const TEAM_RESPONSES = [
  'Understood! Working on this right now.',
  'Great update! Verified and moving to next step.',
  'Confirmed. Latency and pipeline logs look optimal.',
  'Approved on my end. Proceeding immediately.',
  'Thanks for the heads-up! Pushing the update now.',
];

export default function MessagesView() {
  const { currentUser, users } = useAuth();
  const { addNotification } = useNotifications();

  // Load threads from localStorage or default
  const [threads, setThreads] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure no old client data exists
        const cleaned = parsed.filter((t) => t.type === 'channel' || t.type === 'team');
        if (cleaned.length > 0) return cleaned;
      }
    } catch {}
    return [...INITIAL_CHANNELS, ...INITIAL_TEAM_MEMBERS];
  });

  const [activeThreadId, setActiveThreadId] = useState('chan_general');
  const [search, setSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const broadcastRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThreadId, threads]);

  // Sync state across browser tabs in MILLISECONDS via BroadcastChannel
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('aeitron_team_chat_channel');
      broadcastRef.current = bc;
      bc.onmessage = (e) => {
        if (e.data?.type === 'SYNC_THREADS') {
          setThreads(e.data.threads);
        } else if (e.data?.type === 'USER_TYPING') {
          if (e.data.threadId === activeThreadId) {
            setTypingUser(e.data.userName);
            setTimeout(() => setTypingUser(null), 3000);
          }
        }
      };
    } catch {}

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setThreads(parsed);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      bc?.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [activeThreadId]);

  // Persist threads and broadcast instantly
  const saveAndBroadcast = (newThreads) => {
    setThreads(newThreads);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newThreads));
      broadcastRef.current?.postMessage({
        type: 'SYNC_THREADS',
        threads: newThreads,
      });
    } catch {}
  };

  // Clear unread on mount since user is viewing the messenger
  useEffect(() => {
    setThreads((prev) => {
      const hasUnread = prev.some((t) => (t.unread || 0) > 0);
      if (!hasUnread) return prev;
      const cleared = prev.map((t) => ({ ...t, unread: 0 }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleared));
        broadcastRef.current?.postMessage({
          type: 'SYNC_THREADS',
          threads: cleared,
        });
      } catch {}
      return cleared;
    });
  }, []);

  const handleSelectThread = (threadId) => {
    setActiveThreadId(threadId);
    setThreads((prev) => {
      const target = prev.find((t) => t.id === threadId);
      if (!target || target.unread === 0) return prev;
      const updated = prev.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        broadcastRef.current?.postMessage({
          type: 'SYNC_THREADS',
          threads: updated,
        });
      } catch {}
      return updated;
    });
  };

  const activeThread = useMemo(() => {
    return threads.find((t) => t.id === activeThreadId) || threads[0];
  }, [threads, activeThreadId]);

  // Send Message: Instant Millisecond Delivery + Dashboard Notification
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText('');
    setShowEmojiPicker(false);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const currentSenderName = currentUser?.name || 'Mahmud Hasan';
    const currentSenderRole = currentUser?.role ? `(${currentUser.role})` : '(CEO)';
    const senderDisplay = `${currentSenderName} ${currentSenderRole}`;

    const newMessage = {
      id: Date.now(),
      sender: senderDisplay,
      senderId: currentUser?.email || 'usr_ceo',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
      time: formattedTime,
      text: messageText,
      isMe: true,
      reactions: [],
    };

    // 1. Instantly append to state & broadcast (takes < 2ms)
    const updatedThreads = threads.map((t) => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          unread: 0,
          messages: [...t.messages, newMessage],
        };
      }
      return t;
    });

    saveAndBroadcast(updatedThreads);

    // 2. Play subtle instant audio chime
    playNotificationSound();

    // 3. Trigger Global Dashboard Notification (Top bell badge + floating alert)
    const channelLabel = activeThread.type === 'channel' ? `#${activeThread.name}` : activeThread.name;
    addNotification({
      title: `Team Message from ${currentSenderName}`,
      message: `${currentSenderName} in ${channelLabel}: "${messageText.length > 55 ? messageText.slice(0, 52) + '...' : messageText}"`,
      type: NOTIFICATION_TYPES.TEAM_MESSAGE || 'team_message',
      senderName: currentSenderName,
      channelName: channelLabel,
      avatar: newMessage.avatar,
      link: 'messages',
    });

    // 4. Simulate realistic team peer response after 2 seconds
    if (activeThread.type === 'team' || Math.random() > 0.3) {
      setTimeout(() => {
        setTypingUser(activeThread.type === 'team' ? activeThread.name : 'Alex Rivera (AI Ops)');
      }, 700);

      setTimeout(() => {
        setTypingUser(null);
        const replier = activeThread.type === 'team'
          ? {
              name: activeThread.name,
              avatar: activeThread.avatar,
              senderId: activeThread.id,
            }
          : {
              name: 'Alex Rivera (AI Ops)',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
              senderId: 'usr_ops',
            };

        const randomReply = TEAM_RESPONSES[Math.floor(Math.random() * TEAM_RESPONSES.length)];
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const incomingMsg = {
          id: Date.now() + 1,
          sender: replier.name,
          senderId: replier.senderId,
          avatar: replier.avatar,
          time: replyTime,
          text: randomReply,
          isMe: false,
          reactions: ['👍 1'],
        };

        setThreads((prev) => {
          const next = prev.map((t) => {
            if (t.id === activeThreadId) {
              return {
                ...t,
                messages: [...t.messages, incomingMsg],
              };
            }
            return t;
          });
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            broadcastRef.current?.postMessage({
              type: 'SYNC_THREADS',
              threads: next,
            });
          } catch {}
          return next;
        });

        // Trigger notification for incoming team reply
        addNotification({
          title: `New Reply from ${replier.name}`,
          message: `${replier.name}: "${randomReply}" in ${channelLabel}`,
          type: NOTIFICATION_TYPES.TEAM_MESSAGE || 'team_message',
          senderName: replier.name,
          channelName: channelLabel,
          avatar: replier.avatar,
          link: 'messages',
        });
      }, 2400);
    }
  };

  // Add emoji reaction
  const handleAddReaction = (msgId, emoji) => {
    const updated = threads.map((t) => {
      if (t.id !== activeThreadId) return t;
      const msgs = t.messages.map((m) => {
        if (m.id !== msgId) return m;
        const currentReactions = m.reactions || [];
        const existing = currentReactions.find((r) => r.startsWith(emoji));
        let nextReactions;
        if (existing) {
          const count = Number(existing.split(' ')[1] || 1) + 1;
          nextReactions = currentReactions.map((r) => (r.startsWith(emoji) ? `${emoji} ${count}` : r));
        } else {
          nextReactions = [...currentReactions, `${emoji} 1`];
        }
        return { ...m, reactions: nextReactions };
      });
      return { ...t, messages: msgs };
    });
    saveAndBroadcast(updated);
  };

  // Start direct chat with registered team member
  const handleStartDirectChat = (user) => {
    const dmId = `dm_${user.email.replace(/[@.]/g, '_')}`;
    const existing = threads.find((t) => t.id === dmId);
    if (existing) {
      setActiveThreadId(existing.id);
    } else {
      const newDm = {
        id: dmId,
        type: 'team',
        name: user.name,
        role: user.role,
        email: user.email,
        subtitle: user.role,
        avatar: user.avatar,
        online: true,
        lastSeen: 'Active now',
        unread: 0,
        messages: [
          {
            id: Date.now(),
            sender: user.name,
            avatar: user.avatar,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Hi ${currentUser?.name?.split(' ')[0] || 'there'}! Direct team line open.`,
            isMe: false,
          },
        ],
      };
      const updated = [...threads, newDm];
      saveAndBroadcast(updated);
      setActiveThreadId(dmId);
    }
    setNewChatModalOpen(false);
  };

  // Filter channels and team members
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      return (
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase())) ||
        (t.subtitle && t.subtitle.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [threads, search]);

  const channelList = filteredThreads.filter((t) => t.type === 'channel');
  const teamMemberList = filteredThreads.filter((t) => t.type === 'team');

  return (
    <div className="space-y-4">
      {/* Top Header - Restored Professional Agency Format */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <MessageSquare className="text-accent" size={24} />
            Unified Agency Communications & Team Hub
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time internal team collaboration channels and direct peer communication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold">
            <Radio size={12} className="animate-pulse" />
            <span>Instant Real-Time Sync</span>
          </div>

          <button
            type="button"
            onClick={() => setNewChatModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>New Team DM</span>
          </button>
        </div>
      </div>

      {/* Main Agency Chat Window (Clean Channel UI from Original Screenshot) */}
      <div className="bg-bg-card border border-border/80 rounded-2xl shadow-sm overflow-hidden flex h-[640px]">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: AGENCY CHANNELS & TEAM DIRECT MESSAGES                       */}
        {/* ========================================================================= */}
        <div className="w-80 border-r border-border/80 flex flex-col bg-bg/30 shrink-0">
          {/* Search Box */}
          <div className="p-3 border-b border-border/80">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-bg-card border border-border rounded-xl text-xs text-text placeholder:text-text-muted/60 outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Conversation List Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
            {/* 1. AGENCY CHANNELS */}
            <div>
              <div className="px-2.5 py-1 text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center justify-between">
                <span>Agency Channels</span>
                <span className="text-[10px] font-semibold text-text-muted/60">
                  {channelList.length}
                </span>
              </div>
              <div className="space-y-1 mt-1">
                {channelList.map((ch) => {
                  const isActive = ch.id === activeThreadId;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleSelectThread(ch.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-accent text-white font-semibold shadow-xs'
                          : 'text-text-muted hover:text-text hover:bg-bg-hover'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash size={15} className={isActive ? 'text-white' : 'text-text-muted'} />
                        <span className="truncate">{ch.name}</span>
                      </div>
                      {ch.unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-accent text-white text-[10px] flex items-center justify-center font-bold">
                          {ch.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. TEAM DIRECT MESSAGES (100% Internal, NO Clients) */}
            <div>
              <div className="px-2.5 py-1 text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center justify-between">
                <span>Team Direct Messages</span>
                <span className="text-[10px] font-semibold text-emerald-500">
                  {teamMemberList.length} Online
                </span>
              </div>
              <div className="space-y-1 mt-1">
                {teamMemberList.map((tm) => {
                  const isActive = tm.id === activeThreadId;
                  return (
                    <button
                      key={tm.id}
                      type="button"
                      onClick={() => handleSelectThread(tm.id)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all ${
                        isActive
                          ? 'bg-accent text-white shadow-xs'
                          : 'text-text hover:bg-bg-hover'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={tm.avatar}
                          alt={tm.name}
                          className="w-8 h-8 rounded-lg object-cover border border-border shrink-0"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-bg-card" />
                      </div>

                      <div className="min-w-0 flex-1 text-left">
                        <div className={`font-semibold truncate text-xs ${isActive ? 'text-white' : 'text-text'}`}>
                          {tm.name}
                        </div>
                        <div
                          className={`text-[10px] truncate ${
                            isActive ? 'text-white/80' : 'text-text-muted'
                          }`}
                        >
                          {tm.role || tm.subtitle}
                        </div>
                      </div>

                      {tm.unread > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                          {tm.unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT CHAT CANVAS: CLEAN AGENCY MESSAGE CARDS                            */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col justify-between bg-bg-card min-w-0">
          {/* Active Thread Header */}
          <div className="p-3.5 px-5 border-b border-border/80 flex items-center justify-between bg-bg/20">
            <div className="flex items-center gap-3">
              {activeThread.type === 'channel' ? (
                <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                  <Hash size={18} />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={activeThread.avatar}
                    alt={activeThread.name}
                    className="w-9 h-9 rounded-xl object-cover border border-border"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-bg-card" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-text flex items-center gap-2">
                  <span>{activeThread.type === 'channel' ? activeThread.name : activeThread.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                </h3>
                <p className="text-[11px] text-text-muted">
                  {activeThread.description || `${activeThread.role || activeThread.subtitle} • Online`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Session Active
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeThread.messages.map((msg) => {
              const isCurrentUser = msg.isMe || msg.sender.includes(currentUser?.name || 'Mahmud Hasan');

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-2xl ${isCurrentUser ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.sender}
                    className="w-8 h-8 rounded-xl object-cover border border-border shrink-0 mt-0.5 shadow-xs"
                  />
                  <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-text">{msg.sender}</span>
                      <span className="text-[10px] text-text-muted">{msg.time}</span>
                    </div>

                    {/* Card Bubble - Fits content dynamically */}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs w-fit max-w-lg break-words text-left ${
                        isCurrentUser
                          ? 'bg-accent text-white rounded-tr-xs font-normal'
                          : 'bg-bg text-text border border-border/80 rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Reactions Bar */}
                    <div className={`flex items-center gap-1 mt-1.5 ${isCurrentUser ? 'justify-end' : ''}`}>
                      {msg.reactions?.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleAddReaction(msg.id, r.split(' ')[0])}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-bg border border-border hover:border-accent text-text transition-colors"
                        >
                          {r}
                        </button>
                      ))}

                      {/* Add quick reaction button */}
                      <div className="inline-flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                        {['👍', '🔥', '🚀'].map((em) => (
                          <button
                            key={em}
                            onClick={() => handleAddReaction(msg.id, em)}
                            className="text-xs p-0.5 hover:scale-125 transition-transform"
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUser && (
              <div className="flex items-center gap-2 text-xs text-text-muted italic animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                <span>{typingUser} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box with Millisecond Send */}
          <form onSubmit={handleSendMessage} className="p-3 px-5 border-t border-border/80 bg-bg/30">
            {showEmojiPicker && (
              <div className="mb-2 p-2 bg-bg-card border border-border rounded-xl shadow-lg flex items-center gap-2">
                {['😀', '🚀', '🔥', '👍', '💯', '🤖', '💰', '🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-base p-1 hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 bg-bg border border-border rounded-2xl px-3.5 py-2 focus-within:border-accent transition-colors shadow-xs">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-text-muted hover:text-text transition-colors p-1"
                title="Add Emoji"
              >
                <Smile size={16} />
              </button>

              <button
                type="button"
                onClick={() => alert('Attachments: Invoices, Workflows & Documents can be linked directly.')}
                className="text-text-muted hover:text-text transition-colors p-1"
                title="Attach Document"
              >
                <Paperclip size={16} />
              </button>

              <input
                type="text"
                placeholder={
                  activeThread.type === 'channel'
                    ? `Message #${activeThread.name}...`
                    : `Message ${activeThread.name}...`
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-transparent text-xs text-text outline-none placeholder:text-text-muted/60 py-1"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-xl transition-all shadow-xs flex items-center gap-1 font-semibold text-xs"
                title="Send in milliseconds"
              >
                <Send size={13} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Team DM Modal */}
      {newChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border rounded-2xl p-5 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-text flex items-center gap-2">
                <Users size={16} className="text-accent" />
                Select Team Member
              </h3>
              <button
                onClick={() => setNewChatModalOpen(false)}
                className="text-text-muted hover:text-text"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleStartDirectChat(u)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-bg-hover text-left transition-colors"
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-9 h-9 rounded-xl object-cover border border-border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text truncate">{u.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{u.role} • {u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
