import fetch from 'node-fetch';
import {
  CinodeTokenResponse,
  Metadata,
  CinodeProject,
  CreateProjectRequest,
  CinodeRole,
  CreateRoleRequest,
} from '../types/types.js';

export const getCinodeToken = async (accessBase64: string): Promise<string> => {
  const tokenReq = await fetch('https://api.cinode.com/token', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${accessBase64}`,
    },
  });

  if (!tokenReq.ok) {
    throw new Error(`Failed to create a token: ${tokenReq.status} - ${tokenReq.statusText}`);
  }

  const token = (await tokenReq.json()) as CinodeTokenResponse;
  return token.access_token;
};

export const createCinodeProject = async (token: string, metadata: Metadata): Promise<CinodeProject | null> => {
  const req: CreateProjectRequest = {
    customerId: 158342, // SalesAid Tretton37
    title: metadata.title,
    description: metadata.description,
    pipelineId: 3020, // Sales Aid - Broker ads
    pipelineStageId: 14458, // Incoming
    currencyId: 1, // SEK
    projectState: 0,
    stateReasonId: null,
    priority: 5, // Medium
    salesManagerIds: [
      228236, // SalesAid Tretton37 user
    ],
  };

  const createProjectResponse = await fetch('https://api.cinode.com/v0.1/companies/175/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });

  if (!createProjectResponse.ok) {
    console.error(`Error creating project: ${createProjectResponse.status} - ${createProjectResponse.statusText}`);
    return null;
  }

  return (await createProjectResponse.json()) as CinodeProject;
};

export const createCinodeRole = async (
  token: string,
  metadata: Metadata,
  projectId: number
): Promise<CinodeRole | null> => {
  const req: CreateRoleRequest = {
    title: metadata.title,
    description: metadata.description,
    startDate: metadata.startDate,
    endDate: metadata.endDate,
    contractType: 0,
    extentType: 0,
    currencyId: 1,
    disableSkillsGeneration: false,
  };

  const response = await fetch(`https://api.cinode.com/v0.1/companies/175/projects/${projectId}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    console.error(`Error creating role: ${response.status} - ${response.statusText}`);
    return null;
  }

  return (await response.json()) as CinodeRole;
};
