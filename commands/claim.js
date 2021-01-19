const ms = require('ms')
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "claim",
  description: "Claim your rewards!.",
  usage: "",
  aliases: [],
  category: "Dev",
  async execute(message, args, client, Discord, dbl) {
    switch (args[1] ? args[1].toLowerCase() : undefined) {
      default:
        message.reply("Please provide something to claim.")
        break;
      case 'daily':
        if (!db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "daily")) db.prepare("INSERT INTO cooldowns (id,ends,type) VALUES (?,?,?)").run(message.author.id, Date.now() - 1, "daily")
        if (db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "daily").ends > Date.now()) return message.reply("Please wait " + ms(db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "daily").ends - Date.now(), { long: true }))
        db.prepare("UPDATE cooldowns SET ends = (?) WHERE id = (?) AND type = (?)").run(Date.now() + ms("1d"), message.author.id, "daily")
        var dailyEarnings = Math.floor(Math.random() * (10000 - 5000 + 1) + 5000);
        message.reply(`Claimed \`${dailyEarnings.toLocaleString()}\` test tubes as your daily earnings!`)
        db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes + dailyEarnings, message.author.id)
        break;
      case 'vote':
        var hasvoted = await dbl.hasVoted(message.author.id)
        if(!db.prepare("SELECT * FROM votes WHERE id = (?)").get(message.author.id)) return message.reply("You can't claim this reward since you haven't voted for the bot. \nVote here: https://top.gg/bot/796480356055777360")
        if (!hasvoted) return message.reply("You can't claim this reward since you haven't voted for the bot. \nVote here: https://top.gg/bot/796480356055777360")
        if(db.prepare("SELECT * FROM votes WHERE id = (?)").get(message.author.id).votedT + ms('12h') > Date.now() && db.prepare("SELECT * FROM votes WHERE id = (?)").get(message.author.id).voted == 'true') return message.reply(`You have already claimed this reward. Please wait ${ms(ms("12h") - (Date.now() - db.prepare("SELECT * FROM votes WHERE id = (?)").get(message.author.id).votedT), { long: true })}`)
        db.prepare("UPDATE votes SET voted = (?) WHERE id = (?)").run('true', message.author.id)
        var voteEarnings = Math.floor(Math.random() * (5000 - 2500 + 1) + 2500);
        message.reply(`Claimed \`${voteEarnings.toLocaleString()}\` **test tubes** as your vote reward! Thanks for voting.`)
        db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes + voteEarnings, message.author.id)
        break;
    }
  }
}