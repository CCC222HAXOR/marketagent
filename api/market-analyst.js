import { marketAnalystAgent } from '../agents/marketAnalystAgent.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input required' });
  }

  try {
    const output = await marketAnalystAgent(input);
    res.status(200).json({ output });
  } catch (error) {
    res.status(500).json({ error: 'Agent failed' });
  }
}
