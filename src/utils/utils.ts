import * as cheerio from 'cheerio';
import type { DateRange, Metadata } from '../types/types.js';
import urlMetadata from 'url-metadata';
import { withRetry } from './retry.js';
import { ApiError } from './errors.js';
import { RegExps, RegExpKeys } from './constants.js';

export const extractLinkFromMessage = (messageText: string, regexKey: RegExpKeys): string[] | null => {
  const regex = RegExps[regexKey];

  const match = messageText.match(regex);
  return match ? match : null;
};

export const fetchAndParseDates = async (link: string): Promise<DateRange> => {
  const html = await fetch(link).then((resp) => resp.text());
  const $ = cheerio.load(html);
  const date = $('.feather-calendar').parent().parent().text();
  const [startDate, endDate] = date.split(' to ').map((date) => new Date(date.trim()).toLocaleDateString());
  return { startDate, endDate };
};

export const urlMetadataExtractor = async (link: string, options: urlMetadata.Options): Promise<Metadata> => {
  return withRetry(async () => {
    try {
      return (await urlMetadata(link, options)) as Metadata;
    } catch (error) {
      throw new ApiError(`Failed to retrieve metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};
