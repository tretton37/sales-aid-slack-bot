// Common interfaces
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface Metadata extends DateRange {
  'og:title'?: string;
  title: string;
  description: string;
  url?: string;
}

// Slack-related interfaces
export interface SlackTextBlock {
  type: string;
  text: string;
}

export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  fields?: Array<SlackTextBlock>;
}

export interface SlackMessage {
  text: string;
  blocks: Array<SlackBlock>;
}

export interface SlackContext {
  bot: any;
  event: {
    text: string;
    user: string;
  };
  message?: {
    text: string;
  };
  say: (message: SlackMessage | string) => Promise<void>;
}

// Cinode-related interfaces
interface CinodeBase {
  id: number;
  title: string;
  error?: string;
}

export interface CinodeProject extends CinodeBase {
  description: string;
}

export interface CinodeRole extends CinodeBase {}

export interface CinodeTokenResponse {
  access_token: string;
}

// Request interfaces
export interface CreateProjectRequest {
  customerId: number;
  title: string;
  description: string;
  pipelineId: number;
  pipelineStageId: number;
  currencyId: number;
  projectState: number;
  stateReasonId: null;
  priority: number;
  salesManagerId: number;
}

export interface CreateRoleRequest extends DateRange {
  title: string;
  description: string;
  contractType: number;
  extentType: number;
  currencyId: number;
  disableSkillsGeneration: boolean;
}
