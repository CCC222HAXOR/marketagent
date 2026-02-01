import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { marketAnalystAgent } from './agents/marketAnalystAgent.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/agent/market-analyst', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: 'Input required' });
    }

    const output = await marketAnalystAgent(input);

    res.json({ output });
  } catch {
    res.status(500).json({ error: 'Agent failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Agent running on port ${PORT}`);
});
