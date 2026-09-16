import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  PhoneOff,
  Mic,
  CheckCheck,
  Check,
  Image as ImageIcon,
  FileText,
  X,
  Plus,
  Users,
  Bot,
  Sparkles,
  Play,
  Pause,
  Download,
  Volume2,
  ThumbsUp,
  Heart,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// 100% Pure Internal Team Channels & Direct Messages (NO CLIENTS)
const INITIAL_TEAM_CHANNELS = [
  {
    id: 'chan_general',
    type: 'channel',
    name: '🚀 #agency-general',
    category: 'channel',
    role: 'All Team Members',
    avatar: '/aeitron_icon_fb.png',
    membersCount: 4,
    online: true,
    lastSeen: '4 team members online',
    unread: 0,
    messages: [
      {
        id: 101,
        senderId: 'usr_ceo',
        senderName: 'Mahmud Hasan (CEO)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
        text: 'Morning team! We officially hit $20,320 in revenue this week. Outstanding work across both sales and operations.',
        time: '09:30 AM',
        status: 'read',
        reactions: ['🔥 3', '🚀 2'],
      },
      {
        id: 102,
        senderId: 'usr_sales',
        senderName: 'Salung Prastyo (Sales)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        text: 'Thanks Mahmud! Closed the recurring $850/mo retainer contract earlier today.',
        time: '09:35 AM',
        status: 'read',
        reactions: ['👍 2'],
      },
      {
        id: 103,
        senderId: 'usr_ops',
        senderName: 'Alex Rivera (AI Ops)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        text: 'All 28 n8n automated workflows and Twilio voice SIP lines are running with 99.98% uptime.',
        time: '09:40 AM',
        status: 'read',
        reactions: ['💯 4'],
      },
      {
        id: 104,
        senderId: 'usr_finance',
        senderName: 'Sarah Jenkins (Finance)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
        text: 'All contractor payouts and commission bonuses have been calculated in the treasury ledger.',
        time: '09:45 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'chan_sales',
    type: 'channel',
    name: '💼 #sales-and-deals',
    category: 'channel',
    role: 'Commercial Team',
    avatar: '/aeitron_icon_fb.png',
    membersCount: 2,
    online: true,
    lastSeen: 'Active Sales Sprint',
    unread: 1,
    messages: [
      {
        id: 201,
        senderId: 'usr_sales',
        senderName: 'Salung Prastyo (Sales)',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
        text: 'Nexus Real Estate wants to add 5 voice agent seats. Sending proposal for $1,200/mo retainer.',
        time: '10:15 AM',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'chan_ai_ops',
    type: 'channel',
    name: '🤖 #ai-engineering-ops',
    category: 'channel',
    role: 'Engineering Team',
    avatar: '/aeitron_icon_fb.png',
    membersCount: 3,
    online: true,
    lastSeen: 'Telephony & Webhooks',
    unread: 0,
    messages: [
      {
        id: 301,
        senderId: 'usr_ops',
        senderName: 'Alex Rivera (AI Ops)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
        text: 'Twilio telephony latency is down to 420ms. The ElevenLabs voice model feels completely human.',
        time: '10:25 AM',
        status: 'read',
      },
    ],
  },
  {
    id: 'chan_finance',
    type: 'channel',
    name: '📊 #finance-and-payouts',
    category: 'channel',
    role: 'Treasury Team',
    avatar: '/aeitron_icon_fb.png',
    membersCount: 2,
    online: true,
    lastSeen: 'Financial Controller',
    unread: 0,
    messages: [
      {
        id: 401,
        senderId: 'usr_finance',
        senderName: 'Sarah Jenkins (Finance)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=faces',
        text: 'Invoice #04910 ($41,400) wire cleared in the primary business checking account.',
        time: 'Yesterday',
        status: 'read',
      },
    ],
  },
];

const EMOJIS = ['👍', '❤️', '🔥', '🚀', '😂', '🎉', '💯', '👏', '💼', '🤖'];

export default function MessagesView() {
  const { currentUser, users } = useAuth();
  const STORAGE_KEY = 'aeitron_team_messenger_internal_v3';

  // Build team direct conversations dynamically from registered users in AuthContext
  const initialDirects = useMemo(() => {
    return users.map((u) => ({
      id: `dm_${u.email.replace(/[@.]/g, '_')}`,
      type: 'direct',
      name: u.name,
      role: u.role,
      category: 'team',
      avatar: u.avatar,
      email: u.email,
      online: true,
      lastSeen: 'Online',
      unread: 0,
      messages: [
        {
          id: Date.now() + Math.random(),
          senderId: u.email,
          senderName: u.name,
          avatar: u.avatar,
          text: `Hey ${currentUser?.name?.split(' ')[0] || 'there'}! Ready for internal team updates and sprint review.`,
          time: '09:00 AM',
          status: 'read',
        },
      ],
    }));
  }, [users, currentUser]);

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure no old client references exist
        const hasClients = parsed.some((c) => c.name?.includes('Dr. Michael') || c.name?.includes('Sophia Chen'));
        if (!hasClients && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [...INITIAL_TEAM_CHANNELS, ...initialDirects];
  });

  const [activeChatId, setActiveChatId] = useState('chan_general');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'direct' | 'channels' | 'unread'
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [voicePlayingId, setVoicePlayingId] = useState(null);
  const [callModal, setCallModal] = useState(null); // { type: 'voice' | 'video', name: '' }
  const [newChatModal, setNewChatModal] = useState(false);

  const messagesEndRef = useRef(null);
  const broadcastChannelRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChatId, conversations]);

  // Sync conversations to localStorage
  const saveConversations = (updated) => {
    setConversations(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Broadcast to other tabs/windows in real time!
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'TEAM_CHAT_UPDATE', data: updated });
      }
    } catch (err) {
      console.error('Failed to sync chat:', err);
    }
  };

  // Real-Time BroadcastChannel listener for multi-tab / multi-user synchronization
  useEffect(() => {
    try {
      const channel = new BroadcastChannel('aeitron_team_messenger_channel');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'TEAM_CHAT_UPDATE') {
          setConversations(event.data.data);
        }
      };

      const handleStorageChange = (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            setConversations(JSON.parse(e.newValue));
          } catch {}
        }
      };
      window.addEventListener('storage', handleStorageChange);

      return () => {
        channel.close();
        window.removeEventListener('storage', handleStorageChange);
      };
    } catch {
      return () => {};
    }
  }, []);

  const activeChat = useMemo(() => {
    return conversations.find((c) => c.id === activeChatId) || conversations[0];
  }, [conversations, activeChatId]);

  // Send Message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userDisplayName = currentUser?.name || 'Mahmud Hasan (CEO)';
    const userDisplayAvatar = currentUser?.avatar || '/aeitron_icon_fb.png';
    const userDisplayId = currentUser?.email || 'me';

    const newMsg = {
      id: Date.now(),
      senderId: userDisplayId,
      senderName: userDisplayName,
      avatar: userDisplayAvatar,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      isMe: true,
    };

    const updated = conversations.map((c) =>
      c.id === activeChatId
        ? {
            ...c,
            messages: [...c.messages, newMsg],
            unread: 0,
          }
        : c
    );

    saveConversations(updated);
    setInputText('');
    setShowEmojiPicker(false);

    // Realistic automated team member response after 1.8s
    if (activeChat.type === 'direct') {
      const responderName = activeChat.name;
      setTimeout(() => {
        setIsTyping(true);
        setTypingUser(responderName);
      }, 700);

      setTimeout(() => {
        setIsTyping(false);
        const automatedReply = {
          id: Date.now() + 1,
          senderId: activeChat.id,
          senderName: activeChat.name,
          avatar: activeChat.avatar,
          text: getRandomTeamReply(activeChat.role || activeChat.name),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
        };

        setConversations((prev) => {
          const nextConvs = prev.map((c) =>
            c.id === activeChatId
              ? { ...c, messages: [...c.messages, automatedReply] }
              : c
          );
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConvs));
            broadcastChannelRef.current?.postMessage({ type: 'TEAM_CHAT_UPDATE', data: nextConvs });
          } catch {}
          return nextConvs;
        });
      }, 2200);
    }
  };

  // Add Emoji reaction
  const handleReaction = (msgId, emoji) => {
    const updated = conversations.map((c) => {
      if (c.id !== activeChatId) return c;
      const msgs = c.messages.map((m) => {
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
      return { ...c, messages: msgs };
    });
    saveConversations(updated);
  };

  // Switch or start direct conversation with a team member
  const handleSelectTeamMember = (targetUser) => {
    const directId = `dm_${targetUser.email.replace(/[@.]/g, '_')}`;
    const existing = conversations.find((c) => c.id === directId);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      const newDirect = {
        id: directId,
        type: 'direct',
        name: targetUser.name,
        role: targetUser.role,
        category: 'team',
        avatar: targetUser.avatar,
        email: targetUser.email,
        online: true,
        lastSeen: 'Online',
        unread: 0,
        messages: [
          {
            id: Date.now(),
            senderId: targetUser.email,
            senderName: targetUser.name,
            avatar: targetUser.avatar,
            text: `Hi ${currentUser?.name?.split(' ')[0] || 'there'}! Ready for team updates.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          },
        ],
      };
      const updated = [...conversations, newDirect];
      saveConversations(updated);
      setActiveChatId(newDirect.id);
    }
    setNewChatModal(false);
  };

  // Filtered chats by tab & search
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.role && c.role.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;
      if (activeTab === 'direct') return c.type === 'direct';
      if (activeTab === 'channels') return c.type === 'channel';
      if (activeTab === 'unread') return c.unread > 0;
      return true;
    });
  }, [conversations, search, activeTab]);

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" size={24} />
            Aeitron Internal Team Live Messenger (WhatsApp Engine)
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Encrypted real-time communication exclusively for Aeitron team members, executives, and operators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setNewChatModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>Chat with Team Member</span>
          </button>
        </div>
      </div>

      {/* Main WhatsApp Window Container */}
      <div className="bg-bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden h-[660px] flex">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: TEAM DIRECTS & CHANNELS (WhatsApp Left Sidebar)              */}
        {/* ========================================================================= */}
        <div className="w-80 sm:w-88 border-r border-border/80 flex flex-col bg-bg/50 shrink-0">
          {/* Top User Bar */}
          <div className="p-3.5 px-4 border-b border-border/80 flex items-center justify-between bg-bg-card">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser?.avatar || '/aeitron_icon_fb.png'}
                  alt={currentUser?.name}
                  className="w-9 h-9 rounded-full object-cover border border-border shadow-xs"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-bg-card" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-text truncate">{currentUser?.name || 'Mahmud Hasan'}</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span>●</span> {currentUser?.role || 'Team Member'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-text-muted">
              <button
                type="button"
                onClick={() => setNewChatModal(true)}
                className="p-1.5 hover:text-text rounded-lg hover:bg-bg transition-colors"
                title="Direct Message Team Member"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="p-2.5 px-3 border-b border-border/60 bg-bg-card/50">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search team member or channel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-bg border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Filter Pills (WhatsApp Web style: All Team, Direct, Channels) */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 overflow-x-auto bg-bg-card/30">
            {[
              { id: 'all', label: 'All Team Chats' },
              { id: 'direct', label: 'Direct (1-on-1)' },
              { id: 'channels', label: 'Team Channels' },
              { id: 'unread', label: 'Unread' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-bg text-text-muted hover:text-text border border-border/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chats Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40">
            {filteredConversations.map((chat) => {
              const isActive = chat.id === activeChatId;
              const lastMsg = chat.messages[chat.messages.length - 1];

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setConversations((prev) =>
                      prev.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
                    );
                  }}
                  className={`w-full flex items-center gap-3 p-3 px-4 text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-l-4 border-emerald-500'
                      : 'hover:bg-bg/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-11 h-11 rounded-full object-cover border border-border shadow-xs"
                    />
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-bg-card" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-text'}`}>
                        {chat.name}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-text-muted shrink-0 ml-1">
                          {lastMsg.time}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] text-text-muted truncate">
                        {lastMsg ? (
                          lastMsg.isVoice ? (
                            <span className="flex items-center gap-1 text-accent">
                              <Mic size={11} /> Voice note ({lastMsg.duration})
                            </span>
                          ) : (
                            lastMsg.text
                          )
                        ) : (
                          'No messages yet'
                        )}
                      </p>

                      {chat.unread > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: ACTIVE CONVERSATION CANVAS (WhatsApp Right Area)            */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col justify-between bg-bg-card min-w-0 relative">
          {/* Active Chat Top Header */}
          <div className="p-3 px-5 border-b border-border/80 flex items-center justify-between bg-bg-card z-10">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-10 h-10 rounded-full object-cover border border-border shadow-xs"
                />
                {activeChat.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-bg-card" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-text truncate flex items-center gap-2">
                  <span>{activeChat.name}</span>
                  {activeChat.role && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                      {activeChat.role}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                  {isTyping ? (
                    <span className="animate-pulse font-semibold">
                      ✍️ {typingUser} is typing...
                    </span>
                  ) : (
                    activeChat.lastSeen || 'Online'
                  )}
                </p>
              </div>
            </div>

            {/* Team Calling & Direct Actions */}
            <div className="flex items-center gap-1 sm:gap-2 text-text-muted">
              <button
                type="button"
                onClick={() => setCallModal({ type: 'voice', name: activeChat.name })}
                className="p-2 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors cursor-pointer"
                title="Direct Voice Call"
              >
                <Phone size={17} />
              </button>

              <button
                type="button"
                onClick={() => setCallModal({ type: 'video', name: activeChat.name })}
                className="p-2 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors cursor-pointer"
                title="Direct Video Call"
              >
                <Video size={18} />
              </button>

              <button
                type="button"
                className="p-2 hover:text-text hover:bg-bg rounded-xl transition-colors cursor-pointer"
                title="Search Messages"
              >
                <Search size={17} />
              </button>
            </div>
          </div>

          {/* Messages Scrollable Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
            {/* Date Separator Pill */}
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-bg border border-border/70 rounded-full text-[10px] font-semibold text-text-muted uppercase tracking-wider shadow-xs">
                Internal Team Channel • Today
              </span>
            </div>

            {activeChat.messages.map((msg) => {
              const isMe =
                msg.isMe ||
                (currentUser?.email && msg.senderId?.toLowerCase() === currentUser.email.toLowerCase()) ||
                msg.senderName?.includes(currentUser?.name?.split(' ')[0] || 'Mahmud');

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-md p-3 rounded-2xl shadow-xs text-xs leading-relaxed transition-all ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-xs'
                        : 'bg-bg-card text-text border border-border/80 rounded-tl-xs'
                    }`}
                  >
                    {/* In Group Channels: Show Sender Name */}
                    {activeChat.type === 'channel' && !isMe && (
                      <div className="text-[11px] font-bold text-accent mb-1 flex items-center gap-1.5">
                        <img src={msg.avatar} alt="" className="w-4 h-4 rounded-full object-cover inline" />
                        <span>{msg.senderName}</span>
                      </div>
                    )}

                    {/* Voice Message Bubble */}
                    {msg.isVoice ? (
                      <div className="flex items-center gap-3 p-1 min-w-[180px]">
                        <button
                          type="button"
                          onClick={() => setVoicePlayingId(voicePlayingId === msg.id ? null : msg.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                            isMe ? 'bg-white text-emerald-700' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {voicePlayingId === msg.id ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                        </button>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1 h-3">
                            {[30, 70, 45, 90, 60, 100, 40, 80, 50, 95, 35].map((h, idx) => (
                              <div
                                key={idx}
                                className={`w-1 rounded-full ${
                                  voicePlayingId === msg.id ? 'animate-pulse' : ''
                                } ${isMe ? 'bg-white/70' : 'bg-emerald-500'}`}
                                style={{ height: `${h}%` }}
                              />
                            ))}
                          </div>
                          <div className={`text-[10px] font-mono ${isMe ? 'text-white/80' : 'text-text-muted'}`}>
                            {msg.duration}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap select-text">{msg.text}</p>
                    )}

                    {/* Timestamp & Double Check status */}
                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] mt-1 select-none ${
                        isMe ? 'text-white/80' : 'text-text-muted'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isMe && (
                        <CheckCheck size={13} className="text-sky-300" />
                      )}
                    </div>
                  </div>

                  {/* Message Reactions Bar */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1 mt-1 px-1">
                      {msg.reactions.map((r, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-bg-card border border-border text-[10px] shadow-xs cursor-pointer hover:scale-105 transition-transform"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quick Reaction Hover Buttons */}
                  <div
                    className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-0.5 px-2 select-none ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {['👍', '❤️', '🔥'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleReaction(msg.id, emoji)}
                        className="text-xs hover:scale-125 transition-transform p-0.5"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator bubble */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-text-muted bg-bg-card p-2.5 px-4 rounded-2xl border border-border w-fit shadow-xs animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="font-semibold text-text ml-1">{typingUser} is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM BAR: MESSAGE INPUT & ACTIONS (WhatsApp Bottom Bar)                 */}
          {/* ========================================================================= */}
          <div className="p-3 px-4 border-t border-border/80 bg-bg-card relative z-20">
            {/* Emoji Picker Popover */}
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-2 left-4 bg-bg-card border border-border shadow-2xl rounded-2xl p-3 z-50 animate-fade-in flex gap-2">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setInputText((prev) => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-lg hover:scale-125 transition-transform p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              {/* Emoji Button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2 rounded-xl transition-colors ${
                  showEmojiPicker ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'text-text-muted hover:text-text'
                }`}
                title="Add Emoji"
              >
                <Smile size={20} />
              </button>

              {/* Attach File Button */}
              <button
                type="button"
                onClick={() => setInputText((prev) => prev + ' [File attached: sprint_deliverables.pdf] ')}
                className="p-2 text-text-muted hover:text-text rounded-xl transition-colors"
                title="Attach Document / Workflow"
              >
                <Paperclip size={19} />
              </button>

              {/* Input Text Box */}
              <input
                type="text"
                placeholder={`Message team on ${activeChat.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-bg border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
              />

              {/* Send or Mic Button */}
              {inputText.trim() ? (
                <button
                  type="submit"
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                  title="Send Message"
                >
                  <Send size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const voiceMsg = {
                      id: Date.now(),
                      senderId: currentUser?.email || 'me',
                      senderName: currentUser?.name || 'Mahmud Hasan',
                      avatar: currentUser?.avatar || '/aeitron_icon_fb.png',
                      isVoice: true,
                      duration: '0:14',
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      status: 'sent',
                      isMe: true,
                    };
                    const updated = conversations.map((c) =>
                      c.id === activeChatId ? { ...c, messages: [...c.messages, voiceMsg] } : c
                    );
                    saveConversations(updated);
                  }}
                  className="p-2.5 bg-bg hover:bg-bg-hover text-text-muted hover:text-emerald-600 border border-border rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Record Voice Note"
                >
                  <Mic size={17} />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CALL MODAL (Audio / Video Call Simulation)                                */}
      {/* ========================================================================= */}
      {callModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl animate-fade-in space-y-6">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 p-2 animate-pulse mx-auto">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-full h-full rounded-full object-cover border-2 border-emerald-400"
                />
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                {callModal.type === 'video' ? <Video size={10} /> : <Phone size={10} />}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold">{callModal.name}</h3>
              <p className="text-xs text-emerald-400 font-medium mt-1 animate-pulse">
                {callModal.type === 'video' ? 'Connecting Encrypted Team Video Call...' : 'Calling Team Member via WebRTC...'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4">
              <button
                type="button"
                onClick={() => setCallModal(null)}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title="End Call"
              >
                <PhoneOff size={22} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIRECT TEAM MEMBER SELECTOR MODAL                                         */}
      {/* ========================================================================= */}
      {newChatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-text">Direct Message Team Member</h3>
              <button
                onClick={() => setNewChatModal(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-bg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleSelectTeamMember(u)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border/80 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-border" />
                    <div>
                      <div className="text-xs font-bold text-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-text-muted">{u.role}</div>
                    </div>
                  </div>

                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Direct Message →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getRandomTeamReply(roleOrName) {
  const replies = [
    "Got it! Working on this task right now and keeping the agency dashboard updated.",
    "Sounds great! Everything is verified and running smoothly in our production workflows.",
    "Understood! Checking the webhook latency and will post the confirmation in 5 mins.",
    "Perfect! Completely aligned with our agency weekly growth sprint.",
    "Confirmed! Just finished synchronizing with the team ledger.",
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}
