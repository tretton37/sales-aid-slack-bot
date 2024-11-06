export interface SlackMessage {
  text: string;
  blocks: Array<{
    type: string;
    text?: {
      type: string;
      text: string;
      emoji?: boolean;
    };
    fields?: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

export interface Metadata {
  'og:title'?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  url?: string;
}

export interface CinodeProject {
  id: number;
  title: string;
  description: string;
}

export interface CinodeRole {
  id: number;
  title: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface SlackContext {
  event: {
    text: string;
    user: string;
  };
  message?: {
    text: string;
  };
  say: (message: SlackMessage | string) => Promise<void>;
}

export interface CinodeTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

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
  salesManagerIds: number[];
}

export interface CreateRoleRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  contractType: number;
  extentType: number;
  currencyId: number;
  disableSkillsGeneration: boolean;
}
