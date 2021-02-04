module.exports = async (message, args, client, Discord, mongoose, Schemas) => {
          var levels = new Discord.Collection()
        var lvls = mongoose.model("level", Schemas.levels)
        var dbLevels = await lvls.findOne({ guildid: message.guild.id })
        var levelShow = 10
        var levelsShown = 0
        Array.from(dbLevels.levels.keys()).forEach(lvl => {
          levels.set(lvl, { xp: dbLevels.levels.get(lvl).totalXp, userID: lvl })
        })
        levels.sort((a, b) => b.xp - a.xp)
        function renderlvls(edited, msg) {
          var levelFields = []
          levelsShown = levelShow - 10
          levels.filter(user => client.users.cache.get(user.userID)).first(levelShow).slice(levelShow - 10).forEach(user => {
            levelsShown++
            levelFields.push(`**${levelsShown}.** ${user.xp.toLocaleString()} xp - **${client.users.cache.get(user.userID).tag}**`)
          })
          var em = new Discord.MessageEmbed()
            .setTitle("Leaderboard")
            .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
            .setFooter(`Requested by ${message.author.tag}.`, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(levelFields.join("\n"))
          if(edited == false) return message.reply(em)
            else msg.edit(em)
        }
        var msg = await renderlvls(false)
        // reactions
        msg.react("<:Leftarrow:803813734900039681>").then(msg.react("❌").then(msg.react("<:Rightarrow:803813735461421078>")))
          const filter = (reaction, user) => {
            return ['❌', 'Leftarrow', 'Rightarrow'].includes(reaction.emoji.name) && user.id === message.author.id;
          }
          var collector = msg.createReactionCollector(filter, { time: 60000 })
          collector.on("collect", reaction => {
            switch (reaction.emoji.name) {
              case 'Rightarrow':
                if (levels.size > levelShow) {
                  levelShow = levelShow + 10
                  levelsShown = levelsShown - 10
                  renderlvls(true, msg)
                }
                break;
              case '❌':
                msg.reactions.removeAll()
                break;
              case "Leftarrow":
                if (levelShow != 10) {
                  levelShow = levelShow - 10
                  levelsShown = levelsShown - 10
                  renderlvls(true, msg)
                }
                break;
            }
            reaction.users.remove(message.author.id)
          })
          collector.on("end", collected => {
            msg.reactions.removeAll()
          })
}