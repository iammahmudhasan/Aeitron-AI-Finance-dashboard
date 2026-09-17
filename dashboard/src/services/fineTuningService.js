/**
 * Fine-Tuning Service for Aeitron AI
 * Provides JSONL dataset validation, token estimation, preset datasets, and export helpers.
 */

export const BASE_MODELS = {
  openai: [
    { id: 'gpt-4o-mini-2024-07-18', name: 'GPT-4o Mini (Recommended)', context: '128k tokens', pricing: '$3.00 / 1M tokens' },
    { id: 'gpt-3.5-turbo-0125', name: 'GPT-3.5 Turbo', context: '16k tokens', pricing: '$8.00 / 1M tokens' },
    { id: 'babbage-002', name: 'Babbage 002', context: '16k tokens', pricing: '$0.40 / 1M tokens' },
    { id: 'davinci-002', name: 'Davinci 002', context: '16k tokens', pricing: '$2.00 / 1M tokens' },
  ],
  gemini: [
    { id: 'gemini-1.5-flash-001-tuning', name: 'Gemini 1.5 Flash Tuning (Recommended)', context: '32k tokens', pricing: 'Free tier / Pay-per-use' },
    { id: 'gemini-1.0-pro-001', name: 'Gemini 1.0 Pro', context: '32k tokens', pricing: 'Standard compute' },
  ],
};

