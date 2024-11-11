import fetch from 'node-fetch';
import { CINODE_API, ProjectDefaults, Priority } from './constants.js';
import { withRetry } from './retry.js';
import { CinodeError } from './errors.js';
import logger from './logger.js';
import type {
  CinodeTokenResponse,
  Metadata,
  CinodeProject,
  CreateProjectRequest,
  CinodeRole,
  CreateRoleRequest,
} from '../types/types.js';

export const getCinodeToken = async (accessBase64: string): Promise<string> => {
  if (!accessBase64) {
    throw new CinodeError('Access credentials are required');
  }

  return withRetry(async () => {
    try {
      const response = await fetch(CINODE_API.TOKEN_URL, {
        method: 'GET',
        headers: {
          ...CINODE_API.HEADERS,
          Authorization: `Basic ${accessBase64}`,
        },
      });

      if (!response.ok) {
        throw new CinodeError(`Failed to create token: ${response.status}`, response.status);
      }

      const { access_token } = (await response.json()) as CinodeTokenResponse;
      return access_token;
    } catch (error) {
      logger.error('Token request failed', error);
      throw error;
    }
  });
};

export const createCinodeProject = async (token: string, metadata: Metadata): Promise<CinodeProject> => {
  const req: CreateProjectRequest = {
    customerId: ProjectDefaults.CUSTOMER_ID,
    title: metadata.title,
    description: metadata.description,
    pipelineId: ProjectDefaults.PIPELINE_ID,
    pipelineStageId: ProjectDefaults.PIPELINE_STAGE_ID,
    currencyId: ProjectDefaults.CURRENCY_ID,
    projectState: 0,
    stateReasonId: null,
    priority: Priority.MEDIUM,
    salesManagerId: ProjectDefaults.SALES_MANAGER_ID,
  };

  return withRetry(async () => {
    try {
      const createProjectResponse = await fetch(
        `${CINODE_API.BASE_URL}/v0.1/companies/${CINODE_API.COMPANY_ID}/projects`,
        {
          method: 'POST',
          headers: {
            ...CINODE_API.HEADERS,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(req),
        }
      );

      if (!createProjectResponse.ok) {
        throw new CinodeError(
          `Failed to create project: ${createProjectResponse.status}`,
          createProjectResponse.status
        );
      }

      return (await createProjectResponse.json()) as CinodeProject;
    } catch (error) {
      logger.error('Create project request failed', error);
      throw error;
    }
  });
};

export const createCinodeRole = async (token: string, metadata: Metadata, projectId: number): Promise<CinodeRole> => {
  const req: CreateRoleRequest = {
    title: metadata.title,
    description: metadata.description,
    startDate: metadata.startDate,
    endDate: metadata.endDate,
    contractType: 0,
    extentType: 0,
    currencyId: ProjectDefaults.CURRENCY_ID,
    disableSkillsGeneration: false,
  };

  return withRetry(async () => {
    try {
      const response = await fetch(
        `${CINODE_API.BASE_URL}/v0.1/companies/${CINODE_API.COMPANY_ID}/projects/${projectId}/roles`,
        {
          method: 'POST',
          headers: {
            ...CINODE_API.HEADERS,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(req),
        }
      );

      if (!response.ok) {
        throw new CinodeError(`Failed to create role: ${response.status}`, response.status);
      }

      return (await response.json()) as CinodeRole;
    } catch (error) {
      logger.error('Create role request failed', error);
      throw error;
    }
  });
};
