import pkg from '@slack/bolt';
import dotenv from 'dotenv';
import { handleGreetingMessage, handleNewCinodeMarketAnnouncement } from './handlers/messageHandlers.js';
dotenv.config();
const { App, SocketModeReceiver } = pkg;

const app = new App({
  appToken: process.env.SLACK_APP_TOKEN,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  port: process.env.PORT || 3000, // Currently not used as in socket mode.
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();

// Register message handlers

app.event('app_mention', handleGreetingMessage);
app.message('New Cinode Market Announcement', handleNewCinodeMarketAnnouncement);
