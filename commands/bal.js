const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "balance",
  description: "Get yours or someone else's balance!",
  usage: "[@User]",
  aliases: ["bal", "money"],
  category: "Fun",
  execute(message, args, client, Discord) {
    if (message.mentions.users.array() == "") {
      message.reply(`You have **${db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes.toLocaleString()}** test tubes!`)
    } else {
      var user = message.mentions.users.first()
      message.reply(`\`${user.tag}\` has **${db.prepare("SELECT * FROM balances WHERE id = (?)").get(user.id).testtubes.toLocaleString()}** test tubes!`)
    }
  }
}