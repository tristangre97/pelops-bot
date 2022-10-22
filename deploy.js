const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const config = require("./auth.json");
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, '/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const clientId = '869365872391770172';
const guildId = '682387138763161630';


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command);
  }

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			// Routes.applicationGuildCommands(clientId, guildId),
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();