// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const {fileURLToPath} = require("url");
const {dirname} = require("node:path");
const {config} = require("dotenv")

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename)

const ENV = process.env.NODE_ENV
const pathToCorrectFile = `${__dirname}/.env.${ENV}`;
config({ path: pathToCorrectFile });

const token = process.env.DISCORD_TOKEN

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits["Guilds"]] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with your client's token
client.login(token);