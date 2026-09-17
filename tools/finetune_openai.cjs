/**
 * OpenAI Live Fine-Tuning Runner for Aeitron AI
 * 
 * Usage:
 *   node tools/finetune_openai.cjs [OPENAI_API_KEY]
 * 
 * Or set environment variable:
 *   set OPENAI_API_KEY=sk-...
 *   node tools/finetune_openai.cjs
 */

const fs = require('fs');
const path = require('path');

const apiKey = process.argv[2] || process.env.OPENAI_API_KEY || process.env.VITE_AI_API_KEY;

if (!apiKey) {
  console.error('\n❌ ERROR: OpenAI API Key is required.');
  console.log('Usage: node tools/finetune_openai.cjs sk-proj-YOUR_API_KEY\n');
  process.exit(1);
}

const datasetPath = path.join(__dirname, 'aeitron_finetune_dataset.jsonl');
if (!fs.existsSync(datasetPath)) {
  console.error(`❌ Dataset file not found at: ${datasetPath}`);
  process.exit(1);
}

async function runFineTuning() {
  console.log('\n🚀 Starting Aeitron AI Model Fine-Tuning Pipeline...');
  console.log(`📄 Dataset: ${datasetPath}`);

  // 1. Upload file
  console.log('\nStep 1: Uploading training dataset to OpenAI...');
  const fileContent = fs.readFileSync(datasetPath);
  const blob = new Blob([fileContent], { type: 'application/jsonlines' });
  const formData = new FormData();
  formData.append('purpose', 'fine-tune');
  formData.append('file', blob, 'aeitron_finetune_dataset.jsonl');

  const uploadRes = await fetch('https://api.openai.com/v1/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!uploadRes.ok) {
    const errText = await uploadRes.text();
    console.error(`❌ Upload failed (${uploadRes.status}):`, errText);
    process.exit(1);
  }

  const uploadData = await uploadRes.json();
  console.log(`✅ File uploaded successfully! File ID: ${uploadData.id}`);

  // 2. Wait for file validation
  console.log('\nStep 2: Verifying file status with OpenAI...');
  let fileReady = false;
  for (let i = 0; i < 10; i++) {
    const statusRes = await fetch(`https://api.openai.com/v1/files/${uploadData.id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const statusData = await statusRes.json();
    if (statusData.status === 'processed') {
      fileReady = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  // 3. Create Fine-Tuning Job
  console.log('\nStep 3: Creating fine-tuning job on base model: gpt-4o-mini-2024-07-18...');
  const jobPayload = {
    training_file: uploadData.id,
    model: 'gpt-4o-mini-2024-07-18',
    hyperparameters: {
      n_epochs: 3,
    },
    suffix: 'aeitron-v1',
  };

  const jobRes = await fetch('https://api.openai.com/v1/fine_tuning/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(jobPayload),
  });

  if (!jobRes.ok) {
    const errText = await jobRes.text();
    console.error(`❌ Job creation failed (${jobRes.status}):`, errText);
    process.exit(1);
  }

  const jobData = await jobRes.json();
  console.log(`\n🎉 Fine-Tuning Job Launched Successfully!`);
  console.log(`-----------------------------------------------`);
  console.log(`Job ID:      ${jobData.id}`);
  console.log(`Status:      ${jobData.status}`);
  console.log(`Base Model:  ${jobData.model}`);
  console.log(`Target Model: ft:${jobData.model}:aeitron-ai:aeitron-v1:xxxx`);
  console.log(`-----------------------------------------------`);
  console.log(`\n💡 To monitor progress, run:`);
  console.log(`curl https://api.openai.com/v1/fine_tuning/jobs/${jobData.id} -H "Authorization: Bearer YOUR_KEY"`);
  console.log(`\nOnce finished, copy the fine_tuned_model name and paste it into the Copilot model selector!`);
}

runFineTuning().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
