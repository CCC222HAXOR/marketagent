const Groq = require('groq-sdk');
const fs = require('fs');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateReport(topic) {
  const SYSTEM_PROMPT = `You are a professional financial market analyst. Create a comprehensive market report in English covering:

1. EXECUTIVE SUMMARY
2. CURRENT MARKET OVERVIEW
3. TECHNICAL ANALYSIS
   - Key support/resistance levels
   - Chart patterns
   - Indicators
4. FUNDAMENTAL ANALYSIS
   - Economic factors
   - News impact
   - Market sentiment
5. SCENARIOS
   - Bullish case
   - Bearish case
   - Most likely scenario
6. RISK ASSESSMENT
7. CONCLUSION

Format as a professional report with clear sections. Include disclaimer.`;

  try {
    console.log("📝 Generating comprehensive market report...\n");
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Generate a comprehensive market analysis report for: ${topic}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000
    });

    const report = completion.choices[0].message.content;
    
    // Save to file
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `market-report-${topic.replace(/\s+/g, '-')}-${timestamp}.txt`;
    
    fs.writeFileSync(filename, report);
    
    console.log(report);
    console.log("\n" + "=".repeat(60));
    console.log(`\n✅ Report saved to: ${filename}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const topic = process.argv.slice(2).join(' ');
if (topic) {
  generateReport(topic);
} else {
  console.log('Usage: node market-report.js "Bitcoin Q1 2025"');
  console.log('\nExample topics:');
  console.log('  - "Gold price outlook February 2025"');
  console.log('  - "Ethereum technical analysis"');
  console.log('  - "USD/JPY weekly forecast"');
  console.log('  - "Cryptocurrency market overview"');
}