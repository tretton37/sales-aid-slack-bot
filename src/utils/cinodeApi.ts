import fetch from 'node-fetch';
import { CINODE_API, ProjectDefaults, Priority } from './constants.js';
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
    throw new Error('Access credentials are required');
  }

  try {
    const response = await fetch(CINODE_API.TOKEN_URL, {
      method: 'GET',
      headers: {
        ...CINODE_API.HEADERS,
        Authorization: `Basic ${accessBase64}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create token: ${response.status} - ${response.statusText}`);
    }

    const { access_token } = (await response.json()) as CinodeTokenResponse;
    return access_token;
  } catch (error) {
    throw new Error(`Token request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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

  const createProjectResponse = await fetch(`${CINODE_API.BASE_URL}/v0.1/companies/${CINODE_API.COMPANY_ID}/projects`, {
    method: 'POST',
    headers: {
      ...CINODE_API.HEADERS,
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });

  if (!createProjectResponse.ok) {
    return {
      error: `${createProjectResponse.status} - ${createProjectResponse.statusText}`,
    } as CinodeProject;
  }

  return (await createProjectResponse.json()) as CinodeProject;
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
    return {
      error: `${response.status} - ${response.statusText}`,
    } as CinodeRole;
  }

  return (await response.json()) as CinodeRole;
};
