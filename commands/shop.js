const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require("../config.json")

module.exports = {
  name: "shop",
  description: "List all products for sale!",
  usage: "",
  aliases: [],
  category: "Fun",
  execute(message, args, client, Discord) {
    var shop = new Discord.Collection()
    config.shop.forEach(item => shop.set(item.price, { name: item.name, price: item.price }))
    shop.sort((itemA, itemB) => itemB.price - itemA.price)
    var itemNum = 0
    const shopEm = new Discord.MessageEmbed()
      .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
      .setTitle("Shop")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    shopEm.setDescription(shop.first(10).map(item => {
      itemNum = itemNum + 1
      return `${itemNum}. ${item.name} - ${item.price.toLocaleString()} **test tubes**`
    }).join("\n"))
    message.reply(shopEm)
  }
}