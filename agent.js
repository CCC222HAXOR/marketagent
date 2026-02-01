const Groq = require('groq-sdk');
const readline = require('readline');
const fs = require('fs');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const HISTORY_FILE = 'market-analysis-history.json';

// Load history
let chatHistory = [];
if (fs.existsSync(HISTORY_FILE)) {
  try {
    chatHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    console.log(`📂 Loaded ${chatHistory.length / 2} previous analysis sessions\n`);
  } catch (error) {
    console.log('⚠️  Starting fresh session\n');
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// System prompt for market specialist
const SYSTEM_PROMPT = `You are an expert financial market analyst specializing in:
- Gold (XAU/USD) market analysis
- Cryptocurrency markets (Bitcoin, Ethereum, altcoins)
- Fiat currency pairs and forex markets
- Macroeconomic factors affecting these markets
- Technical and fundamental analysis

Always respond in English. Provide:
1. Clear, data-driven analysis
2. Risk assessments when discussing trades
3. Key technical levels (support/resistance)
4. Fundamental factors affecting the market
5. Balanced perspective (bullish and bearish scenarios)

Important disclaimers:
- Always remind users that you provide analysis, not financial advice
- Encourage users to do their own research (DYOR)
- Mention that past performance doesn't guarantee future results
- Note that crypto markets are highly volatile

Format your responses professionally with clear structure.`;

async function chat() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  🏆 Market Analysis AI - Gold, Fiat & Crypto Specialist   ║");
  console.log("║                                                            ║");
  console.log("║  Specialized in:                                           ║");
  console.log("║  • Gold (XAU/USD) Analysis                                ║");
  console.log("║  • Cryptocurrency Markets (BTC, ETH, Altcoins)            ║");
  console.log("║  • Fiat Currency Pairs (EUR/USD, GBP/USD, etc)            ║");
  console.log("║  • Macroeconomic Analysis                                 ║");
  console.log("║                                                            ║");
  console.log("║  Commands:                                                 ║");
  console.log("║  • 'exit' - Quit and save session                         ║");
  console.log("║  • 'clear' - Reset conversation                           ║");
  console.log("║  • 'save' - Save current analysis                         ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  const askQuestion = () => {
    rl.question("You: ", async (input) => {
      const trimmed = input.trim();
      
      if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(chatHistory, null, 2));
        console.log("\n💾 Analysis session saved!");
        console.log("👋 Goodbye! Trade safely!");
        rl.close();
        process.exit(0);
        return;
      }

      if (trimmed.toLowerCase() === 'clear') {
        chatHistory = [];
        fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
        console.log("\n🗑️  Session cleared!\n");
        askQuestion();
        return;
      }

      if (trimmed.toLowerCase() === 'save') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `analysis-${timestamp}.json`;
        fs.writeFileSync(filename, JSON.stringify(chatHistory, null, 2));
        console.log(`\n💾 Analysis saved to: ${filename}\n`);
        askQuestion();
        return;
      }

      if (!trimmed) {
        askQuestion();
        return;
      }

      chatHistory.push({
        role: 'user',
        content: trimmed
      });

      try {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            ...chatHistory
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.7,
          max_tokens: 3000,
          top_p: 1
        });

        const response = completion.choices[0].message.content;
        
        chatHistory.push({
          role: 'assistant',
          content: response
        });

        // Auto-save
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(chatHistory, null, 2));

        console.log("\n📊 Market Analyst:\n");
        console.log(response);
        console.log("\n" + "=".repeat(60) + "\n");
      } cat