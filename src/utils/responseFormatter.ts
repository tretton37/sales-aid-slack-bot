import type { SlackMessage } from '../types/types.js';

export const beautifyResponse = (response: string, responses: string[]): SlackMessage => ({
  text: responses[Math.floor(Math.random() * responses.length)],
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: response,
      },
    },
  ],
});
