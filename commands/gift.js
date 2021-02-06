const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "gift",
  description: "Be a nice friend and gift someone test tubes!",
  usage: "<@User> <Amount of testtubes>",
  aliases: ["give"],
  category: "Fun",
  async execute(message, args, client, Discord, Topgg, mongoose, Schemas) {
    var bals = mongoose.model("balance", Schemas.balances)
    var gifterBal = await bals.findById(message.author.id)
    if (!args[1] || !args[2]) return message.reply("Please provide a user to gift to and an ammount of test tubes to gift!")
    var gifting = args[2].toLowerCase()=="all"?gifterBal.bal:parseInt(args[2].split(",").join(""))
    var user = message.mentions.users.first() || await client.users.fetch(args[1])
    var giftedBal = await bals.findById(user.id)
    if(message.author.id == user.id) return message.reply("You can't gift to yourself!")
    if (gifting < 10 || isNaN(gifting)) return message.reply("The minimium amount to gift is 10 test tubes!")
    var user = message.mentions.users.first() || await client.users.fetch(args[1])
    if (!user || user.bot) return message.reply("No user found.")
    if (!giftedBal) giftedBal = await new bals({ _id: user.id, bal: 0 })
    if (gifterBal.bal - gifting < 0) return message.reply("You can't do this!")
    message.reply(`Gifted \`${gifting.toLocaleString()}\` **test tubes** to ${user.tag}`)
    gifterBal.bal = gifterBal.bal - gifting
    gifterBal.save()
    giftedBal.bal = giftedBal.bal + gifting
    giftedBal.save()
  }
}