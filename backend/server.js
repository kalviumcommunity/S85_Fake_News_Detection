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

// Fake news detection endpoint with multishot prompting
app.post('/api/detect-fake-news', async (req, res) => {
  try {
    const { text, examples = [] } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Multishot prompt with examples
    let prompt = `You are an expert fake news detector. I'll provide you with examples of how to analyze news, then you'll analyze a new piece.

EXAMPLE 1:
News: "Scientists discover that eating chocolate daily makes you live 200 years longer"
Analysis:
- Verdict: FAKE
- Confidence: 95%
- Reasoning: Extraordinary longevity claims without peer review, no credible sources cited, contradicts established medical knowledge

EXAMPLE 2:
News: "Local mayor announces new infrastructure budget approved by city council"
Analysis:
- Verdict: REAL
- Confidence: 85%
- Reasoning: Factual government announcement, specific details, verifiable through official channels

EXAMPLE 3:
News: "Tech company reports quarterly earnings beat analyst expectations"
Analysis:
- Verdict: REAL
- Confidence: 90%
- Reasoning: Standard business news, specific financial data, verifiable through SEC filings`;

    // Add user-provided examples if any
    if (examples.length > 0) {
      examples.forEach((example, index) => {
        prompt += `\n\nEXAMPLE ${4 + index}:
News: "${example.text}"
Analysis:
- Verdict: ${example.verdict}
- Confidence: ${example.confidence}%
- Reasoning: ${example.reasoning}`;
      });
    }

    prompt += `\n\nNow analyze this news:
"${text}"

Provide your analysis in the same format:
- Verdict: [REAL/FAKE]
- Confidence: [0-100]%
- Reasoning: [Your detailed analysis]`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.2,
      max_tokens: 800,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the response
    const verdictMatch = response.match(/Verdict:\s*(REAL|FAKE)/i);
    const confidenceMatch = response.match(/Confidence:\s*(\d+)%/);
    const reasoningMatch = response.match(/Reasoning:\s*(.*)/s);

    const result = {
      verdict: verdictMatch ? verdictMatch[1].toUpperCase() : 'UNKNOWN',
      confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 0,
      reasoning: reasoningMatch ? reasoningMatch[1].trim() : response,
      rawResponse: response,
      multishotUsed: examples.length > 0
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
