const config = require("../config.json")
const ms = require('ms')
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  event: "message",
  async execute(client, Discord, mongoose, Schemas) {
    client.on("message", async (message) => {
      if(message.author.bot) return;
      if(config.noLevel.includes(message.guild.id)) return;
      var expNeeded = 110
      var level = mongoose.model("level", Schemas.levels)
      var levels = await level.findOne({ guildid: message.guild.id })
      if(!levels) levels = await new level({ guildid: message.guild.id, levels: {} }).save()
      console.log(levels)
      if(!levels.levels.get(message.author.id)) {
        levels.levels.set(message.author.id, {"level":1,"xp":0,"xpNeeded": expNeeded,"totalXp":0})
        levels.save()
      }
      var cooldowns = mongoose.model("cooldown", Schemas.cooldowns)
      var cooldown = await cooldowns.findOne({ id: message.author.id, type: "level" })
      if(!cooldown) cooldown = await new cooldowns({ id: message.author.id, type: "level", ends: 0 }).save()
      if(cooldown.ends > Date.now()) return;
      var xpChange = Math.floor(Math.random() * (26 - 12 + 1) + 12)
      levels.levels.get(message.author.id).xp = levels.levels.get(message.author.id).xp + xpChange;
      levels.levels.get(message.author.id).totalXp = levels.levels.get(message.author.id).totalXp + xpChange
      if(levels.levels.get(message.author.id).xp >= levels.levels.get(message.author.id).xpNeeded) {
        levels.levels.get(message.author.id).level++
        levels.levels.get(message.author.id).xpNeeded = Math.ceil(levels.levels.get(message.author.id).xpNeeded * 1.6 )
        levels.levels.get(message.author.id).xp = 0
        message.reply("GG, you just leveled up to level " + levels.levels.get(message.author.id).level + "!")
      }
      console.log((await levels.save()))
      cooldown.ends = Date.now() + ms("1m")
      cooldown.save()
    })
  }
}