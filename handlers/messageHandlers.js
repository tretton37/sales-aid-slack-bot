import urlMetaData from 'url-metadata';
import { extractLinkFromMessage, fetchAndParseDates } from '../utils/utils.js';
import { getCinodeToken, createCinodeProject, createCinodeRole } from '../utils/cinodeApi.js';
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
    console.error(error);
  }

  metadata.startDate = startDate;
  metadata.endDate = endDate;

  await say(formatCinodeAnnouncementMessage(metadata, startDate, endDate));

  const accessBase64 = Buffer.from(`${process.env.CINODE_ACCESS_ID}:${process.env.CINODE_ACCESS_SECRET}`).toString('base64');

  const token = await getCinodeToken(accessBase64);

  

  const project = await createCinodeProject(token, metadata);
  
  if (project) {
    console.log(`Cinode project response: ${JSON.stringify(project)}`);
  } else {
    console.error(`Failed to create project: createCinodeProject returned ${JSON.stringify(project)}`);
    await say('Failed to create project. Please check your permissions and try again.');
  }

  const role = await createCinodeRole(token, metadata, project.id);

  if (role) {
    console.log(`Cinode role response: ${JSON.stringify(role)}`);
  } else {
    console.error(`Failed to create project: createCinodeProject returned ${JSON.stringify(role)}`);
    await say('Failed to create role. Please check your permissions and try again.');
    return;
  }

  await say('Successfully created project');
};
