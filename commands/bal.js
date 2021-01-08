const Database = require('better-sqlite3')
const db = new Database("db.txt", { verbose: console.log })

module.exports = {
  name: "balance",
  description: "Get yours or someone else's balance!",
  usage: "[@User]",
  aliases: ["bal","money"],
  execute(message, args, client, Discord) {
    if(message.mentions.users.array() == "") {
      message.reply(`You have **${db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes}** test tubes!`)
    } else {
    }
  }
}