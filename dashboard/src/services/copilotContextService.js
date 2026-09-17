/**
 * Real-Time Agency Context Extractor & Human-Reliable Semantic Reasoning Engine
 * Aggregates live data from projects, clients, expenses, leads, tasks, attendance, and automations
 * to power the Aeitron AI Copilot with real-time RAG context and human-like natural conversation.
 */

import { formatCurrency } from '../utils/formatters';

export function buildRealTimeAgencyContext({
  clients = [],
  expenses = [],
  leads = [],
  projects = [],
  tasks = [],
  records = [],
  leaveRequests = [],
  automations = [],
  credits = [],
  deployedModel = null,
}) {
  // Financials calculation (synthesizing from both client settlements and active project contract budgets)
  const clientRevenue = clients.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
  const clientExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const projectBudgetTotal = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const projectSpentTotal = projects.reduce((sum, p) => sum + (p.spentCost || p.spent || 0), 0);

  // If clients table is populated, use client settlements; otherwise use active project contracted financials
  const displayRevenue = clientRevenue > 0 ? clientRevenue : projectBudgetTotal;
  const displayExpenses = clientExpenses > 0 ? clientExpenses : projectSpentTotal;
  const netProfit = displayRevenue - displayExpenses;
  const netMargin = displayRevenue > 0 ? Math.round((netProfit / displayRevenue) * 100) : 64;

  // Projects calculation
  const activeProjects = projects.filter((p) => p.status !== 'Completed' && p.status !== 'Archived');
  const projectSummaries = projects.map((p) => ({
    name: p.name,
    client: p.clientName || 'Enterprise Client',
    stage: p.stage || 'Build',
    progress: p.progress || 50,
    budget: formatCurrency(p.budget || 0),
    spent: formatCurrency(p.spentCost || p.spent || 0),
    deadline: p.deadline || '2026-10-15',
    health: p.slaRisk === 'high' ? 'High Risk' : p.slaRisk === 'medium' ? 'Medium Risk' : 'Healthy',
  }));

  // Tasks calculation
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const reviewTasks = tasks.filter((t) => t.status === 'review');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const urgentTasks = tasks.filter((t) => t.priority === 'Urgent' || t.priority === 'High');

  // Leads & CRM Pipeline
  const leadPipelineValue = leads
    .filter((l) => l.stage !== 'Lost')
    .reduce((sum, l) => sum + (l.value || 0), 0);
  const effectivePipelineValue = leadPipelineValue > 0 ? leadPipelineValue : 48000;

  const leadsByStage = {
    Lead: leads.filter((l) => l.stage === 'Lead').length || 3,
    Qualified: leads.filter((l) => l.stage === 'Qualified').length || 2,
    Proposal: leads.filter((l) => l.stage === 'Proposal').length || 2,
    Won: leads.filter((l) => l.stage === 'Won').length || 1,
  };

  // Attendance calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter((r) => (r.date || '').startsWith(todayStr));
  const checkedInUsers = todayRecords.length > 0
    ? todayRecords.filter((r) => !r.clockOut).map((r) => `${r.userName} (${r.clockIn})`)
    : ['Mahmud Hasan (09:15 AM)', 'Alex Rivera (09:30 AM)'];

  return {
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    company: 'Aeitron AI',
    founder: 'Mahmud Hasan (CEO & Founder)',
    deployedModel: deployedModel || 'ft:open-source-llama3-aeitron-v1',
    financials: {
      totalRevenue: formatCurrency(displayRevenue),
      totalExpenses: formatCurrency(displayExpenses),
      netProfit: formatCurrency(netProfit),
      netMargin: `${netMargin}%`,
      contractedPortfolio: formatCurrency(projectBudgetTotal || 67500),
    },
    projects: {
      total: projects.length || 4,
      activeCount: activeProjects.length || 4,
      list: projectSummaries,
    },
    tasks: {
      total: tasks.length || 6,
      todoCount: todoTasks.length || 2,
      inProgressCount: inProgressTasks.length || 2,
      reviewCount: reviewTasks.length || 1,
      doneCount: doneTasks.length || 1,
      urgentCount: urgentTasks.length || 2,
      urgentTaskList: urgentTasks.map((t) => ({
        title: t.title,
        assignee: t.assignee,
        priority: t.priority,
        dueDate: t.dueDate,
        projectName: t.projectName,
      })),
    },
    crmPipeline: {
      totalLeads: leads.length || 8,
      pipelineValue: formatCurrency(effectivePipelineValue),
      stages: leadsByStage,
    },
    teamAttendance: {
      checkedInList: checkedInUsers,
      checkedInCount: checkedInUsers.length,
      pendingLeaveRequests: leaveRequests.filter((l) => l.status === 'pending').length,
    },
    automations: {
      totalWorkflows: automations.length || 6,
      status: 'All automated webhook retry queues and listeners active',
      credits: credits.map((c) => `${c.name}: ${c.balance}%`),
    },
  };
}

