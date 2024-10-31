export const formatCinodeAnnouncementMessage = (metadata, startDate, endDate) => {
  return {
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
            text: `*Title:*\n${metadata['og:title']}`,
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
  };
};
