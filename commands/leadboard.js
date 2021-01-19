const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "leaderboard",
  description: "View the current leaders in test tubes!",
  usage: "",
  aliases: ["lb"],
  category: "Fun",
  async execute(message, args, client, Discord) {
    switch (args[1] ? args[1].toLowerCase() : args[1]) {
      case 'tubes':
      default:
        var lb = new Discord.Collection()
        db.prepare("SELECT * FROM balances").all().forEach(item => {
          if(client.users.cache.get(item.id)) lb.set(item.testtubes, { tubes: item.testtubes, id: item.id })
        })
        lb.sort((itemA, itemB) => parseInt(itemB.tubes) - parseInt(itemA.tubes))
        var lbFields = []
        var lbNum = 0;
        var lbShow = 10
        var em;
        function rendertubes(edit, msg) {
          lbNum = lbShow - 10
          lbFields = []
          lb.first(lbShow).slice(lbShow - 10).filter(lbIt => client.users.cache.get(lbIt.id) != undefined).forEach(item => {
            var user = client.users.cache.get(item.id)
            if (user) lbNum++ , lbFields.push(`**${lbNum}.** ${item.tubes.toLocaleString()} - **${user.tag}**`);
          })
          em = new Discord.MessageEmbed()
            .setTitle("Leaderboard")
            .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
            .setFooter(`Requested by ${message.author.tag}.`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(lbFields.join("\n"))
          if (edit == true) msg.edit(em)
        }
        rendertubes(false)
        message.channel.send(em).then(msg => {
          msg.react("⬅️").then(msg.react("❌").then(msg.react("➡️")))
          const filter = (reaction, user) => {
            return ['❌', '⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id;
          }
          var collector = msg.createReactionCollector(filter, { time: 60000 })
          collector.on("collect", reaction => {
            switch (reaction.emoji.name) {
              case '➡️':
                if (lb.size > lbShow) {
                  lbShow = lbShow + 10
                  rendertubes(true, msg)
                }
                break;
              case '❌':
                msg.reactions.removeAll()
                break;
              case "⬅️":
                if (lbShow != 10) {
                  lbShow = lbShow - 10
                  lbNum = lbNum - 10
                  rendertubes(true, msg)
                }
                break;
            }
            reaction.users.remove(message.author.id)
          })
          collector.on("end", collected => {
            msg.reactions.removeAll()
          })
        })
        break;
      case 'levels':
      case "lvls":
      case "level":
        var levels = new Discord.Collection()
        var dbLevels = JSON.parse(db.prepare("SELECT * FROM levels WHERE guildid = (?)").get(message.guild.id).levels)
        Object.keys(dbLevels).forEach(lvl => {
          levels.set(lvl, { xp: dbLevels[lvl].totalXp, userID: lvl })
        })
        levels.sort((a, b) => b.xp - a.xp)
        function renderlvls(edited) {
          var levelFields = []
          var levelsShown = 1
          levels.filter(user => client.users.cache.get(user.userID)).first(10).forEach(user => {
            levelFields.push(`**${levelsShown}.** ${user.xp.toLocaleString()} xp - **${client.users.cache.get(user.userID).tag}**`)
            levelsShown++
          })
          var em = new Discord.MessageEmbed()
            .setTitle("Leaderboard")
            .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
            .setFooter(`Requested by ${message.author.tag}.`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(levelFields.join("\n"))
          message.reply(em)
        }
        renderlvls(false)
        break;
    }
  }
}
