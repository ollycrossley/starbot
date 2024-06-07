const {SlashCommandBuilder} = require('discord.js');
const {writeFileSync} = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank-any')
        .setDescription('Ranks posts in a channel by any given emoji')
        .addStringOption(emoji =>
            emoji.setName('emoji')
                .setRequired(true)
                .setDescription('The emoji you want to rank with (Raw emoji ONLY)')
                .setMaxLength(1)
                .setMinLength(1))
        .addStringOption(regex =>
            regex.setName("regex")
                .setRequired(false)
                .setDescription("Add an optional regex filter for further filtering"))
        .addBooleanOption(bool =>
            bool.setName("include-null-cases")
                .setRequired(false)
                .setDescription("Adds an optional filter for including or removing null cases (default true)")),
    async execute(interaction) {

        // Getting Option Data
        const userEmoji = interaction.options.getString("emoji")
        const userRegex = interaction.options.getString("regex") || ""
        const includeNull = interaction.options.getBoolean("include-null-cases")

        // Defining global variables
        let arrayOfMessages = []
        const channel = interaction.channel;
        const messages = await channel.messages.fetch();

        // Filtering for self detected messages
        messages.forEach(message => {
            if ((message.author.id !== "1248299736365269122")) arrayOfMessages.push(message)
        })

        // Checking for valid Regex input
        let isRegexValid = false;
        let formattedRegex = undefined
        if (userRegex !== "") {
            try {
                formattedRegex = new RegExp(userRegex, "i");
                isRegexValid = true
            } catch (e) {
                // do nothing
            }
        }

        // Checking for valid emoji
        let emoji = undefined
        if (/\p{Emoji_Presentation}/gu.test(userEmoji)) {
            emoji = userEmoji
        } else {
            interaction.reply("This is not a valid emoji")
        }

        // Formatting data

        let filteredEmojiCounts = arrayOfMessages.map(message => ({
            content: message.content,
            emojis: message.reactions.cache.get(emoji)?.count || 0,
            link: message.content.includes("http")
        }))

        // Filtering Data from option results
        if (!includeNull) {
            filteredEmojiCounts = filteredEmojiCounts.filter(message => message.emojis > 0)
        }

        if (isRegexValid) {
            filteredEmojiCounts = filteredEmojiCounts.filter(message => {
                const trimmedContent = message.content.trim();
                return formattedRegex.test(trimmedContent);
            });
        }

        // Sorting by the highest count
        const sortedByEmoji = filteredEmojiCounts.sort((a, b) => b.emojis - a.emojis);

        // Setting up headings for text file and message
        let reply = `Messages ranked by ${emoji} reactions:\n`;
        let msgReply = `Messages ranked by ${emoji} reactions:\n`

        // Text Processing
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

        await interaction.reply(reply.length > 1999 ? `Output placed in ${channel.name}.txt` : reply); // Won't output if over max discord character limit

    },
};