const {SlashCommandBuilder} = require('discord.js');
const {writeFileSync} = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank-any')
        .setDescription('Ranks posts in a channel by any given emoji')
        .addStringOption(emoji =>
            emoji.setName('emoji')
                .setRequired(true)
                .setDescription('The emoji you want to rank with (Raw emoji ONLY)')),
    async execute(interaction) {
        const userEmoji = interaction.options.getString("emoji")

        let arrayOfMessages = []
        const channel = interaction.channel;
        const messages = await channel.messages.fetch();

        messages.forEach(message => {
            if ((message.author.id !== "1248299736365269122")) arrayOfMessages.push(message)
        })

        let emoji = undefined
        if (/\p{Emoji_Presentation}/gu.test(userEmoji)) {
            emoji = userEmoji
        } else {
            interaction.reply("This is not a valid emoji")
        }

        try {
            let emojiCounts = arrayOfMessages.map(message => ({
                content: message.content,
                emojis: message.reactions.cache.get(emoji)?.count || 0,
            }));

            const filteredEmojiCounts = emojiCounts.filter(message => message.emojis > 0)

            const sortedByEmoji = filteredEmojiCounts.sort((a, b) => b.emojis - a.emojis);

            let reply = `Messages ranked by ${emoji} reactions:\n`;
            let msgReply = `Messages ranked by ${emoji} reactions:\n`

            sortedByEmoji.forEach((msg, index) => {
                if (index === 0) {
                    reply += `[${msg.emojis} ${emoji}]\n<${msg.content}>\n`;
                    msgReply += `[${msg.emojis} ${emoji}]\n${msg.content}\n`;
                } else if (sortedByEmoji[index - 1].emojis === msg.emojis) {
                    reply += `<${msg.content}>\n`;
                    msgReply += `${msg.content}\n`;
                } else if (sortedByEmoji[index - 1].emojis > msg.emojis) {
                    reply += `[${msg.emojis} ${emoji}]\n<${msg.content}>\n`;
                    msgReply += `[${msg.emojis} ${emoji}]\n${msg.content}\n`;
                }
            });

            writeFileSync(`logs/${channel.name}-${emoji}.txt`, msgReply)

            await interaction.reply(reply.length > 1999 ? `Output placed in ${channel.name}.txt` : reply);
        } catch (e) {
            console.log("Error Caught!")
        }
    },
};