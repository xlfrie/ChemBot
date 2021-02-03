const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require("../config.json")

module.exports = {
  name: "acceptsub",
  description: "Accept a submission!",
  usage: "<submission ID>",
  aliases: [],
  category: "Dev",
  async execute(message, args, client, Discord, dbl, mongoose, Schemas) {
    if(!args[1]) return message.reply("Please provide a submission ID to proceed.");
    var submissions = mongoose.model('submission', Schemas.submissions)
    var submission = await submissions.findById(args[1])
    if(!submission) return message.reply("Please provide a **valid** submission ID to proceed.")
    var subUser = await client.users.fetch(submission.submitter)
    switch (submission.type) {
      case "suggestion": 
      var subEm = new Discord.MessageEmbed()
      .setAuthor(subUser.tag, subUser.displayAvatarURL({ dynamic: true }))
      .setColor(6875488)
      .setFooter("To add a suggestion read the info in #submissions")
      .setTimestamp()
      .setDescription(`\`\`\`${submission.submission}\`\`\``)
      client.channels.cache.get("797547560650145802").send(subEm).then(msg => msg.react("✅").then(msg.react("❌")))
      break;
      case "bug":
     var subEm = new Discord.MessageEmbed()
      .setAuthor(subUser.tag, subUser.displayAvatarURL({ dynamic: true }))
      .setColor(6875488)
      .setFooter("To report a bug read the info in #submissions")
      .setTimestamp()
      .setDescription(`\`\`\`${submission.submission}\`\`\``)
      client.channels.cache.get("793684780234571786").send(subEm).then(msg => msg.react("✅").then(msg.react("❌")))
      break;
    }
    submissions.deleteOne({ _id: args[1] }).exec()
    message.delete()
  }
}