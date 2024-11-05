import fetch from 'node-fetch';

export const getCinodeToken = async (accessBase64) => {
  const tokenReq = await fetch('https://api.cinode.com/token', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${accessBase64}`,
    },
  });
  if(!tokenReq.ok) {
    console.error(`Failed to create a token: ${tokenReq.status} - ${tokenReq.statusText}`)
  }
  const token = await tokenReq.json();
  return token.access_token;
};

export const createCinodeProject = async (token, metadata) => {
  const req = {
    customerId: 158342, // SalesAid Tretton37
    title: metadata.title,
    description: metadata.description,
    pipelineId: 3020, // Sales Aid - Broker ads
    pipelineStageId: 14458, // Incoming
    currencyId: 1, // SEK
    projectState: 0, // ?
    stateReasonId: null, // ?
    priority: 5, // Medium
    salesManagerIds: [
      228236, // SalesAid Tretton37 user
    ],
  };

  const createProjectResponse = await fetch('https://api.cinode.com/v0.1/companies/175/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(req)
  });

  if (!createProjectResponse.ok) {
    console.error(`Error creating project: ${createProjectResponse.status} - ${createProjectResponse.statusText}`);
    return null;
  }

  return await createProjectResponse.json();
};

export const createCinodeRole = async (token, metadata, projectId) => {
  const req = {
    title: metadata.title,
    description: metadata.description,
    startDate: metadata.startDate,
    endDate: metadata.endDate,
    contractType: 0,
    extentType: 0,
    currencyId: 1,
    disableSkillsGeneration: false
  };

  const response = await fetch(`https://api.cinode.com/v0.1/companies/175/projects/${projectId}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(req)
  });

  if (!response.ok) {
    console.error(`Error creating role: ${response.status} - ${response.statusText}`);
  }

  return await response.json();  
}