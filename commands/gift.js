const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "gift",
  description: "Be a nice friend and gift someone test tubes!",
  usage: "<@User>",
  aliases: ["give"],
  category: "Fun",
  async execute(message, args, client, Discord) {
    if (!args[1] || !args[2]) return message.reply("Please provide a user to gift to and an ammount of test tubes to gift!")
    var gifting = parseInt(args[2].split(",").join(""))
    if (gifting < 10) return message.reply("The minimium amount to gift is 10 test tubes!")
    var user = message.mentions.users.first() || await client.users.fetch(args[1])
    if (!user || user.bot) return message.reply("No user found.")
    if (!db.prepare("SELECT * FROM balances WHERE id = (?)").get(user.id)) db.prepare("INSERT INTO balances (id,testtubes) VALUES (?,?)").run(user.id, 0)
    var gifterBal = db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id)
    var giftedBal = db.prepare("SELECT * FROM balances WHERE id = (?)").get(user.id)
    if (gifterBal.testtubes - gifting < 0) return message.reply("You can't do this!")
    message.reply(`Gifted \`${gifting.toLocaleString()}\` **test tubes** to ${user.tag}`)
    console.log(gifting)
    console.log(giftedBal.testtubes)
    db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(gifterBal.testtubes - gifting, message.author.id)
    db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(giftedBal.testtubes + gifting, user.id)
  }
}