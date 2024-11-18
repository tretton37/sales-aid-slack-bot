export const CINODE_API = {
  BASE_URL: 'https://api.cinode.com',
  TOKEN_URL: 'https://api.cinode.com/token',
  COMPANY_ID: 175,
  HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
} as const;

export enum ProjectDefaults {
  CUSTOMER_ID = 158342, // SalesAid Tretton37
  PIPELINE_ID = 3020, // Sales Aid - Broker ads
  PIPELINE_STAGE_ID = 14458, // Incoming
  CURRENCY_ID = 1, // SEK
  SALES_MANAGER_ID = 228236, // SalesAid Tretton37 user
}

export enum Priority {
  LOW = 1,
  MEDIUM = 5,
  HIGH = 10,
}

export enum Defaults {
  RETRY_DURATION = 60000,
  DESCRIPTION_LENGTH = 4000,
}

export const RegExps = {
  CINODE_MARKET: /<([^|]+)\|/,
  EMAGINE: /https:\/\/www.emagine-consulting\.se\/consultants\/freelance-jobs[^"]*/,
} as const;

export type RegExpKeys = keyof typeof RegExps;
