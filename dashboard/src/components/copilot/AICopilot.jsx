import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  X,
  Send,
  Loader2,
  RotateCcw,
  Cpu,
  ChevronDown,
  Settings,
  Key,
  Check,
  Zap,
} from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { useExpenses } from '../../context/ExpenseContext';
import { useLeads } from '../../context/LeadsContext';
import { useProjectTask } from '../../context/ProjectTaskContext';
import { useAttendanceLeave } from '../../context/AttendanceLeaveContext';
import { useSystemHealth } from '../../context/SystemHealthContext';
import { useApiCredits } from '../../context/ApiCreditsContext';
import { useFineTuning } from '../../context/FineTuningContext';
import {
  buildRealTimeAgencyContext,
  buildCopilotSystemPrompt,
  generateIntelligentOfflineResponse,
} from '../../services/copilotContextService';
import {
  sendAgentMessage,
  getCustomAiSettings,
  saveCustomAiSettings,
} from '../../utils/aiClient';

const INITIAL_GREETING = {
  role: 'bot',
  text: `👋 **হ্যালো মাহমুদ ভাই!**

আমি Aeitron AI-এর নিউরাল কো-পাইলট। আমি কোনো সেভ করা ফেক উত্তর ব্যবহার করি না—সরাসরি আসল AI মডেলের ট্রেন করা নিউরাল নেটওয়ার্ক ও ড্যাশবোর্ডের লাইভ ডেটা থেকে রিয়েল-টাইমে রেসপন্স তৈরি করি।

আজকে কোনো প্রজেক্ট, রেভিনিউ, টাস্ক বা অটোমেশন নিয়ে কি জানতে চান?`,
  timestamp: 'Just now',
};