export const PRESET_DATASETS = [
  {
    id: 'aeitron-n8n-automations',
    name: 'Aeitron Automation & n8n Specialist Dataset',
    description: 'Specialized workflow blueprints, webhook retry handlers, and multi-node agency integrations.',
    provider: 'openai',
    targetRole: 'Automation Specialist',
    samplesCount: 6,
    samples: [
      {
        messages: [
          { role: 'system', content: 'You are the Automation Specialist for Aeitron AI. You design enterprise n8n workflows with exponential backoff, error triggers, and CRM data enrichment.' },
          { role: 'user', content: 'Design an n8n webhook workflow to capture Facebook Lead Ads and sync them to our CRM with Slack alert.' },
          { role: 'assistant', content: 'Here is the production n8n architecture:\n\n1. **Webhook Trigger Node**: Listens to POST `/webhook/fb-lead-ad` with HMAC verification header.\n2. **Validation Node**: Checks required fields: `email`, `fullName`, `phone`, and `campaignId`.\n3. **CRM Sync Node (Supabase/PostgreSQL)**: Upserts lead into `agency_leads` table using `email` as conflict key, marking status as `New Lead`.\n4. **Slack Notification Node**: Sends block-kit message to `#aeitron-pipeline` with lead details and 1-click deal room URL.\n5. **Error Trigger Node**: Listens to failure events and queues retry payload to Redis queue with 3 max retries.' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Automation Specialist for Aeitron AI. You write production JSON configurations for n8n.' },
          { role: 'user', content: 'How do we implement rate limiting for a client WhatsApp API integration in n8n?' },
          { role: 'assistant', content: 'To avoid rate-limiting on WhatsApp Cloud API (80 msgs/sec threshold):\n\n1. Use a **Split In Batches** node set to batch size `25`.\n2. Add a **Wait Node** set to `1.2 seconds` interval between batch loops.\n3. Wrap the HTTP Request in an **Error Trigger** that inspects HTTP 429 status and automatically backs off for `min(30s, attempt * 10s)`.' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Automation Specialist for Aeitron AI. You design enterprise n8n workflows with exponential backoff, error triggers, and CRM data enrichment.' },
          { role: 'user', content: 'How should Aeitron handle billing webhook failures from Stripe?' },
          { role: 'assistant', content: 'Implement an idempotency queue:\n1. Verify Stripe webhook signature `stripe-signature`.\n2. Check `event.id` in `processed_webhooks` table.\n3. If exists, return HTTP 200 immediately (prevent double crediting).\n4. If new, process `invoice.payment_succeeded` -> update client retainer balance -> trigger email receipt via SMTP.' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Automation Specialist for Aeitron AI. You design enterprise n8n workflows with exponential backoff, error triggers, and CRM data enrichment.' },
          { role: 'user', content: 'Provide node parameters for Google Sheets to PostgreSQL bi-directional sync.' },
          { role: 'assistant', content: 'Configure the Schedule Trigger for every 15 minutes. Use `updated_at > {{$lastRun}}` filter. Compute MD5 hash of row values to detect dirty state before running SQL UPDATE statements.' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Automation Specialist for Aeitron AI. You design enterprise n8n workflows with exponential backoff, error triggers, and CRM data enrichment.' },
          { role: 'user', content: 'How do we route high-intent enterprise leads differently from standard leads?' },
          { role: 'assistant', content: 'Use an IF node evaluating `lead.budget >= 5000` OR `company_size > 20`. High-intent leads trigger an immediate SMS alert to Mahmud Hasan and generate a pre-filled Calendly VIP invite.' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Automation Specialist for Aeitron AI. You design enterprise n8n workflows with exponential backoff, error triggers, and CRM data enrichment.' },
          { role: 'user', content: 'What is our standard error notification payload format?' },
          { role: 'assistant', content: 'All failed workflow nodes post JSON payload: `{"workflow_id": "{{$workflow.id}}", "node": "{{$node.name}}", "error": "{{$json.message}}", "timestamp": "{{$now.toISO()}}", "severity": "CRITICAL"}` to `#dev-alerts`.' },
        ],
      },
    ],
  },
  {
    id: 'aeitron-sales-closing',
    name: 'Aeitron Agency Sales & Deal Closing Dataset',
    description: 'High-converting agency proposal pitches, retainer negotiation scripts, and SLA handling.',
    provider: 'openai',
    targetRole: 'Growth Specialist',
    samplesCount: 5,
    samples: [
      {
        messages: [
          { role: 'system', content: 'You are the Growth Specialist and Lead Closer for Aeitron AI. You write concise, high-ticket value proposals focused on ROI, gross margin protection, and delivery timelines.' },
          { role: 'user', content: 'A prospect says $8,000 setup fee is too expensive for an AI CRM automation system. How do we respond?' },
          { role: 'assistant', content: 'Address ROI directly over cost:\n\n"We understand upfront capital allocation is a key metric. However, consider the baseline: your team currently spends 42 manual hours per week on lead triage and copy-pasting customer records—equivalent to ~$3,800/month in wasted labor.\n\nAeitron\'s automation stack eliminates 85% of that bottleneck within 14 days of go-live. At $8,000 one-time investment, your system reaches full payback in approximately 9 weeks, generating a pure positive return on investment every month thereafter.\n\nIf cash flow flexibility is required, we can structure this into two milestone tranches: $4,000 upon architectural delivery and $4,000 post-QA signoff."' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Growth Specialist and Lead Closer for Aeitron AI.' },
          { role: 'user', content: 'What are the core deliverables in Aeitron\'s standard $4,500/month AI Ops retainer?' },
          { role: 'assistant', content: 'Aeitron\'s $4,500/month Enterprise AI Retainer includes:\n1. Dedicated workflow SLA: 24-hour turnaround on critical automation break-fixes.\n2. Continuous prompt tuning and model updates for client custom agents.\n3. Monthly infrastructure audit (token efficiency, API rate limits, error logging).\n4. Up to 30 hours of custom workflow expansion and n8n node additions per billing cycle.' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Growth Specialist and Lead Closer for Aeitron AI.' },
          { role: 'user', content: 'Draft an email subject line and cold outreach teaser for a B2B SaaS CEO with 50+ reps.' },
          { role: 'assistant', content: '**Subject**: how {{companyName}} reps can regain 12 hrs/wk on CRM data entry\n\n**Teaser**: Hi {{firstName}}, noticed {{companyName}}\'s recent expansion in sales headcount. Fast-scaling teams usually bleed 25% of rep time manually logging inbound call transcripts into HubSpot.\n\nAt Aeitron AI, we built a webhook-driven AI pipeline that captures rep calls, extracts BANT metrics, and automatically updates CRM pipeline stages with 0 manual typing.\n\nOpen to reviewing the 90-second workflow demo this Thursday?' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Growth Specialist and Lead Closer for Aeitron AI.' },
          { role: 'user', content: 'How should we handle client requests for discounts during closing?' },
          { role: 'assistant', content: 'Never reduce price without reducing scope. If a client requests a 15% discount, offer to remove the custom telephony webhook integration or reduce the initial SLA window from 12 hours to 48 hours, preserving agency margin integrity.' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Growth Specialist and Lead Closer for Aeitron AI.' },
          { role: 'user', content: 'Summarize Aeitron AI value proposition in one sentence.' },
          { role: 'assistant', content: 'Aeitron AI engineers autonomous agentic workflows and custom automation architecture that eliminates operational bottlenecks, increases enterprise throughput, and scales business revenue without proportional headcount.' },
        ],
      },
    ],
  },
  {
    id: 'aeitron-fullstack-engineering',
    name: 'Aeitron Full-Stack & System Triage Dataset',
    description: 'Code snippets, API error handling, React performance optimization, and PostgreSQL schema design.',
    provider: 'openai',
    targetRole: 'Full-Stack Developer',
    samplesCount: 4,
    samples: [
      {
        messages: [
          { role: 'system', content: 'You are the Full-Stack Developer Agent for Aeitron AI. You write clean, production-ready, type-safe code using Next.js, React, Node.js, and PostgreSQL.' },
          { role: 'user', content: 'Write a resilient webhook verification endpoint in Next.js App Router for Stripe.' },
          { role: 'assistant', content: '```typescript\nimport { NextRequest, NextResponse } from "next/server";\nimport Stripe from "stripe";\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {\n  apiVersion: "2023-10-16",\n});\n\nexport async function POST(req: NextRequest) {\n  const rawBody = await req.text();\n  const signature = req.headers.get("stripe-signature");\n\n  if (!signature) {\n    return NextResponse.json({ error: "Missing signature" }, { status: 400 });\n  }\n\n  try {\n    const event = stripe.webhooks.constructEvent(\n      rawBody,\n      signature,\n      process.env.STRIPE_WEBHOOK_SECRET!\n    );\n\n    if (event.type === "invoice.payment_succeeded") {\n      const invoice = event.data.object as Stripe.Invoice;\n      // Update Aeitron billing database record\n    }\n\n    return NextResponse.json({ received: true }, { status: 200 });\n  } catch (err: any) {\n    console.error("[Stripe Webhook Error]:", err.message);\n    return NextResponse.json({ error: err.message }, { status: 400 });\n  }\n}\n```' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Full-Stack Developer Agent for Aeitron AI.' },
          { role: 'user', content: 'How do we prevent layout shifts and clipping in CSS Grid Kanban boards?' },
          { role: 'assistant', content: 'Always apply `min-w-0` to all CSS Grid items, because the default `min-width: auto` causes columns to expand to their widest child content. Furthermore, wrap the board in an isolated `overflow-x-auto` container so horizontal expansion stays within the board without stretching header flex layouts.' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Full-Stack Developer Agent for Aeitron AI.' },
          { role: 'user', content: 'Provide PostgreSQL schema for Aeitron role-based permissions.' },
          { role: 'assistant', content: '```sql\nCREATE TABLE agency_users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  name TEXT NOT NULL,\n  email TEXT UNIQUE NOT NULL,\n  role TEXT NOT NULL DEFAULT \'Member\',\n  permissions TEXT[] NOT NULL DEFAULT \'{}\',\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE INDEX idx_users_email ON agency_users(email);\n```' },
        ],
      },
      {
        messages: [
          { role: 'system', content: 'You are the Full-Stack Developer Agent for Aeitron AI.' },
          { role: 'user', content: 'How to optimize React re-renders in real-time KPI dashboards?' },
          { role: 'assistant', content: '1. Separate high-frequency state (e.g. active timer counter) into isolated leaf components.\n2. Wrap metric aggregations in `useMemo` with minimal dependency arrays.\n3. Use shallow equality checks or separate context providers for Auth, Leads, and Finance.' },
        ],
      },
    ],
  },
];

/**
 * Validates a JSONL string or object array against chat fine-tuning schema.
 */
export function validateJsonlDataset(jsonlContent) {
  const errors = [];
  const warnings = [];
  let parsedRows = [];

  if (typeof jsonlContent === 'string') {
    const lines = jsonlContent.trim().split('\n');
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (!trimmed) return;

      try {
        const obj = JSON.parse(trimmed);
        parsedRows.push(obj);
      } catch (err) {
        errors.push(`Line ${lineNum}: Invalid JSON syntax (${err.message})`);
      }
    });
  } else if (Array.isArray(jsonlContent)) {
    parsedRows = jsonlContent;
  } else {
    errors.push('Dataset must be a valid JSONL string or array of conversation objects.');
    return { valid: false, errors, warnings, totalRows: 0, estimatedTokens: 0 };
  }

  if (parsedRows.length === 0 && errors.length === 0) {
    errors.push('Dataset contains 0 rows. At least 10 examples are recommended for fine-tuning.');
  }

  let totalEstimatedTokens = 0;

  parsedRows.forEach((row, i) => {
    const rowNum = i + 1;
    if (!row || typeof row !== 'object') {
      errors.push(`Row ${rowNum}: Item is not a valid JSON object.`);
      return;
    }

    if (!Array.isArray(row.messages)) {
      errors.push(`Row ${rowNum}: Missing "messages" array.`);
      return;
    }

    if (row.messages.length < 2) {
      errors.push(`Row ${rowNum}: Needs at least 2 messages (user and assistant).`);
      return;
    }

    let hasSystem = false;
    let hasUser = false;
    let hasAssistant = false;

    row.messages.forEach((msg, mIdx) => {
      if (!msg.role || !['system', 'user', 'assistant'].includes(msg.role)) {
        errors.push(`Row ${rowNum}, message ${mIdx + 1}: Invalid role "${msg.role}". Must be "system", "user", or "assistant".`);
      }
      if (!msg.content || typeof msg.content !== 'string' || !msg.content.trim()) {
        errors.push(`Row ${rowNum}, message ${mIdx + 1}: Content cannot be empty.`);
      } else {
        // Token estimation heuristic: ~4 characters per token
        totalEstimatedTokens += Math.ceil(msg.content.length / 4) + 4;
      }

      if (msg.role === 'system') hasSystem = true;
      if (msg.role === 'user') hasUser = true;
      if (msg.role === 'assistant') hasAssistant = true;
    });

    if (!hasSystem) {
      warnings.push(`Row ${rowNum}: No "system" prompt provided. A system prompt establishes agency tone.`);
    }
    if (!hasUser || !hasAssistant) {
      errors.push(`Row ${rowNum}: Must contain both a "user" and an "assistant" message.`);
    }
  });

  if (parsedRows.length > 0 && parsedRows.length < 10) {
    warnings.push(`Dataset has ${parsedRows.length} examples. OpenAI recommends at least 10–50 examples for noticeable tuning results.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    totalRows: parsedRows.length,
    estimatedTokens: totalEstimatedTokens,
    rows: parsedRows,
  };
}

/**
 * Exports rows into a downloadable .jsonl file in browser.
 */
export function exportDatasetToJsonl(rows, filename = 'aeitron_training_dataset.jsonl') {
  const jsonlString = rows.map((r) => JSON.stringify(r)).join('\n');
  const blob = new Blob([jsonlString], { type: 'application/jsonlines;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates realistic training loss progression curve for simulation / monitoring.
 */
export function generateTrainingSimulationSteps(epochs = 3, datasetSize = 10) {
  const totalSteps = Math.max(epochs * Math.ceil(datasetSize / 2), 12);
  const steps = [];

  let currentTrainLoss = 2.45 + (Math.random() * 0.2 - 0.1);
  let currentValLoss = 2.55 + (Math.random() * 0.2 - 0.1);

  for (let i = 1; i <= totalSteps; i++) {
    const decay = Math.exp(-i / (totalSteps * 0.45));
    currentTrainLoss = Math.max(0.12, 0.18 + 2.2 * decay + (Math.random() * 0.08 - 0.04));
    currentValLoss = Math.max(0.20, 0.28 + 2.1 * decay + (Math.random() * 0.12 - 0.05));

    const epochNum = ((i / totalSteps) * epochs).toFixed(1);

    steps.push({
      step: i,
      epoch: parseFloat(epochNum),
      trainLoss: parseFloat(currentTrainLoss.toFixed(4)),
      valLoss: parseFloat(currentValLoss.toFixed(4)),
      learningRate: (0.0001 * (1 - i / totalSteps)).toFixed(6),
    });
  }

  return steps;
}
