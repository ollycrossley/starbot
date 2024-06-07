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

### Install Packages 

Please run `npm install` to install all correct packages

### Seeding your bot's commands

To make sure all commands transfer over to the bot correctly, please run `npm run deploy-dev` to seed all available dev commands.

### Running the bot

To run the development bot, please run `npm run dev` and that should start the bot up