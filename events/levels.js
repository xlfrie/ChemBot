const config = require("../config.json")
const ms = require('ms')
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  event: "message",
  execute(client, Discord) {
    client.on("message", message => {
      if(message.author.bot) return;
      if(config.noLevel.includes(message.guild.id)) return;
      var expNeeded = 110
      if(!db.prepare("SELECT * FROM levels WHERE guildid = (?)").get(message.guild.id)) db.prepare("INSERT INTO levels (guildid,levels) VALUES (?,?)").run(message.guild.id, JSON.stringify({}))
      var levels = JSON.parse(db.prepare("SELECT * FROM levels WHERE guildid = (?)").get(message.guild.id).levels)
      if(!levels[message.author.id]) {
        levels[message.author.id] = {"level":1,"xp":0,"xpNeeded": expNeeded,"totalXp":0}
        db.prepare("UPDATE levels SET levels = (?) WHERE guildid = (?)").run(JSON.stringify(levels), message.guild.id)
      }
      var cooldown = db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "level")
      if(!cooldown) db.prepare("INSERT INTO cooldowns (id,ends,type) VALUES (?,?,?)").run(message.author.id, Date.now(), "level")
      cooldown = db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "level")
      if(cooldown.ends > Date.now()) return;
      var xpChange = Math.floor(Math.random() * (26 - 12 + 1) + 12)
      levels[message.author.id].xp = levels[message.author.id].xp + xpChange;
      levels[message.author.id].totalXp = levels[message.author.id].totalXp + xpChange
      if(levels[message.author.id].xp >= levels[message.author.id].xpNeeded) {
        levels[message.author.id].level++
        levels[message.author.id].xpNeeded = Math.ceil(levels[message.author.id].xpNeeded * 1.6 )
        levels[message.author.id].xp = 0
        message.reply("GG, you just leveled up to level " + levels[message.author.id].level + "!")
      }
      db.prepare("UPDATE levels SET levels = (?) WHERE guildid = (?)").run(JSON.stringify(levels), message.guild.id)
      db.prepare("UPDATE cooldowns SET ends = (?) WHERE type = (?) AND id = (?)").run(Date.now() + ms("1m"), "level", message.author.id)
    })
  }
}