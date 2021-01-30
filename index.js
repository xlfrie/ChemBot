const ms = require('ms')
const Database = require('better-sqlite3')
const crypto = require('crypto')
const db = new Database("db.txt")
const mongoose = require('mongoose')
const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['REACTION', 'MESSAGE'] })
const generalCooldowns = new Discord.Collection()
const fun = require("./fun-ctions.js")
const express = require('express')
const DBL = require("dblapi.js")
const http = require('http');

const app = express()
const server = http.createServer(app);
const dbl = new DBL(process.env.TOP, {webhookPort: 8080, webhookAuth: process.env.TOPPASS, webhookPath: "/top", webhookServer: server}, client)
const fs = require('fs')
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
const Schema = mongoose.Schema
const Schemas = require("./schemas.js")(mongoose, Schema)
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

app.get("*", (req, res) => {
  res.send(`<html><head></head><body><p>DUDE JUST INVITE THE BOT IDC ABOUT A WEBSITE</p><a href="https://discord.com/oauth2/authorize?client_id=796480356055777360&amp;permissions=8&amp;scope=bot">INVITE HERE</a></body></html>`)
  console.log(req.headers["user-agent"])
})

client.on("rateLimit", rateLimitInfo => console.log(rateLimitInfo))

client.on('ready', () => {
  dbl.webhook.on('vote', vote => {
    if(!db.prepare("SELECT * FROM votes WHERE id = (?)").get(vote.user)) db.prepare("INSERT INTO votes (id) VALUES (?)").run(vote.user)
    db.prepare("UPDATE votes SET voted = (?), votedT = (?) WHERE id = (?)").run("false", Date.now(), vote.user)
  });
  setInterval(() => {
    dbl.postStats(client.guilds.size);
  }, 1800000);
  client.guilds.cache.forEach(guild => guild.members.fetch())
  setTimeout(function() {
    client.user.setPresence({ activity: { type: "WATCHING", name: client.users.cache.size.toLocaleString() + " users!" }, status: "dnd" })
  }, 1000)
  require("./events/welcome.js").execute(client, Discord)
  require("./events/submissions.js").execute(client, Discord)
  require("./events/reactionrole.js").execute(client, Discord)
  require("./events/levels.js").execute(client, Discord, mongoose, Schemas)
  console.log(`Logged into ${client.user.tag}`)
  db.prepare("CREATE TABLE IF NOT EXISTS cooldowns (id,ends,type)").run() // done
  db.prepare("CREATE TABLE IF NOT EXISTS userRequests (id,requests)").run() // done
  db.prepare("CREATE TABLE IF NOT EXISTS balances (id,testtubes)").run() // done
  db.prepare("CREATE TABLE IF NOT EXISTS votes (id,voted,votedT)").run() 
  db.prepare("CREATE TABLE IF NOT EXISTS replys (authorid,type,reply)").run()
  db.prepare("CREATE TABLE IF NOT EXISTS levels (guildid,levels)").run() // done
  db.prepare("CREATE TABLE IF NOT EXISTS companys (company,users,owner,bal)").run() // done
  db.prepare("CREATE TABLE IF NOT EXISTS submissions (type,subid,submission,submitter)").run()
  db.prepare("CREATE TABLE IF NOT EXISTS inventory (userID,inv)").run()
  setInterval(function() { client.user.presence.activities[0].name.split(/ +/)[0] != client.users.cache.size ? client.user.setPresence({ activity: { type: "WATCHING", name: client.users.cache.size.toLocaleString() + " users!" }, status: "dnd" }) : "" }, 60000)
})

client.on('message', async message => {
  if (message.content.trim().startsWith("<@!796480356055777360>")) message.reply(`My prefix is ${config.prefix}`)
  if (message.channel.id == "798231192549720074") message.member.roles.remove(message.guild.roles.cache.get("798231081122922526"))
  if ((message.author.bot && message.author.id !== "796480356055777360") || !message.content.startsWith(config.prefix) || message.channel.type !== "text") return
  const args = message.content.slice(config.prefix.length).split(/ +/)
  const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()))
  if (message.channel.id == 793684121511526403) return message.reply("Please use these commands in <#793684851021578241>!")
  if(message.channel.id == 778802622878187540) return
  if (!cmd || (cmd.category == "Dev" && !config.staff.includes(message.author.id)) || (cmd.category == "Access" && (!config.bugTesters.includes(message.author.id) && message.channel.id !== "798700035134980118"))) return message.reply('No such command found for ' + Discord.Util.cleanContent(config.prefix + args[0].toLowerCase(), message))
  if (cmd.category == "Fun" || cmd.category == "Access") {
    var bals = mongoose.model("balance", Schemas.balances)
    var userBal = await bals.findById(message.author.id)
    var invs = mongoose.model("inventorie", Schemas.inventory)
    var inv = await invs.findById(message.author.id)
    if (!userBal) new bals({ _id: message.author.id, bal: 0 }).save()
    if (!inv) new invs({ _id: message.author.id, inv: [] }).save()
  }
  try {
    if (!generalCooldowns.has(message.author.id)) generalCooldowns.set(message.author.id, 0)
    if (generalCooldowns.get(message.author.id) + ms("2s") > new Date().getTime() && !config.active.includes(message.author.id)) return;
    cmd.execute(message, args, client, Discord, dbl, mongoose, Schemas)
    generalCooldowns.set(message.author.id, new Date().getTime())
  }
  catch (err) {
    message.reply(`Error: \`${err.toString()}\`\n**If you believe this is a mistake please report this error on the support server which you can get by doing ",invite"**`)
    console.error(err)
  }
})

server.listen(8080)
client.login(process.env.TOKEN)