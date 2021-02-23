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
const Giveaway = require('./giveawayManager.js')
globalThis.update = fun.update
const express = require('express')
const Topgg = require("@top-gg/sdk");
const http = require('http');
const ytdl = require('ytdl-core')

const app = express()
const webhook = new Topgg.Webhook(process.env.TOPPASS)
const api = new Topgg.Api(process.env.TOP)
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
  client.guilds.cache.forEach(guild => guild.members.fetch())
  setTimeout(function() {
    client.user.setPresence({ activity: { type: "WATCHING", name: client.guilds.cache.reduce((accumulator, currentValue) => accumulator + (currentValue.memberCount == undefined ? 0 : parseInt(currentValue.memberCount)), 0).toLocaleString() + " users!" }, status: "dnd" })
  }, 2000)
  setInterval(() => {
    api.postStats({
      serverCount: client.guilds.cache.size
    })
  }, ms("30m"))
  require("./events/welcome.js").execute(client, Discord)
  require("./events/submissions.js").execute(client, Discord, Schemas, mongoose)
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
  setInterval(function() { client.user.presence.activities[0].name.split(/ +/)[0] != client.users.cache.size ? client.user.setPresence({ activity: { type: "WATCHING", name: client.guilds.cache.reduce((accumulator, currentValue) => accumulator + (currentValue.memberCount == undefined ? 0 : parseInt(currentValue.memberCount)), 0).toLocaleString() + " users!" }, status: "dnd" }) : "" }, 60000)
  var gmod = mongoose.model("giveaway", Schemas.giveaways)
  gmod.find().then(giveaways => {
    giveaways.forEach(giveaway => new Giveaway.Manager(giveaway, client, mongoose, Schemas))
  })
})

client.on('message', async message => {
  if (message.channel.id == "798231192549720074") message.member.roles.remove(message.guild.roles.cache.get("798231081122922526"))
  if ((message.author.bot && message.author.id !== "796480356055777360") || (!message.content.startsWith(config.prefix)) || message.channel.type !== "text") return
  const args = message.content.slice(config.prefix.length).split(/ +/)
  if (!args[0]) args[0] = 'help'
  var cmd = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()))
  if (message.channel.id == 793684121511526403) return message.reply("Please use these commands in <#793684851021578241>!")
  if (message.channel.id == 778802622878187540) return
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
    cmd.execute(message, args, client, Discord, Topgg, mongoose, Schemas, api)
    generalCooldowns.set(message.author.id, new Date().getTime())
  }
  catch (err) {
    message.reply(`Error: \`${err.toString()}\`\n**If you believe this is a mistake please report this error on the support server which you can get by doing ",invite"**`)
    console.error(err)
  }
})

app.post("/top", webhook.middleware(), async (req, res) => {
  (await client.users.fetch(req.vote.user)).send("Thanks for voting! Voting on top.gg helps make us more well known! In the support server you can get rewards for voting!")
  var votemod = mongoose.model("vote", Schemas.votes)
  var votes = await votemod.findById(req.vote.user)
  if(!votes) votes = new votemod({ _id: req.vote.user, votes: 0, tag: (await client.users.fetch(req.vote.user)).tag, voted: 1 })
  votes.votes++
  votes.tag = (await client.users.fetch(req.vote.user)).tag
  votes.voted = Date.now()
  if(req.vote.isWeekend) votes.votes++
  await votes.save()
  fun.voteLb(client, mongoose, Schemas)
})

app.listen(8080)
client.login(process.env.TOKEN)