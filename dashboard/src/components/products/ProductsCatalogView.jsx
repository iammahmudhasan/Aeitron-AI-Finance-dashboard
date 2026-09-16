import { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Bot,
  PhoneCall,
  MessageSquareCode,
  Layers,
  Sparkles,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  X,
  Trash2,
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Autonomous AI Voice Agent',
    category: 'Voice AI',
    description: '24/7 Inbound & outbound phone receptionist with real-time call qualification, objection handling, and Google Calendar booking.',
    setupPrice: 3500,
    retainerPrice: 850,
    activeDeployments: 9,
    deliveryDays: 7,
    techStack: ['Twilio SIP', 'ElevenLabs', 'GPT-4o Realtime', 'Make.com'],
    status: 'High Demand',
    icon: PhoneCall,
  },
  {
    id: 'prod_2',
    name: 'Omni-Channel Customer Support AI',
    category: 'Chatbots',
    description: 'Embeddable web widget and WhatsApp bot trained on custom business knowledge bases to resolve 80%+ of tickets instantly.',
    setupPrice: 2200,
    retainerPrice: 450,
    activeDeployments: 14,
    deliveryDays: 5,
    techStack: ['WhatsApp API', 'Pinecone Vector DB', 'Claude 3.7', 'React Widget'],
    status: 'Active',
    icon: MessageSquareCode,
  },
  {
    id: 'prod_3',
    name: 'Multi-Agent Cold Outreach Pipeline',
    category: 'Outbound Growth',
    description: 'Autonomous scraper that finds verified prospects, enriches lead data, generates hyper-personalized pitches, and runs automated sequences.',
    setupPrice: 1800,
    retainerPrice: 600,
    activeDeployments: 11,
    deliveryDays: 4,
    techStack: ['Apollo Scraper', 'Clay', 'Claude 3.5 Sonnet', 'Instantly.ai'],
    status: 'Active',
    icon: Sparkles,
  },
  {
    id: 'prod_4',
    name: 'Automated Accounting & Invoice Reconciliation Engine',
    category: 'Operations',
    description: 'Automated OCR extraction from incoming invoices, multi-channel payment reconciliation (Bank/Stripe/PayPal), and ledger sync.',
    setupPrice: 2800,
    retainerPrice: 500,
    activeDeployments: 7,
    deliveryDays: 6,
    techStack: ['Stripe Webhooks', 'Mindee OCR', 'n8n', 'QuickBooks API'],
    status: 'Active',
    icon: Layers,
  },
  {
    id: 'prod_5',
    name: 'AI Appointment Setter & Lead Nurturing Bot',
    category: 'Outbound Growth',
    description: 'SMS and Instagram DM automated conversation agent that engages prospects within 60 seconds and converts them to booked calls.',
    setupPrice: 1950,
    retainerPrice: 400,
    activeDeployments: 8,
    deliveryDays: 4,
    techStack: ['ManyChat API', 'Twilio SMS', 'DeepSeek V3', 'Calendly'],
    status: 'Active',
    icon: Bot,
  },
];

