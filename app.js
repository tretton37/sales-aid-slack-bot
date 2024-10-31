const { App } = require("@slack/bolt");
const { create } = require("domain");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000, // Currently not used as in socket mode.
});

/* Add functionality here */
app.message("hello", async ({ message, say }) => {
  console.log(message);
  await say(`Hey there, <@${message.user}>!`);
});

app.message("interact", async ({ message, say }) => {
  await say({
    blocks: [
      {
        type: "actions",
        block_id: "actions1",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Click Me!",
            },
            action_id: "button_click",
          },
        ],
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

app.action("button_click", async ({ body, ack, say }) => {
  await say(`<@${body.user.id}> clicked the button.`);

  await ack();
});

app.message("New Cinode Market Announcement", async ({ message, say }) => {
  console.log(message);
  let regexExtractLink = /<([^|]+)\|/;
  let link = message.text.match(regexExtractLink)[1];
  if (!link) {
    console.log("Could not extract link");
  }

  // Extract meta tags
  const apiUrl = `https://jsonlink.io/api/extract?url=${link}&api_key=${process.env.JSONLINK_API_KEY}`;
  let response;
  try {
    response = await fetch(apiUrl);
  } catch (error) {
    console.log(`Error getting metadata: ${error}`);
    return;
  }

  if (!response.ok) {
    console.log(`Error: ${response.status} - ${response.statusText}`);
    await say("Could not create a project. :( Check logs.");
    return;
  }

  const data = await response.json();
  console.log(`JsonLink data: ${data}`);

  const accessBase64 = Buffer.from(
    `${process.env.CINODE_ACCESS_ID}:${process.env.CINODE_ACCESS_SECRET}`
  ).toString("base64");
  console.log(`accessBase64: ${accessBase64}`);

  // Get token to post a new project
  const tokenReq = await fetch("https://api.cinode.com/token", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${accessBase64}`,
    },
  });

  const token = await tokenReq.json();
  console.log(`Cinode token: ${token}`);
  const req = {
    customerId: 158342, // SalesAid Tretton37
    title: data.title,
    description: data.description,
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

  // Create project
  const createProjectResponse = await fetch(
    "https://api.cinode.com/v0.1/companies/175/projects",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access_token}`,
      },
      body: JSON.stringify(req),
    }
  );
  var project = await createProjectResponse.json();
  console.log(`Cinode project response: ${project}`);
  await say(
    createProjectResponse.ok
      ? "Successfully created project"
      : "Failed to create project"
  );
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();
