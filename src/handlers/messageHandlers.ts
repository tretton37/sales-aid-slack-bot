import type { SlackContext } from '../types/types.js';
import { getCinodeToken, createCinodeProject, createCinodeRole } from '../utils/cinodeApi.js';
import { greetings, responses } from '../utils/greetings.js';
import { formatCinodeAnnouncementMessage } from '../utils/messageFormatter.js';
import { beautifyResponse } from '../utils/responseFormatter.js';
import { extractLinkFromMessage, fetchAndParseDates, urlMetadataExtractor } from '../utils/utils.js';
import { Defaults } from '../utils/constants.js';
import { CinodeError, ApiError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import type { BotkitMessage, BotWorker } from 'botkit';

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
  try {
    if (!message?.text) {
      throw new Error('No message or message text provided');
    }

    const link = extractLinkFromMessage(message.text);
    if (!link) {
      throw new Error('Could not extract link from message');
    }

    const options = {
      descriptionLength: Defaults.DESCRIPTION_LENGTH,
    };

    const metadata = await urlMetadataExtractor(link, options);
    const { startDate, endDate } = await fetchAndParseDates(link);

    const enrichedMetadata = { ...metadata, startDate, endDate };
    await say(formatCinodeAnnouncementMessage(enrichedMetadata, startDate, endDate));

    const accessBase64 = Buffer.from(`${process.env.CINODE_ACCESS_ID}:${process.env.CINODE_ACCESS_SECRET}`).toString(
      'base64'
    );

    const token = await getCinodeToken(accessBase64);
    const project = await createCinodeProject(token, enrichedMetadata);

    if ('error' in project) {
      throw new Error(project.error);
    }

    const role = await createCinodeRole(token, enrichedMetadata, project.id);
    if (!role) {
      throw new Error('Failed to create Cinode role');
    }

    await say('Successfully created project and role in Cinode');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error processing announcement:', error);

    if (error instanceof CinodeError) {
      await say(`Cinode API Error: ${errorMessage}`);
    } else if (error instanceof ApiError) {
      await say(`API Error: ${errorMessage}`);
    } else {
      await say(`An error occurred: ${errorMessage}`);
    }
  }
};

export const handleNewCinodeMarketAnnouncement2 = async (bot: BotWorker, message: BotkitMessage): Promise<void> => {
  try {
    if (!message?.text) {
      throw new Error('No message or message text provided');
    }

    const link = extractLinkFromMessage(message.text);
    if (!link) {
      throw new Error('Could not extract link from message');
    }

    const options = {
      descriptionLength: Defaults.DESCRIPTION_LENGTH,
    };

    const metadata = await urlMetadataExtractor(link, options);
    const { startDate, endDate } = await fetchAndParseDates(link);

    const enrichedMetadata = { ...metadata, startDate, endDate };
    await bot.reply(message, formatCinodeAnnouncementMessage(enrichedMetadata, startDate, endDate));

    const accessBase64 = Buffer.from(`${process.env.CINODE_ACCESS_ID}:${process.env.CINODE_ACCESS_SECRET}`).toString(
      'base64'
    );

    const token = await getCinodeToken(accessBase64);
    const project = await createCinodeProject(token, enrichedMetadata);

    if ('error' in project) {
      throw new Error(project.error);
    }

    const role = await createCinodeRole(token, enrichedMetadata, project.id);
    if (!role) {
      throw new Error('Failed to create Cinode role');
    }

    await bot.reply(message, 'Successfully created project and role in Cinode');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error processing announcement:', error);

    if (error instanceof CinodeError) {
      await bot.reply(message, `Cinode API Error: ${errorMessage}`);
    } else if (error instanceof ApiError) {
      await bot.reply(message, `API Error: ${errorMessage}`);
    } else {
      await bot.reply(message, `An error occurred: ${errorMessage}`);
    }
  }
};
