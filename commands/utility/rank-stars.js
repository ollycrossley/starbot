const { SlashCommandBuilder } = require('discord.js');
const {writeFileSync} = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank-stars')
        .setDescription('Ranks all available starred comments within the current channel.'),
    async execute(interaction) {
        const channel = interaction.channel;
        const messages = await channel.messages.fetch();

        const arrayOfMessages = []

        messages.forEach(message => {
            arrayOfMessages.push(message)
        })

        const starCounts = arrayOfMessages.map(message => ({
            content: message.content,
            stars: message.reactions.cache.get('⭐')?.count || 0,
        }));

        const sortedByStars = starCounts.sort((a, b) => b.stars - a.stars);


        let reply = 'Messages ranked by star reactions:\n';
        sortedByStars.forEach((msg, index) => {
            reply += `[${msg.stars} ⭐] - ${msg.content}\n`;
        });

        writeFileSync("messages.txt", reply)

        await interaction.reply(reply.length > 1999 ? "Output placed in messages.txt" : reply);
    },
};