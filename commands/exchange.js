const config = require("../config.json")
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "exchange",
  description: "Exchange something for test tubes!",
  usage: "<type>",
  aliases: [],
  category: "Fun",
  async execute(message, args, client, Discord, dbl, mongoose, Schemas) {
    switch(args[1].toLowerCase() || args[1]) {
      case "xp":
      if(config.noLevel.includes(message.guild.id)) return message.reply("This server doesn't support this!")
      var levelModel = mongoose.model("level", Schemas.levels)
      var bals = mongoose.model("balance", Schemas.balances)
      var bal = await bals.findById(message.author.id)
      var levels = await levelModel.findOne({ guildid: message.guild.id })
      if (!levels.levels.get(message.author.id)) {
        levels.levels.set(message.author.id, { "level": 1, "xp": 0, "xpNeeded": 110, "totalXp": 0 })
        levels.save()
      }
      if(levels.levels.get(message.author.id).totalXp == 0) return message.reply("Please gain some xp before exchanging!")
      var ExchangedAmount = Math.ceil(levels.levels.get(message.author.id).totalXp * 11)
      message.reply("Are you sure you want to lose **all your xp** for `" + ExchangedAmount.toLocaleString() + "` test tubes?").then(msg => msg.react("✅").then(() => {
      msg.react("❌")
          const filter = (reaction, user) => {
      return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
      msg.awaitReactions(filter, { max: 1, time: 60000 }).then(collected => {
        var reaction = collected.first()
        switch (reaction.emoji.name) {
          case "✅":
            message.reply("Exchanged " + levels.levels.get(message.author.id).totalXp.toLocaleString() + " xp for " + ExchangedAmount.toLocaleString() + " test tubes!")
            levels.levels.delete(message.author.id)
            levels.save()
            bal.bal = bal.bal + ExchangedAmount
            bal.save()
            msg.reactions.removeAll()
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