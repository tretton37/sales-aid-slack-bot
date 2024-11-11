import * as cheerio from 'cheerio';
import type { DateRange, Metadata } from '../types/types.js';
import urlMetadata from 'url-metadata';
import { Defaults } from '../utils/constants.js';
import { Error } from '@slack/web-api/dist/types/response/AdminWorkflowsCollaboratorsRemoveResponse.js';

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

export const urlMetadataExtractor = async (
  link: string,
  options: urlMetadata.Options,
  retries = 5
): Promise<Metadata> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return (await urlMetadata(link, options)) as Metadata;
    } catch (error) {
      console.error(`urlMetadataExtractor attempt ${attempt}/${retries} failed`);
      console.error(`link: ${link}`);
      console.error(`error: ${(error as Error).message}`);

      if (attempt === retries) {
        throw new Error(
          `Failed to retrieve metadata for ${link} after ${retries} attempts: ${(error as Error).message}`
        );
      }

      console.error(`Waiting ${Defaults.RETRY_DURATION}ms before next attempt`);
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, Defaults.RETRY_DURATION);
        // Clean up timeout to prevent memory leaks
        timeout.unref?.();
      });
    }
  }
  throw new Error(`Failed to retrieve metadata for ${link}`);
};
