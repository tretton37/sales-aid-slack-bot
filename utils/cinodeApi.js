import fetch from 'node-fetch';

export const getCinodeToken = async (accessBase64) => {
  const tokenReq = await fetch('https://api.cinode.com/token', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${accessBase64}`,
    },
  });

  const token = await tokenReq.json();
  return token.access_token;
};

export const createCinodeProject = async (token, req) => {
  const createProjectResponse = await fetch('https://api.cinode.com/v0.1/companies/175/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(req),
  });

  if (!createProjectResponse.ok) {
    console.log(`Error creating project: ${createProjectResponse.status} - ${createProjectResponse.statusText}`);
    return null;
  }

  const project = await createProjectResponse.json();
  return project;
};
