const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require("../config.json")

module.exports = {
  name: "buy",
  description: "Buy an item for sale!",
  usage: "<item ID>",
  aliases: [],
  category: "Fun",
  execute(message, args, client, Discord) {
    const items = new Discord.Collection()
    config.shop.forEach(item => items.set(item.name, { name: item.name, price: item.price, acquirable: item.acquirable, multiplier: item.multiplier }))
    items.sort((itemA, itemB) => itemB.price - itemA.price)
    var loop = 1
    items.forEach(item => {
      items.set(item.name, { name: item.name, price: item.price, acquirable: item.acquirable, multiplier: item.multiplier, id: loop })
      loop++
    })
    var buyerBal = db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id)
    if (!args.slice(1).join(" ") || !items.find(item => item.id == args[1])) return message.reply("Please provide a valid item ID to buy.")
    var item = items.find(item => item.id == args[1])
    if ((buyerBal.testtubes - item.price) < 0) return message.reply("You don't have enough to do this!")
    var buyerInv = db.prepare("SELECT * FROM inventory WHERE userID = (?)").get(message.author.id)
    if (JSON.parse(buyerInv.inv).filter(invItem => invItem == item.name).length == item.acquirable) return message.reply("You already have the max amount of this!")
    const filter = (reaction, user) => {
      return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    message.reply(`Are you sure you want to buy **${item.name}** for **${item.price.toLocaleString()} test tubes**`).then(msg => msg.react("✅").then(() => {
      msg.react("❌")
      msg.awaitReactions(filter, { max: 1, time: 60000 }).then(collected => {
        var reaction = collected.first()
        switch (reaction.emoji.name) {
          case "✅":
            msg.reactions.removeAll()
            buyerInv.inv = JSON.parse(buyerInv.inv)
            buyerInv.inv.push(item.name)
            db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(buyerBal.testtubes - item.price, message.author.id)
            db.prepare("UPDATE inventory SET inv = (?) WHERE userID = (?)").run(JSON.stringify(buyerInv.inv), message.author.id)
            message.reply(`Sucessfully bought **${item.name}** for **${item.price.toLocaleString()} test tubes**!`)
            break;
          case "❌":
            msg.reactions.removeAll()
            message.reply("Sucessfully cancelled order.")
            break;
        }
      })
    }))
  }
}