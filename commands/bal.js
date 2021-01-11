const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "balance",
  description: "Get yours or someone else's balance!",
  usage: "[@User]",
  aliases: ["bal", "money"],
  category: "Fun",
  async execute(message, args, client, Discord) {
    var bal = new Discord.MessageEmbed()
    .setTimestamp()
    .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
    if (!args[1]) {
      var inv = JSON.parse(db.prepare("SELECT * FROM inventory WHERE userID = (?)").get(message.author.id).inv).join("\n")
       if(inv.length == 0) inv = "No items found."
      bal.setDescription(`**Balance**: ${db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes.toLocaleString()} test tubes\n\n**Inventory**:\n${inv}`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL({  dynamic:true  }))
    } else {
      var user = message.mentions.users.first() || await client.users.fetch(args[1])
      if (!db.prepare("SELECT * FROM balances WHERE id = (?)").get(user.id)) return message.reply("This person isn't participating in this!")
      var inv = JSON.parse(db.prepare("SELECT * FROM inventory WHERE userID = (?)").get(user.id).inv).join("\n")
      if(inv.length == 0) inv = "No items found."
      bal.setDescription(`**Balance**: ${db.prepare("SELECT * FROM balances WHERE id = (?)").get(user.id).testtubes.toLocaleString()} test tubes\n\n**Inventory**:\n${inv}`)
      .setAuthor(user.tag, user.displayAvatarURL({  dynamic:true  }))
    }
    message.channel.send(bal)
  }
}