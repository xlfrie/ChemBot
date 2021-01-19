const config = require("../config.json")
const ms = require('ms')
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "test",
  description: "Experiment every 1 minute to gain test tubes!",
  usage: "",
  aliases: ["exper", "experiment"],
  category: "Fun",
  execute(message, args, client, Discord) {
    const items = new Discord.Collection()
    config.shop.forEach(item => items.set(item.name.split(/ +/).join("+"), item.multiplier))
    if (!db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "work")) db.prepare("INSERT INTO cooldowns (id,ends,type) VALUES (?,?,?)").run(message.author.id, new Date().getTime() - 1, "work")
    var ends = db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "work").ends
    if (ends > new Date().getTime()) return message.reply(`Please wait ${ms(ends - new Date().getTime(), { long: true })}.`)
    var winnings = Math.floor(Math.random() * (100 - 1) + 1) < 5 ? 0 : Math.floor(Math.random() * (1200 - 250) + 250)
    var multiplier = 1;
    JSON.parse(db.prepare("SELECT * FROM inventory WHERE userID = (?)").get(message.author.id).inv).forEach(item => {
      multiplier = multiplier + (items.get(item.split(/ +/).join("+")) >= 1 ? items.get(item.split(/ +/).join("+")) + 1 : items.get(item.split(/ +/).join("+")))
    })
    winnings = Math.ceil(winnings * multiplier)
    var bal = db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id)
    message.channel.send(new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
      .setTimestamp()
      .setDescription(winnings==0?config.zerostories[Math.floor(Math.random() * (Object.keys(config.zerostories).length) + 1).toString()].replace("{tubes}", winnings.toLocaleString()):config.teststories[Math.floor(Math.random() * (Object.keys(config.teststories).length) + 1).toString()].replace("{tubes}", winnings.toLocaleString()))
    )
    // if(config.staff.includes(message.author.id)) return;
    db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(bal.testtubes + winnings, message.author.id)
    db.prepare("UPDATE cooldowns SET ends = (?) WHERE id = (?) AND type = (?)").run(new Date().getTime() + ms("2m"), message.author.id, "work")
  }
}