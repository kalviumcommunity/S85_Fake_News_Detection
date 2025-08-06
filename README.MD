# 🧠 FakeSpotter LLM

**A fine-tuned large language model trained to detect fake news by analyzing headlines and article content.**

---

## 🚀 Project Overview

Misinformation spreads faster than facts — especially in the age of deepfakes and AI-generated text.  
This project builds a fine-tuned LLM capable of determining whether a given news item is **real or fake**, with optional explanation.

Use cases include:
- News aggregation apps
- Browser extensions
- Journalistic tools
- Education & public awareness

---

## 🔍 Features

- 🧠 Classifies news as **REAL** or **FAKE**
- 💬 Optional chain-of-thought explanation
- 🔎 Accepts headlines or full articles
- 🧾 Trained on real/fake news datasets
- 🌐 API-ready for frontend integration

---

## 🧩 Tech Stack

- **Model**: Mistral 7B / LLaMA 2 / GPT-J (LoRA-fine-tuned)
- **Training Framework**: Hugging Face Transformers + PEFT
- **Data**: Combined real and fake news datasets
- **Backend API**: FastAPI or Express.js
- **Frontend (optional)**: React for demo/testing

---

## 🧠 Training Details

### ✅ Dataset Sources:
- LIAR Dataset (Politifact)
- FakeNewsNet
- Kaggle Fake News Corpus
- Custom AI-generated headlines

### 🧪 Model Training:
- Base model: `mistralai/Mistral-7B-Instruct-v0.2`
- Fine-tuned using LoRA (low-rank adaptation)
- Chain-of-thought style examples to improve interpretability
- Trained on full articles and headlines separately

---

## 📦 Installation

```bash
git clone https://github.com/kalviumcommunity/S85_Fake_News_Detection
cd fake-news-spotter-llm
pip install -r requirements.txt
