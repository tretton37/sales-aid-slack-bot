const { App } = require("@slack/bolt");
const urlMetaData = require("url-metadata");



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

app.message('New Cinode Market Announcement', async ({message, say}) => {
    console.log(message);
    let regexExtractLink = /<([^|]+)\|/;
    let link = message.text.match(regexExtractLink)[1];

    if(!link) {
        console.log("Could not extract link");
    }
    let data;
    // try {

    //     data = fetchMeta(link);
    // } catch (error) {
    //     console.log(`Error getting metadata: ${error}`);
    //     await say("Could not create a project. :( Check logs.")
    //     return;
    // }
    // console.log(`metadata: ${data}`);

    let metadata;
    try {
        metadata = await urlMetaData(link);
        console.log(metadata);
    } catch (error) {
        console.log(error);
    }

    const accessBase64 = Buffer.from(`${process.env.CINODE_ACCESS_ID}:${process.env.CINODE_ACCESS_SECRET}`).toString('base64');
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

    console.log(`Cinode token: ${token.access_token}`);
    console.log(`Metadata title: ${metadata.title}`)
    console.log(`Metadata description: ${metadata.description}`)
    const req = {
        "customerId": 158342, // SalesAid Tretton37
        "title": metadata.title,
        "description": metadata.description,
        "pipelineId": 3020, // Sales Aid - Broker ads
        "pipelineStageId": 14458, // Incoming
        "currencyId": 1, // SEK
        "projectState": 0, // ?
        "stateReasonId": null, // ?
        "priority": 5, // Medium
        "salesManagerIds": [
          228236 // SalesAid Tretton37 user
        ]
      };

      console.log(req);
      console.log(JSON.stringify(req));

    // // Create project
    const createProjectResponse = await fetch("https://api.cinode.com/v0.1/companies/175/projects", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access_token}`
        },
        body: JSON.stringify(req)
    });
    if(!createProjectResponse.ok) {
        console.log(`Error getting metadata: ${createProjectResponse.status} - ${createProjectResponse.statusText}`);
    } else {
        var project = await createProjectResponse.json();
        console.log(`Cinode project response: ${project}`);
    }
    await say(createProjectResponse.ok ? "Successfully created project" : "Failed to create project");
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();

