const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Fake news detection endpoint
app.post('/api/detect-fake-news', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `You are an expert fake news detector. Analyze the following news text and determine if it's REAL or FAKE news.

Please provide:
1. Your verdict: "REAL" or "FAKE"
2. Confidence score (0-100%)
3. Brief explanation of your reasoning

News text to analyze:
"${text}"

Response format:
Verdict: [REAL/FAKE]
Confidence: [0-100]%
Explanation: [Your reasoning]`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the response
    const verdictMatch = response.match(/Verdict:\s*(REAL|FAKE)/i);
    const confidenceMatch = response.match(/Confidence:\s*(\d+)%/);
    const explanationMatch = response.match(/Explanation:\s*(.*)/s);

    const result = {
      verdict: verdictMatch ? verdictMatch[1].toUpperCase() : 'UNKNOWN',
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 0,
      explanation: explanationMatch ? explanationMatch[1].trim() : response,
      rawResponse: response
    };

    res.json(result);

  } catch (error) {
    console.error('Error detecting fake news:', error);
    res.status(500).json({ 
      error: 'Failed to analyze the news text',
      details: error.message 
    });
  }
});

// Chat endpoint for general fake news questions
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are FakeSpotter AI, an expert in fake news detection and media literacy. You help users understand how to identify misinformation, explain why certain news might be fake or real, and provide educational insights about media credibility. Always be helpful, accurate, and educational in your responses.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    res.json({ response });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Groq API connected and ready!`);
});
