const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require("../config.json")

module.exports = {
  name: "balance",
  description: "Get yours or someone else's balance!",
  usage: "[@User]",
  aliases: ["bal", "money"],
  category: "Fun",
  async execute(message, args, client, Discord, Topgg, mongoose, Schemas) {
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
      // bal.setDescription(`**Balance**: ${userBal.bal.toLocaleString()} test tubes\n\n**Inventory**:\n${inv}`)
      const Acknowledgments = ["ChemBot User"]
      if(config.Acknowledgments[message.author.id]) {
        config.Acknowledgments[message.author.id].forEach(it => Acknowledgments.push(it))
      }
      bal.addFields(
        { value: `**Balance**: ${userBal.bal.toLocaleString()}\n\n**Inventory**:\n${inv}`, name: "\u200b", inline: true },
        { value: `**Acknowledgments**:\n${Acknowledgments.join(", ")}`, name: "\u200b", inline: true })
        .setAuthor(message.author.tag, message.author.displayAvatarURL({  dynamic:true  }))
    } else {
      var user = message.mentions.users.first() || await client.users.fetch(args[1])
      var invs = mongoose.model("inventorie", Schemas.inventory)
      var inv = await invs.findById(user.id)
      inv.inv.forEach(item => {
        multipliers.set(item, config.shop.find(shopIt => shopIt.name == item).multiplier)
      })
      multipliers.sort((a, b) => b - a)
      var balance = mongoose.model("balance", Schemas.balances)
      var userBal = await balance.findById(user.id)
      var inv = multipliers.map(item => multipliers.findKey(it => it == item)).join("\n")
      if(inv.length == 0) inv = "No items found."
      // bal.setDescription(`**Balance**: ${userBal.bal.toLocaleString()} test tubes\n\n**Inventory**:\n${inv}`)
      const Acknowledgments = ["ChemBot User"]
      if(config.Acknowledgments[user.id]) {
        config.Acknowledgments[user.id].forEach(it => Acknowledgments.push(it))
      }
      bal.addFields(
        { value: `**Balance**: ${userBal.bal.toLocaleString()}\n\n**Inventory**:\n${inv}`, name: "\u200b", inline: true },
        { value: `**Acknowledgments**:\n${Acknowledgments.join(", ")}`, name: "\u200b", inline: true })
        .setAuthor(user.tag, user.displayAvatarURL({  dynamic:true  }))
    }
    message.channel.send(bal)
  }
}
