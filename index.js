const ms = require('ms')
const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] })
const generalCooldowns = new Discord.Collection()
const fun = require("./fun-ctions.js")
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
  client.guilds.cache.forEach(guild => guild.members.fetch())
  setTimeout(function() {
      client.user.setPresence({
		activity: {
			type: "WATCHING",
			name: client.users.cache.size.toLocaleString() + " users!"
		},
		status: "dnd"
	})
  }, 1000)
  require("./events/welcome.js").execute(client, Discord)
  require("./events/submissions.js").execute(client, Discord)
  require("./events/reactionrole.js").execute(client, Discord)
	console.log(`Logged into ${client.user.tag}`)
  db.prepare("CREATE TABLE IF NOT EXISTS cooldowns (id,ends,type)").run()
  db.prepare("CREATE TABLE IF NOT EXISTS balances (id,testtubes)").run()
  db.prepare("CREATE TABLE IF NOT EXISTS replys (authorid,type,reply)").run()
  db.prepare("CREATE TABLE IF NOT EXISTS submissions (type,subid,submission,submitter)").run()
  db.prepare("CREATE TABLE IF NOT EXISTS inventory (userID,inv)").run()
  setInterval(function() { client.user.presence.activities[0].name.split(/ +/)[0]!=client.users.cache.size?client.user.setPresence({ activity: { type: "WATCHING", name: client.users.cache.size.toLocaleString() + " users!" }, status: "dnd" }):"" }, 60000)
})

client.on('message', message => {
	if (message.author.bot || !message.content.startsWith(config.prefix) || message.channel.type !== "text") return
	const args = message.content.slice(config.prefix.length).split(/ +/)
	const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()))
  if(message.channel.id == 793684121511526403) return message.reply("Please use these commands in <#793684851021578241>!")
	if (!cmd || (cmd.category == "Dev" && !config.staff.includes(message.author.id)) || (cmd.category == "Access" && !config.bugTesters.includes(message.author.id))) return message.reply('No such command found for ' + Discord.Util.cleanContent(config.prefix + args[0].toLowerCase(), message))
  if(cmd.category == "Fun" || cmd.category == "Access") {
    if(!db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id)) db.prepare("INSERT INTO balances (id,testtubes) VALUES (?,?)").run(message.author.id, 0)
    if(!db.prepare("SELECT * FROM inventory WHERE userID = (?)").get(message.author.id)) db.prepare("INSERT INTO inventory (userID,inv) VALUES (?,?)").run(message.author.id, JSON.stringify([]))
    db.prepare("CREATE TABLE IF NOT EXISTS balances (id,testtubes)").run()
  }
  try {
    if(!generalCooldowns.has(message.author.id)) generalCooldowns.set(message.author.id, 0)
    if(generalCooldowns.get(message.author.id) + ms("2s") > new Date().getTime()) return;
    cmd.execute(message, args, client, Discord)
    generalCooldowns.set(message.author.id, new Date().getTime())
  }
	catch(err) {
    message.reply(`Error: \`${err.toString()}\`\n**If you believe this is a mistake please report this error on the support server which you can get by doing ",invite"**`)
    console.error(err)
  }
})

app.listen(8080)
client.login(process.env.TOKEN)