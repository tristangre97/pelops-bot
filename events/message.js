const auth = require('../auth.json');

module.exports = {
    name: 'messageCreate',
    async execute(message) {

        let { content, author} = message;

        if(author.bot || !auth.authorizedUsers.includes(author.id)) return;


    }


}