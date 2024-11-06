import * as cheerio from 'cheerio';
import { DateRange } from '../types/types.js';

export const extractLinkFromMessage = (messageText: string): string | null => {
  const regexExtractLink = /<([^|]+)\|/;
  const match = messageText.match(regexExtractLink);
  return match ? match[1] : null;
};

export const fetchAndParseDates = async (link: string): Promise<DateRange> => {
  const html = await fetch(link).then((resp) => resp.text());
  const $ = cheerio.load(html);
  const date = $('.feather-calendar').parent().parent().text();
  const [startDate, endDate] = date.split(' to ').map((date) => new Date(date.trim()).toLocaleDateString());
  return { startDate, endDate };
};
