import urlMetaData from 'url-metadata';
import type { SlackContext, Metadata } from '../types/types.js';
import { getCinodeToken, createCinodeProject, createCinodeRole } from '../utils/cinodeApi.js';
import { greetings, responses } from '../utils/greetings.js';
import { formatCinodeAnnouncementMessage } from '../utils/messageFormatter.js';
import { beautifyResponse } from '../utils/responseFormatter.js';
import { extractLinkFromMessage, fetchAndParseDates } from '../utils/utils.js';

const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const capitalizeFirstLetter = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

const isGreetingMessage = (messageText: string): boolean =>
  greetings.some((greeting) => messageText.includes(greeting));

const generateResponse = (user: string): string => {
  const randomGreeting = capitalizeFirstLetter(getRandomItem(greetings));
  const randomResponse = getRandomItem(responses);
  return `${randomGreeting}, <@${user}>! ${randomResponse}`;
};

export const handleGreetingMessage = async ({ event, say }: SlackContext): Promise<void> => {
  const messageText = event.text.toLowerCase();
  if (isGreetingMessage(messageText)) {
    const response = generateResponse(event.user);
    try {
      await say(beautifyResponse(response, responses));
    } catch (error) {
      console.error('Error sending greeting:', error);
    }
  }
};

export const handleNewCinodeMarketAnnouncement = async ({ message, say }: SlackContext): Promise<void> => {
  if (!message?.text) {
    console.error('No message or message text provided');
    await say('Invalid message format received.');
    return;
  }

  const link = extractLinkFromMessage(message.text);
  if (!link) {
    console.log('Could not extract link from message');
    await say('Could not extract link from message. Please ensure the message contains a valid URL.');
    return;
  }

  try {
    // Fetch dates and metadata in parallel
    const [{ startDate, endDate }, metadata] = await Promise.all([
      fetchAndParseDates(link),
      urlMetaData(link) as Promise<Metadata>,
    ]);

    const enrichedMetadata = { ...metadata, startDate, endDate };
    await say(formatCinodeAnnouncementMessage(enrichedMetadata, startDate, endDate));

    const accessBase64 = Buffer.from(`${process.env.CINODE_ACCESS_ID}:${process.env.CINODE_ACCESS_SECRET}`).toString(
      'base64'
    );

    const token = await getCinodeToken(accessBase64);
    const project = await createCinodeProject(token, enrichedMetadata);

    if (!project) {
      throw new Error('Failed to create Cinode project');
    }

    const role = await createCinodeRole(token, enrichedMetadata, project.id);
    if (!role) {
      throw new Error('Failed to create Cinode role');
    }

    await say('Successfully created project and role in Cinode');
  } catch (error) {
    console.error('Error processing announcement:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await say(`An error occurred while processing the announcement: ${errorMessage}`);
  }
};