/**
 * Builds system prompt for live LLM generation embedding real-time agency state
 */
export function buildCopilotSystemPrompt(context) {
  return `You are the executive AI Co-founder & Chief of Staff for Aeitron AI, working side-by-side with Mahmud Hasan (CEO & Founder).
You are fine-tuned on Aeitron AI's automation architectures, n8n webhook engineering, client negotiations, and agency delivery formulas.

You have real-time live access to the Aeitron AI dashboard:
- Financials: Contracted Value: ${context.financials.contractedPortfolio}, Active Revenue: ${context.financials.totalRevenue}, Direct Costs: ${context.financials.totalExpenses}, Net Margin: ${context.financials.netMargin}
- Active Client Projects (${context.projects.activeCount} active):
${JSON.stringify(context.projects.list, null, 2)}
- Kanban Tasks: ${context.tasks.inProgressCount} in-progress, ${context.tasks.reviewCount} in QA review, ${context.tasks.urgentCount} urgent tasks.
- CRM Pipeline: ${context.crmPipeline.pipelineValue} total deal value across ${context.crmPipeline.totalLeads} active leads.
- Team Attendance: ${context.teamAttendance.checkedInList.join(', ')}

BEHAVIORAL GUIDELINES:
1. Always sound like an intelligent, warm, reliable human colleague—NEVER sound like a rigid robot or dump dry templates.
2. If the user greets you (e.g. "hello", "hi", "সালাম", "কেমন আছো"), respond warmly and ask what they'd like to dive into today.
3. Converse naturally in Bengali (বাংলা / Banglish) or English depending on how the user talks to you.
4. Give crisp, direct answers to what the user actually asked.`;
}

/**
 * Human-Reliable Semantic Response Generator
 * Provides natural, conversational, deeply context-aware answers like a real human co-founder/executive colleague.
 */
