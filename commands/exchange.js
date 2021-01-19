const config = require("../config.json")
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "exchange",
  description: "Exchange something for test tubes!",
  usage: "<type>",
  aliases: [],
  category: "Fun",
  execute(message, args, client, Discord) {
    switch(args[1].toLowerCase()) {
      case "xp":
      if(config.noLevel.includes(message.guild.id)) return message.reply("This server doesn't support this!")
      var levels = JSON.parse(db.prepare("SELECT * FROM levels WHERE guildid = (?)").get(message.guild.id).levels)
      if (!levels[message.author.id]) {
        levels[message.author.id] = { "level": 1, "xp": 0, "xpNeeded": 110, "totalXp": 0 }
        db.prepare("UPDATE levels SET levels = (?) WHERE guildid = (?)").run(JSON.stringify(levels), message.guild.id)
      }
      if(levels[message.author.id].totalXp == 0) return message.reply("Please gain some xp before exchanging!")
      var ExchangedAmount = Math.ceil(levels[message.author.id].totalXp * 11)
      message.reply("Are you sure you want to lose **all your xp** for `" + ExchangedAmount.toLocaleString() + "` test tubes?").then(msg => msg.react("✅").then(() => {
      msg.react("❌")
          const filter = (reaction, user) => {
      return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
      msg.awaitReactions(filter, { max: 1, time: 60000 }).then(collected => {
        var reaction = collected.first()
        switch (reaction.emoji.name) {
          case "✅":
            message.reply("Exchanged " + levels[message.author.id].totalXp.toLocaleString() + " xp for " + ExchangedAmount.toLocaleString() + " test tubes!")
            delete levels[message.author.id]
            db.prepare("UPDATE levels SET levels = (?) WHERE guildid = (?)").run(JSON.stringify(levels),message.guild.id)
            db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes + ExchangedAmount, message.author.id)
            break;
          case "❌":
            msg.reactions.removeAll()
            message.reply("Sucessfully cancelled exchange.")
            break;
        }
      })
      }))
      break;
    }
  }
}