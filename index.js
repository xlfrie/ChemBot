const Database = require('better-sqlite3')
const db = new Database("db.txt", { verbose: console.log })
const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client()
const express = require('express')
const app = express()
const fs = require('fs')
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

app.get("*", (req, res) => {
	res.status(404).send()
	console.log(req.headers["user-agent"])
})

client.on('ready', () => {
	console.log(`Logged into ${client.user.tag}`)
  db.prepare("CREATE TABLE IF NOT EXISTS cooldowns (id,ends,type)").run()
	client.user.setPresence({
		activity: {
			type: "WATCHING",
			name: client.guilds.cache.size.toLocaleString() + " servers!"
		},
		status: "dnd"
	})
})

client.on('message', message => {
	if (message.author.bot || !message.content.startsWith(config.prefix)) return
	const args = message.content.slice(config.prefix.length).split(/ +/)
	const cmd = client.commands.get(args[0]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]))
	if (!cmd) return message.reply('No such command found for ' + Discord.Util.cleanContent(config.prefix + args[0], message))
  if(cmd.category == "Fun") {
    if(!db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id)) db.prepare("INSERT INTO balances (id,testtubes) VALUES (?,?)").run(message.author.id, 0)
    db.prepare("CREATE TABLE IF NOT EXISTS balances (id,testtubes)").run()
  }
	cmd.execute(message, args, client, Discord)
})

app.listen(8080)
client.login(process.env.TOKEN)