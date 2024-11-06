import { Metadata, SlackMessage } from '../types/types.js';

export const formatCinodeAnnouncementMessage = (
  metadata: Metadata,
  startDate: string,
  endDate: string
): SlackMessage => ({
  text: 'fallback text message',
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '🔥New Project🔥',
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Title:*\n${metadata['og:title'] || metadata.title}`,
        },
      ],
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Start Date:*\n${startDate}`,
        },
        {
          type: 'mrkdwn',
          text: `*End Date:*\n${endDate}`,
        },
      ],
    },
  ],
});
