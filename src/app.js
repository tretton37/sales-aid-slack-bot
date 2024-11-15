import dotenv from 'dotenv';
dotenv.config();
import { handleGreetingMessage, handleNewCinodeMarketAnnouncement } from './handlers/messageHandlers.js';

import pkg from '@slack/bolt';
const { App } = pkg;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Register message handlers
app.event('app_mention', handleGreetingMessage);
app.message('From', handleNewCinodeMarketAnnouncement);

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
