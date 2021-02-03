const config = require("../config.json")
const ms = require('ms')
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "test",
  description: "Experiment every 2 minutes to gain test tubes!",
  usage: "",
  aliases: ["exper", "experiment"],
  category: "Fun",
  async execute(message, args, client, Discord, dbl, mongoose, Schemas) {
    const items = new Discord.Collection()
    var cooldowns = mongoose.model("cooldown", Schemas.cooldowns)
    var cooldown = await cooldowns.findOne({ id: message.author.id, type: "work" })
    config.shop.forEach(item => items.set(item.name.split(/ +/).join("+"), item.multiplier))
    if (!cooldown) {
      cooldown = await new cooldowns({ ends: new Date().getTime() - 1, id: message.author.id, type: "work" }).save()
    }
    var ends = cooldown.ends
    if (ends > new Date().getTime()) return message.reply(`Please wait ${ms(ends - new Date().getTime(), { long: true })}.`)
    var winnings = Math.floor(Math.random() * (100 - 1) + 1) < 5 ? 0 : Math.floor(Math.random() * (1200 - 250) + 250)
    var multiplier = 1;
    var inventories = mongoose.model("inventorie", Schemas.inventories)
    var inventory = await inventories.findById(message.author.id)
    inventory.inv.forEach(item => {
      multiplier = multiplier + (items.get(item.split(/ +/).join("+")) >= 1 ? items.get(item.split(/ +/).join("+")) + 1 : items.get(item.split(/ +/).join("+")))
    })
    var companys = mongoose.model("companie", Schemas.companies)
    var company = (await companys.find()).find(company => company.users.includes(message.author.id))
    if(company && company.multipliers) {
      company.multipliers.forEach(it => {
       if(config.cShop.find(item => item.name == it)) multiplier = multiplier + config.cShop.find(item => item.name == it).multiplier
      })
    } 
    console.log(multiplier)
    winnings = Math.ceil(winnings * multiplier)
    var bals = mongoose.model("balance", Schemas.balances)
    var bal = await bals.findById(message.author.id)
    message.channel.send(new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
      .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
      .setTimestamp()
      .setDescription(winnings==0?config.zerostories[Math.floor(Math.random() * (Object.keys(config.zerostories).length) + 1).toString()].replace("{tubes}", winnings.toLocaleString()):config.teststories[Math.floor(Math.random() * (Object.keys(config.teststories).length) + 1).toString()].replace("{tubes}", winnings.toLocaleString()))
    )
    // if(config.staff.includes(message.author.id)) return;
    bal.bal = bal.bal + winnings
    bal.save()
    cooldown.ends = Date.now() + ms("2m")
    cooldown.save()
  }
}