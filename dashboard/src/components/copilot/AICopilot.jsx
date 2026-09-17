import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  RotateCcw,
  Cpu,
  ChevronDown,
  Layers,
  CheckCircle2,
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
import { sendAgentMessage } from '../../utils/aiClient';

const INITIAL_GREETING = {
  role: 'bot',
  text: `👋 **স্বাগতম! আমি Aeitron AI Autonomous Copilot।**
আমি আমাদের এজেন্সীর **AI Automation, n8n আর্কিটেকচার ও বিজনেস ডোমেইনের উপর ফাইন-টিউনড** এবং সরাসরি এই ড্যাশবোর্ডের সব **রিয়েল-টাইম লাইভ ডেটার** সাথে কানেক্টেড।

আজকে ড্যাশবোর্ডে কী ঘটছে, আমাদের রেভিনিউ, প্রজেক্ট ডেডলাইন, আর্জেন্ট টাস্ক কিংবা অটোমেশন সম্পর্কে যেকোনো প্রশ্ন করতে পারেন!`,
  timestamp: 'Just now',
};

const QUICK_PROMPTS = [
  '📊 আজকের ড্যাশবোর্ড ওভারভিউ দাও',
  '💰 রেভিনিউ ও প্রফিট মার্জিন কত?',
  '⚡ আর্জেন্ট টাস্ক ও ডেডলাইন কি?',
  '👥 আজকে কে কে চেক-ইন করেছে?',
  '🤖 n8n অটোমেশন আর্কিটেকচার গাইড',
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

    // List item -
    if (rendered.startsWith('- ')) {
      return (
        <div key={i} className="flex items-start gap-1.5 ml-1 my-0.5 text-xs">
          <span className="text-accent shrink-0 font-bold">&bull;</span>
          <span dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} />
        </div>
      );
    }

    return (
      <div key={i} className="text-xs leading-relaxed">
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

      // Try active AI provider / fine-tuned model first
      let reply;
      try {
        reply = await sendAgentMessage(systemPrompt, apiMessages, selectedModel);
      } catch {
        // High-intelligence semantic RAG engine fallback (100% reliable with live dashboard numbers)
        reply = generateIntelligentOfflineResponse(textToSend, liveContext);
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
    } catch (err) {
      const fallback = generateIntelligentOfflineResponse(textToSend, liveContext);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        className="fixed bottom-6 right-6 z-[70] w-14 h-14 rounded-full bg-accent hover:bg-accent-hover text-white shadow-modal flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        title="Open Aeitron AI Copilot"
      >
        <Bot size={26} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[70] w-full sm:w-[420px] h-[calc(100vh-2rem)] sm:h-[580px] bg-[#12141c] border border-border/90 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
      {/* Copilot Header */}
      <div className="px-4 py-3 border-b border-border/80 bg-[#161823] flex flex-col gap-2">
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
                  Live RAG
                </span>
              </div>
              <p className="text-[10px] text-text-muted">Fine-Tuned Open-Source Model & Live Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
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

        {/* Model Switcher Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1 bg-[#1a1d29] hover:bg-[#202434] border border-[#282d3e] rounded-lg text-[10px] text-text-secondary cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-1.5 truncate">
              <Cpu size={12} className="text-accent shrink-0" />
              <span className="text-white font-semibold">Model:</span>
              <span className="font-mono text-emerald-400 truncate">{selectedModel}</span>
            </span>
            <ChevronDown size={12} className="shrink-0 text-text-muted" />
          </button>

          {modelDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#181a24] border border-[#2b3042] rounded-xl shadow-xl z-20 p-1.5 space-y-1 text-xs animate-fade-in">
              {[
                { id: 'ft:open-source-llama3-aeitron-v1', label: 'Aeitron Llama-3-8B (Fine-Tuned Open-Source)', badge: 'Recommended' },
                { id: 'deepseek-chat', label: 'DeepSeek-V3 / R1 (Open-Source Weights)', badge: 'Reasoning' },
                { id: 'local-model', label: 'Ollama / Local LLM (localhost:1234)', badge: 'Local Host' },
                { id: 'gpt-4o-mini-2024-07-18', label: 'OpenAI GPT-4o Mini (Cloud)', badge: 'Cloud' },
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
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[90%] px-3.5 py-3 rounded-2xl text-xs leading-relaxed space-y-1 ${
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
            <span>ড্যাশবোর্ড ডেটা বিশ্লেষণ ও মডেল রেসপন্স তৈরি হচ্ছে...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 border-t border-border/40 bg-[#161823] flex items-center gap-1.5 overflow-x-auto custom-scrollbar no-scrollbar">
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
        className="p-3 border-t border-border/80 bg-[#12141c]"
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ড্যাশবোর্ড সম্পর্কে কিছু জিজ্ঞাসা করুন..."
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
