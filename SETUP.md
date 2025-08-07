# 🧠 FakeSpotter AI - Setup Instructions

## 🚀 Quick Start

### 1. Start Both Servers
Run the batch file to start both backend and frontend:
```bash
start-servers.bat
```

### 2. Manual Start (Alternative)

**Backend:**
```bash
cd backend
node server.js
```

**Frontend:**
```bash
cd client
npm run dev
```

## 🌐 Access URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔧 Features Implemented

### ✅ Backend (Express.js + Groq API)
- `/api/detect-fake-news` - Analyzes news for fake/real classification
- `/api/chat` - Chat with AI assistant about fake news
- `/api/health` - Health check endpoint

### ✅ Frontend (React + Vite)
- **News Detector Tab**: Paste news articles/headlines for analysis
- **Chat Assistant Tab**: Ask questions about fake news and media literacy
- Real-time analysis with confidence scores
- Beautiful UI with loading states and error handling

## 🤖 AI Integration
- **Model**: Groq's Llama3-8B-8192
- **API Key**: Already configured in backend/.env
- **Features**: 
  - Real/Fake classification
  - Confidence scoring
  - Detailed explanations
  - Media literacy chat assistant

## 📱 How to Use

### News Detection:
1. Go to "📰 News Detector" tab
2. Paste any news headline or article
3. Click "🔍 Analyze"
4. Get instant results with confidence score and explanation

### Chat Assistant:
1. Go to "💬 Chat Assistant" tab
2. Ask questions like:
   - "How can I spot fake news?"
   - "What are red flags in news articles?"
   - "Explain this news story to me"
3. Get educational responses about media literacy

## 🔄 Next Steps
1. Test the current setup
2. Add more sophisticated prompts
3. Implement user history
4. Add news source verification
5. Create custom model training pipeline

---

**Ready to detect fake news with AI! 🎯**
