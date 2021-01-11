const ms = require("ms")
const config = require("../config.json")
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "minigame",
  description: "Play a mini game for test tubes.",
  usage: "",
  aliases: [],
  category: "Access",
  execute(message, args, client, Discord) {
    var game = Math.floor(Math.random() * (1 - 1 + 1) + 1)
    if (!db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "minigame")) db.prepare("INSERT INTO cooldowns (id,ends,type) VALUES (?,?,?)").run(message.author.id, new Date().getTime() - 1, "minigame")
    var cooldown = db.prepare("SELECT * FROM cooldowns WHERE id = (?) AND type = (?)").get(message.author.id, "minigame")
    if(cooldown.ends > new Date().getTime()) return message.reply(`Please wait ${ms(cooldown.ends - new Date().getTime(), {long:true})}`)
    switch(game) {
      case 1:
      var letterT = Math.floor(Math.random() * (6 - 1 + 1) + 1)
      var numT = Math.floor(Math.random() * (6 - 1 + 1) + 1)
      var msg = []
      var line = []
      var lineNum = 1
      var looking4Spot = true;
      for(var x = 0; x < 7; x++) {
        for(var i = 0; i < 7; i++) {
          var num;
          var letter;
          switch(i) {
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
          switch(x) {
            case 1:
            letter = ":regional_indicator_a:"
            break;
            case 2:
            letter = ":regional_indicator_b:"
            break;
            case 3:
            letter = ":regional_indicator_c:"
            break;
            case 4:
            letter = ":regional_indicator_d:"
            break;
            case 5:
            letter = ":regional_indicator_e:"
            break;
            case 6:
            letter = ":regional_indicator_f:"
            break;
          }
          x == 0 ? (i == 0 ? (x == letterT && i == numT ? line.push("<:RedGridTile:797955343728246844>") : line.push("<:GridTile:797919880883732481>")) : line.push(num)) : i == 0 ? line.push(letter) : (x == letterT && i == numT ? line.push("<:RedGridTile:797955343728246844>") : line.push("<:GridTile:797919880883732481>"))
        }
        msg.push(line.join(""))
        line = []
      }
      switch(letterT) {
            case 1:
            letterT = "A"
            break;
            case 2:
            letterT = "b"
            break;
            case 3:
            letterT = "c"
            break;
            case 4:
            letterT = "d"
            break;
            case 5:
            letterT = "e"
            break;
            case 6:
            letterT = "f"
            break;
          }
      message.channel.send(`Guess the value of ${letterT.toUpperCase()}${numT} between 1 and 3\n` + msg.join("\n"))
      const filter = (m) => m.author.id == message.author.id 
      message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] }).then(msg => {
            const items = new Discord.Collection()
    config.shop.forEach(item => items.set(item.name.split(/ +/).join("+"), item.multiplier))
        var multiplier = 1;
    JSON.parse(db.prepare("SELECT * FROM inventory WHERE userID = (?)").get(message.author.id).inv).forEach(item => {
      multiplier = multiplier + items.get(item.split(/ +/).join("+"))
    })
        if(!["1","2","3"].includes(msg.first().content)) {
          message.reply("Your answer wasn't 1, 2, or 3. I am giving you `100` **test tubes** for your effort.")
          db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes + 100, message.author.id)
        } else {
          var winningNum = Math.floor(Math.random() * (3 - 1 + 1) + 1)
          var winnings = Math.ceil(Math.floor(Math.random() * (1450 - 500 + 1) + 500) * multiplier)
          if(winningNum.toString() == msg.first().content) {
            msg.first().reply(`The value of ${letterT.toUpperCase()}${numT} was ${winningNum}! You won \`${winnings.toLocaleString()}\` **test tubes**!`)
            db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(Math.ceil(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes) + Math.ceil(winnings), message.author.id)
          }  else {
            winnings = Math.floor(Math.random() * (250 - 100 + 1) + 100)
            msg.first().reply(`The value of ${letterT.toUpperCase()}${numT} was ${winningNum}. You were paid \`${winnings.toLocaleString()}\` **test tubes** for the effort.`)
            db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes + winnings, message.author.id)
          }
        }
      }).catch(collect => {
          message.reply("You didn't reply. I am charging you `100` **test tubes** for wasting my time.")
          db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes - 100, message.author.id)
      })
      db.prepare("UPDATE cooldowns SET ends = (?) WHERE id = (?) AND type = (?)").run(new Date().getTime() + ms("5m"),message.author.id, "minigame")
      break;
    }
  }
}