const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are an expert financial market analyst specializing in Gold, Cryptocurrency, and Fiat markets. 

Provide concise, actionable analysis in English covering:
- Current market sentiment
- Key technical levels
- Fundamental drivers
- Risk factors

Always include a disclaimer that this is analysis, not financial advice.`;

async function quickAnalysis(query) {
  try {
    console.log("🔍 Analyzing market...\n");
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: query
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000
    });

    console.log("📊 Market Analysis:\n");
    console.log(completion.choices[0].message.content);
    console.log("\n" + "=".repeat(60));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const query = process.argv.slice(2).join(' ');
if (query) {
  quickAnalysis(query);
} else {
  console.log('Usage: node quick-analysis.js "What is the current outlook for Bitcoin?"');
  console.log('\nExample queries:');
  console.log('  - "Analyze gold price trends this week"');
  console.log('  - "What factors are affecting Bitcoin price?"');
  console.log('  - "Compare EUR/USD vs GBP/USD outlook"');
  console.log('  - "Should I buy Ethereum now?"');
}