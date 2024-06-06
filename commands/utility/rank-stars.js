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
            if (message.content.includes("http") && (message.author.id !== "1248299736365269122")) {
                arrayOfMessages.push(message)
            }
        })

        const starCounts = arrayOfMessages.map(message => ({
            content: message.content,
            stars: message.reactions.cache.get('⭐')?.count || 0,
        }));

        const sortedByStars = starCounts.sort((a, b) => b.stars - a.stars);


        let reply = 'Messages ranked by star reactions:\n';
        let msgReply = 'Messages ranked by star reactions:\n'

        sortedByStars.forEach((msg, index) => {
            if (index === 0) {
                reply += `[${msg.stars} ⭐]\n<${msg.content}>\n`;
                msgReply += `[${msg.stars} ⭐]\n${msg.content}\n`;
            } else if (sortedByStars[index - 1].stars === msg.stars) {
                reply += `<${msg.content}>\n`;
                msgReply += `${msg.content}\n`;
            } else if (sortedByStars[index - 1].stars > msg.stars){
                reply += `[${msg.stars} ⭐]\n<${msg.content}>\n`;
                msgReply += `[${msg.stars} ⭐]\n${msg.content}\n`;
            }
        });

        writeFileSync(`logs/${channel.name}.txt`, msgReply)

        await interaction.reply(reply.length > 1999 ? `Output placed in ${channel.name}.txt` : reply);
    },
};