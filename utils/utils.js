import * as cheerio from 'cheerio';

// Function to extract link from message text
export const extractLinkFromMessage = (messageText) => {
  const regexExtractLink = /<([^|]+)\|/;
  const match = messageText.match(regexExtractLink);
  return match ? match[1] : null;
};

// Function to fetch and parse HTML for dates
export const fetchAndParseDates = async (link) => {
  let startDate, endDate;
  const html = await fetch(link).then((resp) => resp.text());
  const $ = cheerio.load(html);
  const date = $('app-icon').eq(2).parent().text();
  [startDate, endDate] = date.split(' to ').map((date) => new Date(date.trim()).toLocaleDateString());
  return { startDate, endDate };
};
