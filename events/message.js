const auth = require('../auth.json');
const ai = require('../ai/ai');
module.exports = {
    name: 'messageCreate',
    async execute(message) {

        let { content, author } = message;

        if (author.bot || !auth.authorizedUsers.includes(author.id)) return;

        if (content.includes('869365872391770172')) {
            console.log(`Creating message for author ${author.id}`)
            test = await ai.run({
                message: content,
            })

            return message.channel.send(`<@${author.id}>\n${test}`)

        }

    }


}