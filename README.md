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
Create an API key: https://app.cinode.com/tretton37/account \
JsonLink: https://jsonlink.io/

Don't forget to install the app on slack and invite the bot to the channel you want it to listen to.
Sales Aid Slack Bot is a Slack bot designed to assist with sales tasks. It leverages the Slack API and other services to provide useful functionalities.

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
   **SLACK_APP_TOKEN**: Under *Basic Information*, Create an App level token with the connections:write scope  \
   **SLACK_BOT_TOKEN**: Under *Install App*, Bot User OAuth Token \
   **SLACK_SIGNING_SECRET**: Under *Basic Information*, Client Secret \
   **CINODE_ACCESS_ID**: Create an Cinode API key under *My  Account*, Access Id \
   **CINODE_ACCESS_SECRET**: Create an API key under *My  Account*, Access Secret \
   **JSONLINK_API_KEY**: Create a free account at JsonLink and get the API key from https://jsonlink.io/dashboard
   ```

## Usage

1. Start the application:

   ```sh
   npm start
   ```

2. The bot will start running and listen for events on the specified port (default is 3000).

## Dependencies

- [@slack/bolt](https://www.npmjs.com/package/@slack/bolt) - Slack app framework
- [@slack/socket-mode](https://www.npmjs.com/package/@slack/socket-mode) - Slack Socket Mode client
- [@slack/web-api](https://www.npmjs.com/package/@slack/web-api) - Slack Web API client
- [express](https://www.npmjs.com/package/express) - Web framework for Node.js

## License

This project is licensed under the ISC License.