export default function ProductsCatalogView() {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('aeitron_products_catalog');
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Voice AI');
  const [description, setDescription] = useState('');
  const [setupPrice, setSetupPrice] = useState(2500);
  const [retainerPrice, setRetainerPrice] = useState(500);
  const [deliveryDays, setDeliveryDays] = useState(5);
  const [techInput, setTechInput] = useState('OpenAI, Make.com, Supabase');

  const saveProducts = (updated) => {
    setProducts(updated);
    try {
      localStorage.setItem('aeitron_products_catalog', JSON.stringify(updated));
    } catch {}
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    const newProd = {
      id: `prod_${Date.now()}`,
      name,
      category,
      description,
      setupPrice: Number(setupPrice),
      retainerPrice: Number(retainerPrice),
      activeDeployments: 1,
      deliveryDays: Number(deliveryDays),
      techStack: techInput.split(',').map((s) => s.trim()).filter(Boolean),
      status: 'Active',
      icon: category === 'Voice AI' ? PhoneCall : category === 'Chatbots' ? MessageSquareCode : Bot,
    };

    saveProducts([newProd, ...products]);
    setModalOpen(false);
    setName('');
    setDescription('');
  };

  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalDeployments = products.reduce((sum, p) => sum + (p.activeDeployments || 0), 0);
  const totalMrr = products.reduce((sum, p) => sum + (p.retainerPrice * (p.activeDeployments || 0)), 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text tracking-tight flex items-center gap-2">
            <Package className="text-accent" size={24} />
            AI Solutions & Products Catalog
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Packaged enterprise AI services, setup pricing, monthly retainer contracts, and client deployments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
        >
          <Plus size={15} />
          <span>Add New AI Offering</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Active Deployments
          </span>
          <div className="text-2xl font-bold text-text mt-1">{totalDeployments} Clients</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Live in production
          </span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Catalog MRR Generated
          </span>
          <div className="text-2xl font-bold text-text mt-1">${totalMrr.toLocaleString()}/mo</div>
          <span className="text-[11px] text-accent font-medium">Recurring retainers</span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Packaged Solutions
          </span>
          <div className="text-2xl font-bold text-text mt-1">{products.length} Products</div>
          <span className="text-[11px] text-text-muted font-medium">Turnkey agency offerings</span>
        </div>

        <div className="bg-bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
            Avg Turnaround Time
          </span>
          <div className="text-2xl font-bold text-text mt-1">5.2 Days</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Discovery to client launch
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Voice AI', 'Chatbots', 'Outbound Growth', 'Operations'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-accent'
                  : 'bg-bg border border-border text-text-muted hover:text-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search AI solutions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-bg-card border border-border rounded-xl text-xs text-text placeholder:text-text-muted/50 outline-none w-56 focus:border-accent"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((prod) => {
          const Icon = prod.icon || Bot;
          return (
            <div
              key={prod.id}
              className="bg-bg-card border border-border/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent border border-accent/20">
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/15 text-accent border border-accent/25">
                      {prod.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(prod.id)}
                      className="text-text-muted/50 hover:text-danger p-1 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-text tracking-tight mb-1">{prod.name}</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">{prod.description}</p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {prod.techStack?.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-bg text-text-secondary border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & Deployment Info Footer */}
              <div className="pt-3 border-t border-border/60">
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-text-muted text-[10px] uppercase tracking-wider block">
                      Setup Fee
                    </span>
                    <span className="font-bold text-text text-sm">${prod.setupPrice.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] uppercase tracking-wider block">
                      Monthly Retainer
                    </span>
                    <span className="font-bold text-accent text-sm">${prod.retainerPrice.toLocaleString()}/mo</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-text-muted bg-bg p-2 rounded-xl border border-border/50">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={13} />
                    {prod.activeDeployments} Active Clients
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {prod.deliveryDays}d delivery
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-lg w-full p-6 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <h3 className="text-sm font-bold text-text">Add Agency AI Solution</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-bg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-medium">Solution Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Customer Churn Predictor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  >
                    <option value="Voice AI">Voice AI</option>
                    <option value="Chatbots">Chatbots</option>
                    <option value="Outbound Growth">Outbound Growth</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-muted mb-1 font-medium">Estimated Delivery (Days)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Description</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Describe what the automation does and the business ROI..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Setup Fee ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={setupPrice}
                    onChange={(e) => setSetupPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-medium">Monthly Retainer ($/mo)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={retainerPrice}
                    onChange={(e) => setRetainerPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-medium">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. OpenAI, Make.com, Supabase, React"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="w-full px-3 py-2 bg-bg border border-border rounded-xl text-text outline-none focus:border-accent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-text hover:bg-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl transition-colors font-semibold"
                >
                  Publish Offering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
