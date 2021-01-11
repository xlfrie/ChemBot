const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "leaderboard",
  description: "View the current leaders in test tubes!",
  usage: "",
  aliases: ["lb"],
  category: "Fun",
  execute(message, args, client, Discord) {
    var lb = new Discord.Collection()
    db.prepare("SELECT * FROM balances").all().forEach(item => lb.set(item.testtubes, { tubes: item.testtubes, id: item.id }))
    lb.sort((itemA, itemB) => parseInt(itemB.tubes) - parseInt(itemA.tubes))
    var lbFields = []
    var lbNum = 0;
    lb.each(item => {
      lbNum = lbNum + 1
      lbFields.push(`**${lbNum}.** ${item.tubes.toLocaleString()} - **${client.users.cache.get(item.id).tag}**`)
    })
    var em = new Discord.MessageEmbed()
      .setTitle("Leaderboard")
      .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
      .setFooter(`Requested by ${message.author.tag}.`, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(lbFields.join("\n"))
    message.channel.send(em)
  }
}