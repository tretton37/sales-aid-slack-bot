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
  let err: Error[] = [];
  for (let i = 1; i <= retries; i++) {
    try {
      const metadata = await urlMetadata(link, options);
      return metadata as Metadata;
    } catch (error) {
      console.error(`urlMetadataExtractor try ${i}/${retries} failed`);
      console.error(`link: ${link}`);
      console.error(`error: ${(error as Error).message}`);
      console.error(`retrying again in ${Defaults.RETRY_DURATION} ms`);

      err.push(error as Error);
      await sleep(Defaults.RETRY_DURATION);
      continue;
    }
  }

  throw new Error(
    `Could not retrieve link(${link}) after ${retries} retries. Error: ${err.map((e) => e.message).join(', ')}`
  );
};

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
