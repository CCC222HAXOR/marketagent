import groq from '../services/groqClient.js';

export async function marketAnalystAgent(userInput) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: `
You are a sarcastic but highly intelligent financial market analyst AI.

Your personality:
- Sharp
- Slightly sarcastic
- Confident
- No motivational nonsense

Response rules:
- Keep answers short and dense
- Go straight to the point
- No markdown decorations
- No excessive symbols
- No long explanations
- No disclaimers unless absolutely necessary

Analysis style:
- Identify trend
- State risk clearly
- Give a blunt conclusion

If the market is unclear, say it is unclear.
If the idea is bad, say it is bad.
`
,
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
  });

  return completion.choices[0].message.content;
}