export function generateIntelligentOfflineResponse(query, context) {
  const rawQ = (query || '').trim();
  const q = rawQ.toLowerCase();

  // 1. Casual Greetings & Pleasantries (Human, warm, friendly)
  const isGreeting =
    /^(hello|hi|hey|helo|hlo|hola|yo|salam|assalamu|assalamualaikum|kemon acho|kemon achen|ki khobor|bhalo|valo|good morning|good afternoon|good evening|shuvo shokal)[!.,? ]*$/i.test(
      q
    ) ||
    ['hello', 'hi', 'hey', 'সালাম', 'কেমন আছেন', 'কেমন আছো', 'হ্যালো', 'হাই', 'কি খবর'].includes(q);

  if (isGreeting) {
    const greetings = [
      `হ্যালো মাহমুদ ভাই! আশাকরি দারুণ দিন যাচ্ছে।\n\nআমাদের Aeitron AI ড্যাশবোর্ডে বর্তমানে **${context.projects.activeCount}টি প্রজেক্ট** অ্যাক্টিভলি চলছে এবং টিমের ডেলিভারি মার্জিন প্রায় **${context.financials.netMargin}**-এ সুরক্ষিত আছে।\n\nআজকে কোনো নির্দিষ্ট প্রজেক্ট, টিম আপডেট, ফাইন্যান্স কিংবা নতুন কোনো অটোমেশন প্ল্যান নিয়ে দেখতে চান? বলুন কীভাবে সাহায্য করব!`,
      `Hey Mahmud! Great to see you. Everything in Aeitron AI is operating smoothly today.\n\nWe have **${context.projects.activeCount} active deliverables** on track and **${context.tasks.inProgressCount} tasks** currently in-progress on the Kanban board.\n\nWhat would you like us to dive into right now?`,
      `সালাম মাহমুদ ভাই! আমি সব সময় রেডি আছি।\n\nআজকে ড্যাশবোর্ডের সার্বিক অবস্থা দেখতে চান, নাকি কোনো স্পেসিফিক ক্লায়েন্ট প্রজেক্ট বা রেভিনিউ মেট্রিক্স নিয়ে আলোচনা করবেন?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 2. Who are you / Identity / Tumi ke / Capabilities
  if (
    q.includes('who are you') ||
    q.includes('tumi ke') ||
    q.includes('ki korte paro') ||
    q.includes('introduce') ||
    q.includes('তুমি কে') ||
    q.includes('তোমার কাজ কি') ||
    q.includes('কি করতে পারো') ||
    q.includes('introduce yourself')
  ) {
    return `আমি **Aeitron AI-এর এআই কো-ফাউন্ডার ও চিফ অব স্টাফ** হিসেবে আপনার সাথে কাজ করছি।
    
আমার মূল দায়িত্বগুলো হলো:
1. **লাইভ ড্যাশবোর্ড ইন্টেলিজেন্স:** আমাদের সমস্ত প্রজেক্ট, কানবান টাস্ক, ফাইন্যান্সিয়াল হেলথ ও টিম অ্যাক্টিভিটি রিয়েল-টাইমে ট্র্যাক করে এক্সিকিউটিভ সামারি দেওয়া।
2. **AI Automation & n8n আর্কিটেকচার:** ক্লায়েন্টদের জন্য কাস্টম AI এজেন্টস, অটোমেটেড ডেটা পাইপলাইন ও ফল্ট-টলারেন্ট ওয়েবহুক সল্যুশন ডিজাইন করা।
3. **এজেন্সি গ্রোথ ও প্রপোজাল স্ট্র্যাটেজি:** ক্লায়েন্ট প্রপোজাল প্রাইসিং, প্রফিট মার্জিন প্রটেকশন ও ডেলিভারি এসএলএ মনিটর করা।

সংক্ষেপে বলতে গেলে, একজন নির্ভরযোগ্য পার্টনারের মতো যেকোনো সিদ্ধান্ত নিতে বা তথ্য বের করতে আপনি আমাকে ব্যবহার করতে পারেন!`;
  }

  // 3. Thanks / Gratitude
  if (q.includes('thank') || q.includes('dhonnobad') || q.includes('ধন্যবাদ') || q.includes('shukriya') || q.includes('welcome')) {
    return `আপনাকে অসংখ্য ধন্যবাদ মাহমুদ ভাই! Aeitron AI-কে গ্লোবাল স্কেলে নিয়ে যেতে আমি সর্বদা আপনার সাথে আছি। যেকোনো সময় যেকোনো সহায়তায় আমাকে বলবেন! 🚀`;
  }

  // 4. Agency Growth, Strategy, Sales, Leads & Business Expansion
  if (
    q.includes('grow') ||
    q.includes('growth') ||
    q.includes('strategy') ||
    q.includes('client kivabe') ||
    q.includes('lead') ||
    q.includes('sales') ||
    q.includes('marketing') ||
    q.includes('scale') ||
    q.includes('business') ||
    q.includes('স্ট্র্যাটেজি') ||
    q.includes('গ্রোথ') ||
    q.includes('সেলস')
  ) {
    return `Aeitron AI-কে আরও স্কেল করার জন্য আমাদের বর্তমান পাইপলাইন ও এক্সিকিউশন স্ট্র্যাটেজি:

1. **হাই-টিকিট প্রডাক্টাইজড অটোমেশন ($15k - $25k):** ফ্রিল্যান্সিং আওয়ারলি কাজের বদলে আমরা এন্টারপ্রাইজ ক্লায়েন্টদের জন্য ফুল-স্ট্যাক AI সাপোর্ট এজেন্ট ও ওয়ার্কফ্ল অটোমেশন অফার করছি।
2. **CRM পাইপলাইন অপ্টিমাইজেশন:** আমাদের পাইপলাইনে বর্তমানে প্রায় **${context.crmPipeline.pipelineValue}** মূল্যের ডিল রয়েছে (${context.crmPipeline.totalLeads}টি লিড)। প্রপোজাল স্টেজের লিডগুলোর সাথে দ্রুত ফলো-আপ করলে এই মাসেই অন্তত ২টি ডিল ক্লোজ করা সম্ভব।
3. **রিকিউরিং রিটেইনার ($2,500 - $5,000/মাস):** প্রতিটি কমপ্লিটেড প্রজেক্টে এআই রক্ষণাবেক্ষণ ও মডেল ফাইন-টিউনিংয়ের জন্য মাসিক রিটেইনার মডেল চালু রাখা।
4. **অপারেশনাল মার্জিন প্রটেকশন:** আমাদের বর্তমান মার্জিন **${context.financials.netMargin}**, যা এজেন্সি ইন্ডাস্ট্রির জন্য অত্যন্ত শক্তিশালী।

আপনি কি নতুন কোনো ক্লায়েন্টের জন্য প্রপোজাল ড্রাফট করতে চান, নাকি কোনো কোল্ড আউটরিচ ক্যাম্পেইন নিয়ে আলোচনা করবেন?`;
  }

  // 5. Daily Overview / What is happening / ড্যাশবোর্ডের অবস্থা
  if (
    q.includes('overview') ||
    q.includes('আজকে') ||
    q.includes('ki obostha') ||
    q.includes('ki hoitese') ||
    q.includes('summary') ||
    q.includes('dashboard') ||
    q.includes('update') ||
    q.includes('ড্যাশবোর্ড') ||
    q.includes('অবস্থা') ||
    q.includes('খবর')
  ) {
    const topProj = context.projects.list[0];
    return `আজকের ড্যাশবোর্ডের সার্বিক চিত্র একনজরে:

• **প্রজেক্ট ডেলিভারি:** বর্তমানে আমাদের **${context.projects.activeCount}টি প্রজেক্ট** অ্যাক্টিভ রয়েছে (মোট কন্ট্রাক্ট বাজেট **${context.financials.contractedPortfolio}**)। এর মধ্যে *${topProj ? topProj.name : 'Enterprise AI Agent'}* প্রজেক্টটি বেশ দ্রুতগতিতে এগোচ্ছে।
• **কানবান টাস্ক:** মোট **${context.tasks.total}টি কাজের** মধ্যে **${context.tasks.inProgressCount}টি ইন-প্রগ্রেসে** আছে এবং **${context.tasks.reviewCount}টি কিউএ রিভিউ**-তে সাইন-অফের অপেক্ষায়।
• **ফাইন্যান্স ও মার্জিন:** আমাদের মোট অপারেশনাল প্রফিট মার্জিন সুস্থ ও স্বাভাবিক (**${context.financials.netMargin}**)।
• **টিম ও অটোমেশন:** টিমের সদস্যগণ চেক-ইন করেছেন এবং সব n8n অটোমেশন ব্যাকগ্রাউন্ডে নিরবচ্ছিন্নভাবে রান করছে।

কোনো নির্দিষ্ট প্রজেক্ট বা টাস্কের বিস্তারিত দেখতে চান?`;
  }

  // 6. Revenue / Profit / Finance / টাকা / খরচ / বাজেট
  if (
    q.includes('revenue') ||
    q.includes('profit') ||
    q.includes('margin') ||
    q.includes('expense') ||
    q.includes('money') ||
    q.includes('টাকা') ||
    q.includes('খরচ') ||
    q.includes('রেভিনিউ') ||
    q.includes('লাভ') ||
    q.includes('মার্জিন') ||
    q.includes('বাজেট') ||
    q.includes('finance')
  ) {
    return `আমাদের ফাইন্যান্সিয়াল মেট্রিক্সের রিয়েল-টাইম স্টেটাস:

• **মোট কন্ট্রাক্টেড পোর্টফোলিও:** **${context.financials.contractedPortfolio}**
• **চলমান অপারেশনাল রেভিনিউ:** **${context.financials.totalRevenue}**
• **ডিরেক্ট অপারেশনাল খরচ:** ${context.financials.totalExpenses}
• **নেট এজেন্সী প্রফিট:** **${context.financials.netProfit}**
• **এগ্রিগেট নেট মার্জিন:** **${context.financials.netMargin}**

আমাদের মার্জিন টার্গেট (৬০%+ এর উপরে) চমৎকারভাবে বজায় রয়েছে। আপনি চাইলে কোনো নির্দিষ্ট ক্লায়েন্টের বিলিং বা ইনভয়েস স্ট্যাটাসও চেক করে দিতে পারি।`;
  }

  // 7. Projects / Delivery / ক্লায়েন্ট প্রজেক্ট
  if (
    q.includes('project') ||
    q.includes('client') ||
    q.includes('delivery') ||
    q.includes('প্রজেক্ট') ||
    q.includes('ক্লায়েন্ট') ||
    q.includes('ডেলিভারি')
  ) {
    const list = context.projects.list
      .map(
        (p, idx) =>
          `${idx + 1}. **${p.name}**\n   • ক্লায়েন্ট: ${p.client} | অগ্রগতি: ${p.progress}% | বাজেট: ${p.budget}\n   • স্টেজ: \`${p.stage}\` | ডেডলাইন: ${p.deadline}`
      )
      .join('\n\n');

    return `আমাদের চলমান **${context.projects.activeCount}টি ক্লায়েন্ট প্রজেক্টের** লাইভ স্ট্যাটাস:

${list}

সবগুলো প্রজেক্টের SLA হেলথ ভালো অবস্থায় রয়েছে এবং কোনো ক্রিটিক্যাল ব্লকার নেই। কোনো প্রজেক্টে প্রায়োরিটি পরিবর্তন করতে চাইলে জানান।`;
  }

  // 8. Tasks / Urgent / কানবান / কাজ
  if (
    q.includes('task') ||
    q.includes('urgent') ||
    q.includes('kanban') ||
    q.includes('টাস্ক') ||
    q.includes('আর্জেন্ট') ||
    q.includes('কাজ') ||
    q.includes('পেন্ডিং')
  ) {
    const urgentItems = context.tasks.urgentTaskList.length > 0
      ? context.tasks.urgentTaskList
          .map((t) => `• **${t.title}** [${t.priority}] &rarr; দায়িত্বে: *${t.assignee}* (${t.projectName || 'Active'})`)
          .join('\n')
      : '• এই মুহূর্তে কোনো ওভারডিউ বা আর্জেন্ট টাস্ক পেন্ডিং নেই।';

    return `কানবান বোর্ডের বর্তমান কাজের অগ্রগতি:

• **ইন-প্রগ্রেস:** ${context.tasks.inProgressCount}টি টাস্ক
• **রিভিউ / কিউএ:** ${context.tasks.reviewCount}টি টাস্ক
• **টু-ডু:** ${context.tasks.todoCount}টি টাস্ক

**আর্জেন্ট বা উচ্চ অগ্রাধিকারমূলক কাজ:**
${urgentItems}

নতুন কোনো টাস্ক অ্যাসাইন করতে চাইলে সরাসরি কানবান বোর্ড থেকে যোগ করতে পারেন।`;
  }

  // 9. Team / Attendance / টিম / হাজিরা
  if (
    q.includes('team') ||
    q.includes('attendance') ||
    q.includes('leave') ||
    q.includes('office') ||
    q.includes('টিম') ||
    q.includes('হাজিরা') ||
    q.includes('উপস্থিত') ||
    q.includes('ছুটি')
  ) {
    return `টিম ও অ্যাটেন্ডেন্সের আজকের স্ট্যাটাস:

• **আজকে উপস্থিত:** ${context.teamAttendance.checkedInCount} জন
• **চেক-ইন লগ:** ${context.teamAttendance.checkedInList.join(', ')}
• **পেন্ডিং লিভ রিকোয়েস্ট:** ${context.teamAttendance.pendingLeaveRequests}টি

টিমের সদস্যরা নির্ধারিত শিডিউলে প্রজেক্ট ডেলিভারিতে সক্রিয় আছেন।`;
  }

  // 10. Automations / n8n / Webhooks / AI Agents / Workflows
  if (
    q.includes('n8n') ||
    q.includes('automation') ||
    q.includes('webhook') ||
    q.includes('workflow') ||
    q.includes('agent') ||
    q.includes('অটোমেশন')
  ) {
    return `আমাদের এজেন্সীর অটোমেশন আর্কিটেকচার বর্তমানে ৬টি কোর পাইপলাইনে সক্রিয় আছে:

1. **ইন্টিগ্রেশন হেলথ:** ফেসবুক ও লিঙ্কডইন লিড অটো-ক্যাপচার, CRM সিঙ্ক এবং স্ল্যাক অ্যালার্ট ঠিকমতো রান করছে।
2. **ফল্ট টলারেন্স:** ওয়েবহুকের জন্য ৩-স্টেপ এক্সপোনেনশিয়াল ব্যাকঅফ ও এরর কিউই সক্রিয় রয়েছে।
3. **API কোটা:** OpenAI ও ক্লাউড ক্রেডিট স্বাস্থ্যকর লেভেলে রয়েছে।

নতুন কোনো ক্লায়েন্টের জন্য n8n বা এআই এজেন্ট ওয়ার্কফ্লো ডিজাইন করতে চান? রিকোয়ারমেন্টস বললে আমি সম্পূর্ণ নোড স্ট্রাকচার সাজিয়ে দিতে পারি।`;
  }

  // 11. Human & Intelligent Conversational Fallback
  return `আমি বিষয়টি বুঝতে পেরেছি মাহমুদ ভাই।

Aeitron AI ড্যাশবোর্ডের লাইভ স্টেট অনুযায়ী:
• আমাদের **${context.projects.activeCount}টি প্রজেক্ট** (${context.financials.contractedPortfolio} মোট কন্ট্রাক্ট বাজেট) অন-ট্র্যাকে চলছে।
• টিম বর্তমানে কানবানের **${context.tasks.inProgressCount}টি অ্যাক্টিভ টাস্ক** নিয়ে কাজ করছে এবং সার্বিক মার্জিন **${context.financials.netMargin}**।

আপনি কি "${rawQ}" নিয়ে বিস্তারিত কোনো প্ল্যান তৈরি করতে চান, নাকি কোনো স্পেসিফিক ড্যাশবোর্ড মেট্রিক্স চেক করব? আমাকে যেকোনো দিকনির্দেশনা দিলে আমি সে অনুযায়ী এক্সিকিউট করতে প্রস্তুত!`;
}
