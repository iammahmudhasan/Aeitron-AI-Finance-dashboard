"""
Aeitron AI Open-Source Model Fine-Tuning Script (Unsloth + Meta Llama 3 8B)
Run this script locally with an NVIDIA GPU or in a free Google Colab notebook (T4 GPU).

Requirements:
  pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
  pip install --no-deps "xformers<0.0.27" trl peft accelerate bitsandbytes
"""

import os
from unsloth import FastLanguageModel
import torch
from datasets import load_dataset
from trl import SFTTrainer
from transformers import TrainingArguments

# 1. Configuration
MAX_SEQ_LENGTH = 2048
DTYPE = None # None for auto detection. Float16 for Tesla T4, V100, Bfloat16 for Ampere+
LOAD_IN_4BIT = True # Use 4bit quantization to reduce memory usage

# Base open-source model
MODEL_NAME = "unsloth/llama-3-8b-Instruct-bnb-4bit"

print(f"--> Loading base model: {MODEL_NAME}")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name=MODEL_NAME,
    max_seq_length=MAX_SEQ_LENGTH,
    dtype=DTYPE,
    load_in_4bit=LOAD_IN_4BIT,
)

# 2. Add LoRA Adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=16, # Suggested 8, 16, 32, 64
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0, # Optimized 0
    bias="none",    # Optimized "none"
    use_gradient_checkpointing="unsloth", # 60% less VRAM
    random_state=3407,
)

# 3. Format Dataset for Llama-3 Chat Template
dataset_file = "tools/aeitron_finetune_dataset.jsonl"
print(f"--> Loading Aeitron dataset from: {dataset_file}")

dataset = load_dataset("json", data_files=dataset_file, split="train")

def formatting_prompts_func(examples):
    convos = examples["messages"]
    texts = [tokenizer.apply_chat_template(convo, tokenize=False, add_generation_prompt=False) for convo in convos]
    return {"text": texts}

dataset = dataset.map(formatting_prompts_func, batched=True)

# 4. Train the Model
print("--> Initializing SFTTrainer...")
trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,
    dataset_text_field="text",
    max_seq_length=MAX_SEQ_LENGTH,
    dataset_num_proc=2,
    packing=False, # Can speed up training for short sequences
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        warmup_steps=5,
        max_steps=60, # 2-3 epochs on dataset
        learning_rate=2e-4,
        fp16=not torch.cuda.is_bf16_supported(),
        bf16=torch.cuda.is_bf16_supported(),
        logging_steps=1,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="linear",
        seed=3407,
        output_dir="outputs",
    ),
)

print("--> Starting LoRA fine-tuning run...")
trainer_stats = trainer.train()

# 5. Save Model & Export for Ollama
OUTPUT_DIR = "aeitron-llama3-finetuned"
print(f"--> Saving fine-tuned LoRA weights to: {OUTPUT_DIR}")
model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

# Export to GGUF format for Ollama
print("--> Exporting to GGUF (q4_k_m) for Ollama deployment...")
try:
    model.save_pretrained_gguf("aeitron-llama3-q4", tokenizer, quantization_method="q4_k_m")
    print("✅ GGUF exported! You can now run with Ollama:")
    print("   ollama create aeitron-ai -f Modelfile")
    print("   ollama run aeitron-ai")
except Exception as e:
    print(f"Note: GGUF export requires llama.cpp: {e}")

print("🎉 Fine-tuning pipeline complete!")
