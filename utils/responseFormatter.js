export const beautifyResponse = (response, responses) => ({
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
