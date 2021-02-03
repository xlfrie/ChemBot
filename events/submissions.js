const config = require('../config.json')
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  event: "message",
  execute(client, Discord, Schemas, mongoose) {
    client.on("message", async message => {
      const submissions = mongoose.model("submission", Schemas.submissions) 
      const args = message.content.slice(config.prefix.length).trim().split(/ +/)
      if (message.channel.id !== "797312863563022357") return;
      const lines = message.content.split("\n")
      console.log(message.content)
      if (lines[0].toLowerCase().startsWith("chembot version:") && lines[1].toLowerCase().startsWith("bug: ")) {
        new submissions({ type: "bug", _id: message.id, submission: lines.join("\n"), submitter: message.author.id }).save()
        var bugEm = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setColor(6875488)
          .setDescription(`\`\`\`${lines.join("\n")}\`\`\``)
          .setFooter(`Use ,acceptsub ${message.id} or ,declinesub ${message.id} to accept/decline this bug report.`)
        client.channels.cache.get("798743254287122433").send(bugEm)
      } else if (message.content.toLowerCase().startsWith('suggest') && args[1]) {
        new submissions({ type: "suggestion", _id: message.id, submission: args.slice(1).join(" "), submitter: message.author.id }).save()
        var suggestEm = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setColor(6875488)
          .setFooter(`Use ,acceptsub ${message.id} or ,declinesub ${message.id} to accept/decline this suggestion.`)
          .setDescription(`${args.slice(1).join(" ")}`)
          client.channels.cache.get("798743254287122433").send(suggestEm)
      }
      message.delete()
    })
  }
}