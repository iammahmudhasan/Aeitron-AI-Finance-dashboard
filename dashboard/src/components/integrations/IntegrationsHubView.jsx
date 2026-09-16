import { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  RefreshCw,
  Key,
  ExternalLink,
  ShieldCheck,
  Zap,
  Bot,
  Database,
  PhoneCall,
  CreditCard,
  Cpu,
} from 'lucide-react';

const INITIAL_INTEGRATIONS = [
  {
    id: 'int_openai',
    name: 'OpenAI API Platform',
    category: 'LLM & Speech',
    icon: Bot,
    status: 'Connected',
    apiKeyMasked: 'sk-proj-••••••••••••••••39Ax',
    latency: '118ms',
    models: 'GPT-4o, o3-mini, Whisper, Text-Embedding-3',
    requestsToday: '14,820 calls',
  },
  {
    id: 'int_anthropic',
    name: 'Anthropic Claude Engine',
    category: 'Reasoning & Coding',
    icon: Cpu,
    status: 'Connected',
    apiKeyMasked: 'sk-ant-••••••••••••••••77kL',
    latency: '142ms',
    models: 'Claude 3.7 Sonnet, Claude 3.5 Haiku',
    requestsToday: '8,450 calls',
  },
  {
    id: 'int_n8n_make',
    name: 'n8n & Make.com Webhook Hub',
    category: 'Workflow Automation',
    icon: Zap,
    status: 'Connected',
    apiKeyMasked: 'wh-auth-••••••••••••••••99Fp',
    latency: '45ms',
    models: '28 Active Production Workflows',
    requestsToday: '32,190 executions',
  },
  {
    id: 'int_supabase',
    name: 'Supabase PostgreSQL & Vector DB',
    category: 'Database & Storage',
    icon: Database,
    status: 'Connected',
    apiKeyMasked: 'sb-anon-••••••••••••••••01Qq',
    latency: '28ms',
    models: 'Vector pgvector embeddings, Auth, Realtime',
    requestsToday: '48,900 queries',
  },
  {
    id: 'int_twilio',
    name: 'Twilio Voice & SMS Infrastructure',
    category: 'Telephony & Cellular',
    icon: PhoneCall,
    status: 'Connected',
    apiKeyMasked: 'AC398••••••••••••••••881b',
    latency: '42ms',
    models: 'SIP Trunking, Outbound Call Queues, SMS Webhooks',
    requestsToday: '426 calls',
  },
  {
    id: 'int_stripe',
    name: 'Stripe & PayPal Merchant Gateways',
    category: 'Payment Settlements',
    icon: CreditCard,
    status: 'Connected',
    apiKeyMasked: 'rk_live_••••••••••••••••44Zb',
    latency: '85ms',
    models: 'Recurring Invoicing, Webhooks, Wire Verification',
    requestsToday: '24 events',
  },
];

export default function IntegrationsHubView() {
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);
  const [testingId, setTestingId] = useState(null);

  const testConnection = (id) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, latency: `${Math.floor(25 + Math.random() * 80)}ms`, status: 'Connected' }
            : item
        )
      );
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <Layers className="text-accent" size={24} />
            API & Technical Integrations Command Center
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Mission control for AI model providers, webhook routers, vector databases, and billing APIs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold">
            <ShieldCheck size={14} />
            Encrypted Vault Active
          </span>
        </div>
      </div>

      {/* Grid of Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => {
          const Icon = item.icon;
          const isTesting = testingId === item.id;

          return (
            <div
              key={item.id}
              className="bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text">{item.name}</h3>
                      <span className="text-[11px] text-text-muted">{item.category}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    <CheckCircle2 size={11} />
                    {item.status}
                  </span>
                </div>

                {/* API Key Box */}
                <div className="bg-bg p-2.5 rounded-xl border border-border/50 mb-3">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-0.5">
                    API Secret Token
                  </span>
                  <div className="font-mono text-xs text-text font-medium flex items-center justify-between">
                    <span>{item.apiKeyMasked}</span>
                    <Key size={12} className="text-text-muted" />
                  </div>
                </div>

                {/* Scope & Details */}
                <div className="space-y-1 text-xs mb-4">
                  <div className="text-text-secondary text-[11px]">
                    <strong className="text-text">Scope:</strong> {item.models}
                  </div>
                  <div className="text-text-secondary text-[11px]">
                    <strong className="text-text">Volume:</strong> {item.requestsToday}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <div className="font-mono text-[11px] text-text-muted">
                  Latency: <span className="text-text font-bold">{item.latency}</span>
                </div>

                <button
                  type="button"
                  onClick={() => testConnection(item.id)}
                  disabled={isTesting}
                  className="px-2.5 py-1.5 bg-bg hover:bg-bg-hover text-text border border-border rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 active:scale-95"
                >
                  <RefreshCw size={12} className={isTesting ? 'animate-spin text-accent' : ''} />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
