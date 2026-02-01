import TelegramBot from 'node-telegram-bot-api';
import { marketAnalystAgent } from '../agents/marketAnalystAgent.js';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true,
});

console.log('Telegram Market Analyst Bot is running...');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    await bot.sendMessage(chatId, 'Analyzing market data...');

    const analysis = await marketAnalystAgent(text);

    await bot.sendMessage(chatId, analysis);
  } catch (error) {
    console.error(error);
    await bot.sendMessage(
      chatId,
      'Error occurred while analyzing the market.'
    );
  }
});
