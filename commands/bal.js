const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require("../config.json")

module.exports = {
  name: "balance",
  description: "Get yours or someone else's balance!",
  usage: "[@User]",
  aliases: ["bal", "money"],
  category: "Fun",
  async execute(message, args, client, Discord, dbl, mongoose, Schemas) {
    var bal = new Discord.MessageEmbed()
    .setTimestamp()
    .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    var multipliers = new Discord.Collection()
    if (!args[1]) {
      var invs = mongoose.model("inventorie", Schemas.inventory)
      var inv = await invs.findById(message.author.id)
      inv.inv.forEach(item => {
        multipliers.set(item, config.shop.find(shopIt => shopIt.name == item).multiplier)
      })
      multipliers.sort((a, b) => b - a)
      var balance = mongoose.model("balance", Schemas.balances)
      var userBal = await balance.findById(message.author.id)
      var inv = multipliers.map(item => multipliers.findKey(it => it == item)).join("\n")
      if(inv.length == 0) inv = "No items found."
      bal.setDescription(`**Balance**: ${userBal.bal.toLocaleString()} test tubes\n\n**Inventory**:\n${inv}`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL({  dynamic:true  }))
    } else {
      var user = message.mentions.users.first() || await client.users.fetch(args[1])
      var balances = mongoose.model("balance", Schemas.balances)
      var userBal = await balances.findById(user.id)
      if (!userBal) return message.reply("This person isn't participating in this!")
      var invs = mongoose.model("inventorie", Schemas.inventory)
      var inv = await invs.findById(user.id)
      if(!inv) inv = await new invs({ _id: user.id }).save()
      inv.inv.forEach(item => {
        multipliers.set(item, config.shop.find(shopIt => shopIt.name == item).multiplier)
      })
      multipliers.sort((a, b) => b - a)
      inv = multipliers.map(item => multipliers.findKey(it => it == item)).join("\n")
      if(!inv) inv = "No items found."
      bal.setDescription(`**Balance**: ${userBal.bal.toLocaleString()} test tubes\n\n**Inventory**:\n${inv}`)
      .setAuthor(user.tag, user.displayAvatarURL({  dynamic:true  }))
    }
    message.channel.send(bal)
  }
}