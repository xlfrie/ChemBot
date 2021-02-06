const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require("../config.json")

module.exports = {
  name: "buy",
  description: "Buy an item for sale!",
  usage: "<item ID>",
  aliases: [],
  category: "Fun",
  async execute(message, args, client, Discord, Topgg, mongoose, Schemas) {
    var bals = mongoose.model("balance", Schemas.balances)
    var invs = mongoose.model("inventorie", Schemas.inventories)
    const items = new Discord.Collection()
    config.shop.forEach(item => items.set(item.name, { name: item.name, price: item.price, acquirable: item.acquirable, multiplier: item.multiplier }))
    items.sort((itemA, itemB) => itemB.price - itemA.price)
    var loop = 1
    items.forEach(item => {
      items.set(item.name, { name: item.name, price: item.price, acquirable: item.acquirable, multiplier: item.multiplier, id: loop })
      loop++
    })
    var buyerBal = await bals.findById(message.author.id)
    if (!args.slice(1).join(" ") || !items.find(item => item.id == args[1])) return message.reply("Please provide a valid item ID to buy.")
    var item = items.find(item => item.id == args[1])
    if ((buyerBal.bal - item.price) < 0) return message.reply("You don't have enough to do this!")
    var buyerInv = await invs.findById(message.author.id)
    if (buyerInv.inv.filter(invItem => invItem == item.name).length == item.acquirable) return message.reply("You already have the max amount of this!")
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
            buyerInv.inv.push(item.name)
            buyerInv.save()
            buyerBal.bal = buyerBal.bal - item.price
            buyerBal.save()
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