const config = require('../config.json')
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  event: "message",
  execute(client, Discord) {
    client.on("message", message => {
      const args = message.content.slice(config.prefix.length).trim().split(/ +/)
      if (message.channel.id !== "797312863563022357") return;
      const lines = message.content.split("\n")
      console.log(message.content)
      if (lines[0].toLowerCase().startsWith("chembot version:") && lines[1].toLowerCase().startsWith("bug: ")) {
        message.reply("Thanks for your report!").then(msg => setTimeout(() => { msg.delete() }, 4000))
        message.delete()
        db.prepare("INSERT INTO submissions (type,subid,submission,submitter) VALUES (?,?,?,?)").run("bug", message.id, lines.join("\n"), message.author.id)
        var bugEm = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setColor(6875488)
          .setDescription(`\`\`\`${lines.join("\n")}\`\`\``)
          .setFooter(`Use ,acceptsub ${message.id} or ,declinesub ${message.id} to accept/decline this bug report.`)
        client.channels.cache.get("797330204997058580").send(bugEm)
      } else if (message.content.toLowerCase().startsWith('suggest') && args[1]) {
        message.reply("Thanks for your suggestion!").then(msg => setTimeout(() => { msg.delete() }, 4000))
        message.delete()
        db.prepare("INSERT INTO submissions (type,subid,submission,submitter) VALUES (?,?,?,?)").run("suggestion", message.id, args.slice(1).join(" "), message.author.id)
        var suggestEm = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setColor(6875488)
          .setFooter(`Use ,acceptsub ${message.id} or ,declinesub ${message.id} to accept/decline this suggestion.`)
          .setDescription(`${args.slice(1).join(" ")}`)
          client.channels.cache.get("797330204997058580").send(suggestEm)
      }
    })
  }
}