const QUICK_PROMPTS = [
  '📊 আজকের ড্যাশবোর্ড ওভারভিউ দাও',
  '💰 রেভিনিউ ও প্রফিট মার্জিন কত?',
  '⚡ আর্জেন্ট টাস্ক ও ডেডলাইন কি?',
  '👥 আজকে কে কে চেক-ইন করেছে?',
  '🤖 n8n অটোমেশন আর্কিটেকচার গাইড',
  '📈 এজেন্সি গ্রোথ স্ট্র্যাটেজি কি?',
];

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderMarkdown(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    let rendered = escapeHtml(line);

    // Headers ###
    if (rendered.startsWith('### ')) {
      const headerText = rendered.slice(4);
      return (
        <h4 key={i} className="text-xs font-bold text-accent mt-2 mb-1">
          {headerText}
        </h4>
      );
    }

    // Bold text **bold**
    rendered = rendered.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    // Code snippet `code`
    rendered = rendered.replace(
      /`(.+?)`/g,
      '<code class="px-1 py-0.5 bg-[#181a22] text-accent border border-border/60 rounded text-[11px] font-mono">$1</code>'
    );
    // Blockquote >
    if (rendered.startsWith('&gt; ')) {
      return (
        <blockquote
          key={i}
          className="border-l-2 border-accent/60 pl-2.5 py-0.5 my-1 text-[11px] text-text-muted bg-[#181a22]/60 rounded-r"
          dangerouslySetInnerHTML={{ __html: rendered.slice(5) }}
        />
      );
    }

    // List item • or -
    if (rendered.startsWith('• ') || rendered.startsWith('- ')) {
      const bulletContent = rendered.startsWith('• ') ? rendered.slice(2) : rendered.slice(2);
      return (
        <div key={i} className="flex items-start gap-1.5 ml-1 my-0.5 text-xs">
          <span className="text-accent shrink-0 font-bold">&bull;</span>
          <span dangerouslySetInnerHTML={{ __html: bulletContent }} />
        </div>
      );
    }

    return (
      <div key={i} className="text-xs leading-relaxed min-h-[1.1rem]">
        <span dangerouslySetInnerHTML={{ __html: rendered }} />
      </div>
    );
  });
}

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('ft:open-source-llama3-aeitron-v1');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // AI Configuration state
  const initialSettings = useMemo(() => getCustomAiSettings(), []);
  const [provider, setProvider] = useState(initialSettings.provider || 'openai');
  const [apiKey, setApiKey] = useState(initialSettings.apiKey || '');
  const [baseUrl, setBaseUrl] = useState(initialSettings.baseUrl || '');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Consume all live dashboard contexts
  const { clients } = useClients();
  const { expenses } = useExpenses();
  const { leads } = useLeads();
  const { projects, tasks } = useProjectTask();
  const { records, leaveRequests } = useAttendanceLeave();
  const { automations } = useSystemHealth();
  const { credits } = useApiCredits();
  const { deployedModel } = useFineTuning();

  // Extract live snapshot of the entire agency
  const liveContext = useMemo(() => {
    return buildRealTimeAgencyContext({
      clients,
      expenses,
      leads,
      projects,
      tasks,
      records,
      leaveRequests,
      automations,
      credits,
      deployedModel: deployedModel || selectedModel,
    });
  }, [clients, expenses, leads, projects, tasks, records, leaveRequests, automations, credits, deployedModel, selectedModel]);

  // Sync deployed model from fine-tuning studio if available
  useEffect(() => {
    if (deployedModel) {
      setSelectedModel(deployedModel);
    }
  }, [deployedModel]);

  // Auto scroll messages to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current && !showSettings) {
      inputRef.current.focus();
    }
  }, [isOpen, showSettings]);

  const handleSaveSettings = (e) => {
    e?.preventDefault();
    saveCustomAiSettings({ provider, apiKey, baseUrl });
    setSettingsSaved(true);
    setTimeout(() => {
      setSettingsSaved(false);
      setShowSettings(false);
    }, 1000);
  };

  const handleSendMessage = async (queryText) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', text: textToSend, timestamp: timeStr };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = buildCopilotSystemPrompt(liveContext);
      const apiMessages = [
        ...messages
          .filter((m) => m !== INITIAL_GREETING)
          .slice(-4)
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        { role: 'user', content: textToSend },
      ];

      // Execute real AI model generation directly via LLM weights
      let reply;
      try {
        reply = await sendAgentMessage(systemPrompt, apiMessages, selectedModel);
      } catch (err) {
        console.warn('Live AI execution note:', err.message);
        reply = `⚠️ **লাইভ AI মডেল আনকানেক্টেড:**\n\nআপনি কোনো প্রি-সেভ করা ফেক উত্তর চান না—সরাসরি আসল AI মডেলের ট্রেন করা নিউরাল নেটওয়ার্ক চালাতে অনুগ্রহ করে উপরের **⚙️ সেটিংস**-এ আপনার API Key (OpenAI / Groq / DeepSeek / Gemini) অথবা লোকাল Ollama এন্ডপয়েন্ট দিন।\n\n*(Error: ${err.message || 'API Key not configured'})*`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: selectedModel,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([INITIAL_GREETING]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-modal flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
        title="Open Aeitron AI Copilot"
      >
        <Bot size={26} className="group-hover:rotate-6 transition-transform" />
      </button>
    );
  }

  const isLiveConnected = Boolean(apiKey || provider === 'local');

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 md:bottom-5 md:right-5 z-[70] w-full sm:w-[420px] max-w-[calc(100vw-1rem)] h-[calc(100dvh-1.5rem)] sm:h-[min(530px,calc(100dvh-3.5rem))] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3.5rem)] bg-[#12141c] border border-border/90 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in font-sans">
      {/* Copilot Header */}
      <div className="px-3.5 py-2.5 border-b border-border/80 bg-[#161823] flex flex-col gap-1.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <Bot size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Aeitron AI Copilot</h3>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isLiveConnected ? 'Cloud LLM Active' : 'Live Dashboard RAG'}
                </span>
              </div>
              <p className="text-[10px] text-text-muted">Autonomous Co-founder & Agency Executive Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showSettings ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
              title="AI Model & API Key Settings"
            >
              <Settings size={15} />
            </button>
            <button
              onClick={handleClearHistory}
              className="p-1.5 text-text-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Clear chat conversation"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-text-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              title="Close Copilot"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Settings Drawer */}
        {showSettings ? (
          <form onSubmit={handleSaveSettings} className="p-3 bg-[#1a1d29] border border-[#2b3042] rounded-xl space-y-2.5 text-xs animate-fade-in">
            <div className="flex items-center justify-between pb-1 border-b border-[#2b3042]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Key size={13} className="text-accent" /> AI Provider & Key Settings
              </span>
              <span className="text-[10px] text-text-muted">Saved locally</span>
            </div>

            <div>
              <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-[#12141c] border border-[#2b3042] rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-accent cursor-pointer"
              >
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="deepseek">DeepSeek (DeepSeek-V3 / R1)</option>
                <option value="groq">Groq (Llama 3.3 70B - Ultra Fast)</option>
                <option value="gemini">Google Gemini (Gemini 2.0 Flash)</option>
                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                <option value="local">Local Ollama / LM Studio (localhost:1234)</option>
              </select>
            </div>

            {provider !== 'local' && (
              <div>
                <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-... (optional, works offline without key)"
                  className="w-full bg-[#12141c] border border-[#2b3042] rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-accent"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Fine-Tuned / Active Model Name</label>
              <input
                type="text"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                placeholder="e.g. ft:gpt-4o-mini-2024-07-18:aeitron-ai:xxxx or aeitron-llama"
                className="w-full bg-[#12141c] border border-[#2b3042] rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-accent font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Base URL (Optional)</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="Default provider endpoint"
                className="w-full bg-[#12141c] border border-[#2b3042] rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-accent font-mono text-[11px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-2.5 py-1 text-xs text-text-muted hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                {settingsSaved ? <Check size={13} /> : <Zap size={13} />}
                {settingsSaved ? 'Saved!' : 'Save Config'}
              </button>
            </div>
          </form>
        ) : (
          /* Model Switcher Pill */
          <div className="relative">
            <button
              type="button"
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="w-full flex items-center justify-between px-2.5 py-1 bg-[#1a1d29] hover:bg-[#202434] border border-[#282d3e] rounded-lg text-[10px] text-text-secondary cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1.5 truncate">
                <Cpu size={12} className="text-accent shrink-0" />
                <span className="text-white font-semibold">Active Engine:</span>
                <span className="font-mono text-emerald-400 truncate">{selectedModel}</span>
              </span>
              <ChevronDown size={12} className="shrink-0 text-text-muted" />
            </button>

            {modelDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#181a24] border border-[#2b3042] rounded-xl shadow-xl z-20 p-1.5 space-y-1 text-xs animate-fade-in">
                {[
                  { id: 'ft:open-source-llama3-aeitron-v1', label: 'Aeitron Llama-3-8B (Fine-Tuned Domain Model)', badge: 'Recommended' },
                  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Groq Open-Source Weights)', badge: 'Ultra-Fast' },
                  { id: 'deepseek-chat', label: 'DeepSeek-V3 / R1 (Open-Source Architecture)', badge: 'Reasoning' },
                  { id: 'gpt-4o-mini-2024-07-18', label: 'OpenAI GPT-4o Mini (Cloud)', badge: 'Cloud' },
                  { id: 'gemini-2.0-flash', label: 'Google Gemini 2.0 Flash', badge: 'Fast' },
                  { id: 'local-model', label: 'Ollama / Local LLM (localhost:1234)', badge: 'Local Host' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between text-[11px] cursor-pointer transition-colors ${
                      selectedModel === m.id ? 'bg-accent/15 text-white font-semibold' : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{m.label}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#12141c] text-text-muted shrink-0">{m.badge}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[92%] px-3.5 py-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-xs shadow-md shadow-accent/15'
                  : 'bg-[#181a24] border border-[#282d3e] text-text-secondary rounded-bl-xs shadow-sm'
              }`}
            >
              {renderMarkdown(msg.text)}
            </div>
            <span className="text-[9px] text-text-muted px-1 mt-1 font-mono">{msg.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-[#181a24] border border-[#282d3e] rounded-2xl rounded-bl-xs text-xs text-text-muted w-fit animate-pulse">
            <Loader2 size={13} className="animate-spin text-accent" />
            <span>Aeitron AI ডেটা বিশ্লেষণ ও উত্তর প্রস্তুত করছে...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 border-t border-border/40 bg-[#161823] flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar shrink-0">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="text-[10px] px-2.5 py-1 rounded-full bg-[#1b1e2c] hover:bg-[#24283b] text-text-secondary hover:text-white border border-[#282d3e] transition-all cursor-pointer shrink-0 whitespace-nowrap active:scale-95 disabled:opacity-40"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-border/80 bg-[#12141c] shrink-0"
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ড্যাশবোর্ড, প্রজেক্ট, রেভিনিউ বা অটোমেশন নিয়ে জিজ্ঞাসা করুন..."
            className="flex-1 px-3.5 py-2.5 bg-[#181a24] border border-[#282d3e] rounded-xl text-xs text-white placeholder:text-text-muted/60 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
            title="Send Message"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
      </form>
    </div>
  );
}
