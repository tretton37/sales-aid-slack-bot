# Sales Aid Slack Bot

Sales Aid Slack Bot is a Slack bot designed to assist with sales tasks. It leverages the Slack API and other services to provide useful functionalities.

## Table of Contents

- [Initialization](#initialization)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [License](#license)

## Initialization

Create an app at: https://api.slack.com/apps \
Create an API key: https://app.cinode.com/tretton37/account

Don't forget to install the app on slack and invite the bot to the channel you want it to listen to.
Sales Aid Slack Bot is a Slack bot designed to assist with sales tasks. It leverages the Slack API and other services to provide useful functionalities.

#### Enable or disable Socket Mode depending on how the bot is running.

Enable events under 'Event Subscriptions' in Slack app admin.

## Installation

1. Install the dependencies:
   ```sh
   npm install
   ```

## Configuration

1. Copy the `.env.example` file to `.env`:

   ```sh
   cp .env.example .env
   ```

2. Fill in the environment variables in the `.env` file:

   ```env
   SLACK_APP_TOKEN: Under *Basic Information*, Create an App level token with the connections:write scope
   SLACK_BOT_TOKEN: Under *Install App*, Bot User OAuth Token
   SLACK_SIGNING_SECRET: Under *Basic Information*, Client Secret
   CINODE_ACCESS_ID: Create an Cinode API key under *My  Account*, Access Id
   CINODE_ACCESS_SECRET: Create an API key under *My  Account*, Access Secret
   ```

## Usage

1. Start the application:

   ```sh
   npm start
   ```

2. The bot will start running and listen for events on the specified port (default is 3000).

## Deploy

The bot is deployed to Google Cloud using the docker container.

1. Make sure you have [Docker](https://www.docker.com/get-started/) installed.
2. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
3. Create a Google Cloud project (either through portal or CLI)
4. Log in to your google cloud via the CLI
   ```bash
   gcloud auth login
   gcloud config set project [YOUR_PROJECT_ID]
   ```
5. Athenticate docker to use your google auth
   ```bash
   gcloud auth configure-docker
   ```
6. Build the image.
   ```bash
   docker build -t gcr.io/[YOUR_PROJECT_ID]/slack-bolt-app .
   ```
7. Push the image to Google Container Registry
   ```bash
   docker push gcr.io/[YOUR_PROJECT_ID]/slack-bolt-app
   ```
8. Deploy the Google Run Function
   ```bash
   gcloud run deploy slack-bolt-app \
   --image gcr.io/[YOUR_PROJECT_ID]/slack-bolt-app \
   --platform managed \
   --region [YOUR_REGION] \
   --allow-unauthenticated \
   --set-env-vars PROJECT_ID = [YOUR_PROJECT_ID]
   ```

## Dependencies

- [@slack/bolt](https://www.npmjs.com/package/@slack/bolt) - Slack app framework
- [@slack/socket-mode](https://www.npmjs.com/package/@slack/socket-mode) - Slack Socket Mode client
- [@slack/web-api](https://www.npmjs.com/package/@slack/web-api) - Slack Web API client

## License

This project is licensed under the ISC License.
