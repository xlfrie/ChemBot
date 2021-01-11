const config = require('../config.json')
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  event: "messageReaction",
  execute(client, Discord) {
    client.on("messageReactionAdd", async (reactionR, userR) => {
      var reaction = reactionR
      if(reaction.partial) reaction = await reaction.fetch()
      if(!["797999474366349323"].includes(reaction.message.id)) return;
      switch (reaction.message.id) {
        case "797999474366349323":
        var member = await reaction.message.guild.members.fetch(userR.id)
        switch(reaction.emoji.name) {
          case "📣":
            member.roles.add(reaction.message.guild.roles.cache.get("797868617097412639"))
          break;
          case"📊":
          member.roles.add(reaction.message.guild.roles.cache.get("797882185150889995"))
          break;
          case "📌":
          member.roles.add(reaction.message.guild.roles.cache.get("798021012821377034"))
          break;
        }
        break;
      }
    })
    client.on("messageReactionRemove", async (reactionR, userR) => {
      var reaction = reactionR
      if(reaction.partial) reaction = await reaction.fetch()
      if(!["797999474366349323"].includes(reaction.message.id)) return;
      switch (reaction.message.id) {
        case "797999474366349323":
        var member = await reaction.message.guild.members.fetch(userR.id)
        switch(reaction.emoji.name) {
          case "📣":
            member.roles.remove(reaction.message.guild.roles.cache.get("797868617097412639"))
          break;
          case"📊":
          member.roles.remove(reaction.message.guild.roles.cache.get("797882185150889995"))
          break;
          case "📌":
          member.roles.remove(reaction.message.guild.roles.cache.get("798021012821377034"))
          break;
        }
        break;
      }
    })
  }
}