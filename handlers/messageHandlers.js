import urlMetaData from 'url-metadata';
import { extractLinkFromMessage, fetchAndParseDates } from '../utils/utils.js';
import { getCinodeToken, createCinodeProject } from '../utils/cinodeApi.js';
import { formatCinodeAnnouncementMessage } from '../utils/messageFormatter.js';
import { greetings, responses } from '../utils/greetings.js';
import { beautifyResponse } from '../utils/responseFormatter.js';

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const capitalizeFirstLetter = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

const isGreetingMessage = (messageText) => greetings.some((greeting) => messageText.includes(greeting));

const generateResponse = (user) => {
  const randomGreeting = capitalizeFirstLetter(getRandomItem(greetings));
  const randomResponse = getRandomItem(responses);
  return `${randomGreeting}, <@${user}>! ${randomResponse}`;
};

// Function to handle greetings
export const handleGreetingMessage = async ({ event, say }) => {
  const messageText = event.text.toLowerCase();
  if (isGreetingMessage(messageText)) {
    const response = generateResponse(event.user);
    try {
      await say(beautifyResponse(response, responses));
    } catch (error) {
      console.error(error);
    }
  }
};

// Function to handle "New Cinode Market Announcement" message
export const handleNewCinodeMarketAnnouncement = async ({ message, say }) => {
  console.log(message);
  const link = extractLinkFromMessage(message.text);

  if (!link) {
    console.log('Could not extract link');
    await say('Could not extract link from message');
    return;
  }

  const { startDate, endDate } = await fetchAndParseDates(link);

  let metadata;
  try {
    metadata = await urlMetaData(link);
  } catch (error) {
    await say('Failed to fetch metadata from the link.');
    console.log(error);
  }

  await say(formatCinodeAnnouncementMessage(metadata, startDate, endDate));

  const accessBase64 = Buffer.from(`${process.env.CINODE_ACCESS_ID}:${process.env.CINODE_ACCESS_SECRET}`).toString('base64');

  const token = await getCinodeToken(accessBase64);

  const req = {
    customerId: 158342, // SalesAid Tretton37
    title: metadata.title,
    description: metadata.description,
    pipelineId: 3020, // Sales Aid - Broker ads
    pipelineStageId: 14458, // Incoming
    currencyId: 1, // SEK
    projectState: 0, // ?
    stateReasonId: null, // ?
    priority: 5, // Medium
    salesManagerIds: [
      228236, // SalesAid Tretton37 user
    ],
  };

  const project = await createCinodeProject(token, req);
  if (project) {
    console.log(`Cinode project response: ${project}`);
    await say('Successfully created project');
  } else {
    console.error(`Failed to create project: createCinodeProject returned ${project}`);
    await say('Failed to create project. Please check your permissions and try again.');
  }
};
