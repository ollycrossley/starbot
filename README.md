# Starbot

![Logo](src/github-banner.png)

## Introduction

**Starbot** is a small Discord bot that is able to count the amount of star reacts to messages in a specific channel 
and output them by rank in an embed in the same channel

This is especially good for **Starboards** which are a popular implementation of a ranking system in Discord bots.

## Setup

### Setup of `.env` files

Create **two** `.env` files in the root folder:

- `.env.development`
- `.env.production`

The contents of the files should contain the following 

```dotenv
DISCORD_TOKEN=your-discord-token
DISCORD_CLIENT=your-client-id
DISCORD_SECRET=your-discord-client-secret
GUILD_ID=your-server-id
```

These contents should be changed depending on which bot you are hosting and on what server.

To find out how to get these details,
please visit https://discordjs.guide/preparations/setting-up-a-bot-application.html

### Install Packages 

Please run `npm install` to install all correct packages

### Setting up bot

To make sure all commands transfer over to the bot correctly, please run `npm run deploy-prod` to seed all available commands.


### Running the bot

To run the bot, please run `npm run prod` and that should start the bot up and running. 