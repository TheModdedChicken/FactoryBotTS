import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import express from 'express'
import { Client, Collection, Intents, MessageEmbed } from 'discord.js'
import Util from './utility'
import { SlashCommandHandler } from 'tmc-djs-util'

/* Pre Processes */
dotenv.config();
const app = express();

//

/* Main Vars */
const commands_folder = path.join(__dirname, "./commands");
export const bot_token = process.env.BOT_TOKEN;
if (!bot_token) throw new Error("Cannot find bot token");
export const client_id = process.env.CLIENT_ID;
if (!client_id) throw new Error("Cannot find client id");
export const guild_id = process.env.GUILD_ID;
if (!guild_id) throw new Error("Cannot find guild id");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });
const port = process.env.PORT || 6558;

app.get('/ping', (req, res) => {
	res.send("Pong!")
})

app.listen(port)


/* Main Process */
client.once('ready', (data) => {
	console.log(`Logged in as "${data.user.tag}"`);

	Util.RefreshCache(client, guild_id)
	setInterval(() => { Util.RefreshCache(client, guild_id) }, 120000)
});

client.on('roleCreate', async (data) => Util.RefreshCache(client, guild_id));
client.on('roleDelete', async (data) => Util.RefreshCache(client, guild_id));

client.login(bot_token).then(() => {
	const slashCommandHandler = new SlashCommandHandler(client, {
		directories: [commands_folder],
		guild_id,
		refresh: true
	})
	
	slashCommandHandler.on('interactionFailed', async (interaction, err) => {
		if (!interaction.isApplicationCommand()) return;
		await interaction.reply({embeds: [
			new MessageEmbed().setDescription(`There was an error while executing this command!`).setColor("#ff7675")
		], ephemeral: true})
		console.error(err);
	})
});