const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const {config} = require("dotenv");

const ENV = process.env.NODE_ENV
const pathToCorrectFile = `${__dirname}/.env.${ENV}`;
config({ path: pathToCorrectFile });

const clientId = process.env.DISCORD_CLIENT
const guildId = process.env.GUILD_ID
const token = process.env.DISCORD_TOKEN


const commands = [];
const args = [...process.argv]


// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST().setToken(token);

(async () => {
    try {
        let data = undefined;

        if (args.includes("-guild")) {
            console.log(`Started refreshing ${commands.length} application (/) guild commands.`);
            data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
        }

        if (args.includes("-global")){
            console.log(`Started refreshing ${commands.length} application (/) global commands.`);
            data = await rest.put(
                Routes.applicationCommands(clientId, guildId),
                { body: commands },
            );
            console.log("Note: Global commands may take time to show up, so please be patient")
        } else {
            console.log(`Started refreshing ${commands.length} application (/) guild commands.`);
            data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
        }


        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();