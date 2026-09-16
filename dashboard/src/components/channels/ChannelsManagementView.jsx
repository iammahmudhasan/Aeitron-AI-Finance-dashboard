import { useState } from 'react';
import {
  Globe,
  MessageCircle,
  Send,
  Code2,
  PhoneCall,
  Mail,
  CheckCircle2,
  Copy,
  Check,
  Power,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

const INITIAL_CHANNELS = [
  {
    id: 'chan_whatsapp',
    name: 'WhatsApp Business Cloud API',
    type: 'Messaging',
    icon: MessageCircle,
    status: 'Operational',
    uptime: '99.98%',
    activeSessions: 384,
    endpoint: 'https://api.aeitron.com/v1/webhooks/whatsapp',
    description: 'Direct Meta Cloud API webhook listener for incoming client inquiries, automated qualification, and appointment confirmations.',
    assignedAgent: 'Support & Lead Qualifier AI',
    color: 'emerald',
  },
  {
    id: 'chan_telegram',
    name: 'Telegram Real-Time Notification Bot',
    type: 'Alerts & Ops',
    icon: Send,
    status: 'Operational',
    uptime: '100%',
    activeSessions: 1420,
    endpoint: 'https://api.aeitron.com/v1/webhooks/telegram',
    description: 'Instant team notifications for high-ticket incoming leads, payment receipts, and critical automation alerts.',
    assignedAgent: 'CEO Dispatch & Lead Radar',
    color: 'sky',
  },
  {
    id: 'chan_web',
    name: 'Interactive Website Chat Widget',
    type: 'Web Conversions',
    icon: Code2,
    status: 'Operational',
    uptime: '99.95%',
    activeSessions: 890,
    embedSnippet: '<script src="https://cdn.aeitron.com/agent-widget.js" data-agent-id="aeitron_live" async></script>',
    description: 'Embeddable customer-facing chat widget deployed on agency marketing sites and client landing pages.',
    assignedAgent: 'Omni-Channel Support AI',
    color: 'purple',
  },
  {
    id: 'chan_voice',
    name: 'Twilio Voice AI SIP Trunk',
    type: 'Voice Telephony',
    icon: PhoneCall,
    status: 'Operational',
    uptime: '99.89%',
    activeSessions: 46,
    endpoint: 'sip:telephony.aeitron.com:5060',
    description: 'Sub-second real-time conversational telephony bridging ElevenLabs voice synthesis with OpenAI GPT-4o voice pipeline.',
    assignedAgent: 'Autonomous Voice Receptionist',
    color: 'rose',
  },
  {
    id: 'chan_email',
    name: 'Email Inbound & Outbound Parser',
    type: 'Email Engine',
    icon: Mail,
    status: 'Operational',
    uptime: '100%',
    activeSessions: 512,
    endpoint: 'inbox-router@aeitron.com',
    description: 'IMAP webhook listener automatically extracting attachments, RFP documents, and routing invoices to accounting.',
    assignedAgent: 'Invoice & Document Extraction Agent',
    color: 'amber',
  },
];

export default function ChannelsManagementView() {
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [copiedId, setCopiedId] = useState(null);

  const toggleStatus = (id) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'Operational' ? 'Paused' : 'Operational' }
          : c
      )
    );
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <Globe className="text-accent" size={24} />
            Channel Deployments & Telephony Infrastructure
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Monitor and manage active communication endpoints where your AI workforce interacts with clients and prospects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All Gateways Online
          </span>
        </div>
      </div>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {channels.map((chan) => {
          const Icon = chan.icon;
          const isOperational = chan.status === 'Operational';

          return (
            <div
              key={chan.id}
              className="bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text">{chan.name}</h3>
                      <span className="text-[11px] text-text-muted">{chan.type}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isOperational
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          : 'bg-slate-500/15 text-slate-500 border-slate-500/25'
                      }`}
                    >
                      {chan.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStatus(chan.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isOperational
                          ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-emerald-500/20'
                          : 'text-slate-400 hover:bg-slate-100 border-border'
                      }`}
                      title={isOperational ? 'Pause Channel' : 'Activate Channel'}
                    >
                      <Power size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  {chan.description}
                </p>

                {/* Endpoint or Snippet */}
                <div className="mb-4 bg-bg p-2.5 rounded-xl border border-border/60">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-text-muted uppercase mb-1">
                    <span>{chan.embedSnippet ? 'Embed Snippet' : 'Webhook Endpoint'}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(chan.embedSnippet || chan.endpoint, chan.id)}
                      className="text-accent hover:text-accent-hover inline-flex items-center gap-1 font-semibold normal-case"
                    >
                      {copiedId === chan.id ? (
                        <>
                          <Check size={11} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-text truncate">
                    {chan.embedSnippet || chan.endpoint}
                  </div>
                </div>
              </div>

              {/* Metrics Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-text-muted text-[10px] uppercase tracking-wider block">Assigned AI</span>
                  <span className="font-semibold text-text">{chan.assignedAgent}</span>
                </div>

                <div className="text-right">
                  <span className="text-text-muted text-[10px] uppercase tracking-wider block">Active Sessions</span>
                  <span className="font-bold text-accent font-mono">{chan.activeSessions.toLocaleString()} reqs</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
