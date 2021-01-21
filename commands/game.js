const ms = require("ms")
const config = require("../config.json")
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "minigame",
  description: "Play a mini game for test tubes.",
  usage: "",
  aliases: ["mini"],
  category: "Fun",
  async execute(message, args, client, Discord, dbl, mongoose, Schemas) {
    var game = Math.floor(Math.random() * (1 - 1 + 1) + 1)
    var cooldowns = mongoose.model("cooldown", Schemas.cooldowns)
    var cooldown = await cooldowns.findOne({ id: message.author.id, type: "minigame" })
    if (!cooldown) {
      cooldown = await new cooldowns({ ends: new Date().getTime() - 1, id: message.author.id, type: "work" }).save()
    }
    if (cooldown.ends > Date.now()) return message.reply(`Please wait ${ms(cooldown.ends - Date.now(), { long: true })}`)
    switch (game) {
      case 1:
        var num1 = Math.floor(Math.random() * (6 - 1 + 1) + 1)
        var num2 = Math.floor(Math.random() * (6 - 1 + 1) + 1)
        var msg = []
        var line = []
        var lineNum = 1
        var looking4Spot = true;
        for (var x = 0; x < 7; x++) {
          for (var i = 0; i < 7; i++) {
            var num;
            var letter;
            switch (i) {
              case 1:
                num = ":one:"
                break;
              case 2:
                num = ":two:"
                break;
              case 3:
                num = ":three:"
                break;
              case 4:
                num = ":four:"
                break;
              case 5:
                num = ":five:"
                break;
              case 6:
                num = ":six:"
                break;
            }
            switch (x) {
              case 1:
                letter = ":one:"
                break;
              case 2:
                letter = ":two:"
                break;
              case 3:
                letter = ":three:"
                break;
              case 4:
                letter = ":four:"
                break;
              case 5:
                letter = ":five:"
                break;
              case 6:
                letter = ":six:"
                break;
            }
            x == 0 ? (i == 0 ? (x == num1 && i == num2 ? line.push("<:RedGridTile:797955343728246844>") : line.push("<:GridTile:797919880883732481>")) : line.push(num)) : i == 0 ? line.push(letter) : (x == num1 && i == num2 ? line.push("<:RedGridTile:797955343728246844>") : line.push("<:GridTile:797919880883732481>"))
          }
          msg.push(line.join(""))
          line = []
        }
        switch (num1) {
          case 1:
            num1 = "1"
            break;
          case 2:
            num1 = "2"
            break;
          case 3:
            num1 = "3"
            break;
          case 4:
            num1 = "4"
            break;
          case 5:
            num1 = "5"
            break;
          case 6:
            num1 = "6"
            break;
        }
        message.channel.send(`${message.author.toString()} Get the value of ${num1}x${num2}\n` + msg.join("\n"))
        const filter = (m) => m.author.id == message.author.id
        var bals = mongoose.model("balance", Schemas.balances)
        var bal = await bals.findById(message.author.id)
        message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] }).then(msg => {
          const items = new Discord.Collection()
          config.shop.forEach(item => items.set(item.name.split(/ +/).join("+"), item.multiplier))
          var multiplier = 1;
          JSON.parse(db.prepare("SELECT * FROM inventory WHERE userID = (?)").get(message.author.id).inv).forEach(item => {
            multiplier = multiplier + items.get(item.split(/ +/).join("+"))
          })
          var winningNum = num1 * num2
          var winnings = Math.ceil(Math.floor(Math.random() * (1500 - 500 + 1) + 500) * multiplier)
          if (winningNum.toString() == msg.first().content) {
            msg.first().reply(`The value of ${num1}x${num2} was ${winningNum}! You won \`${winnings.toLocaleString()}\` **test tubes**!`)
            bal.bal = bal.bal + Math.ceil(winnings)
            bal.save()
          } else {
            winnings = Math.floor(Math.random() * (250 - 100 + 1) + 100)
            msg.first().reply(`The value of ${num1}x${num2} was ${winningNum}. You were paid \`${winnings.toLocaleString()}\` **test tubes** for the effort.`)
            bal.bal = bal.bal + Math.ceil(winnings)
            bal.save()
          }
        }).catch(collect => {
          message.reply("You didn't reply. I am charging you `100` **test tubes** for wasting my time.")
          bal.bal = bal.bal - 100
          bal.save()
        })
        cooldown.ends = Date.now() + ms("4m")
        cooldown.save()
        break;
    }
  }
}