const fetch = require('node-fetch')

module.exports = {
  name: "addemoji",
  description: "Add an emoji to a server!",
  usage: "<url> <name>",
  aliases: ["addemote"],
  category: "Moderation",
  execute(message, args, client, Discord) {
    if (!message.member.hasPermission(0x40000000)) return message.reply("You can't use this!")
    if(args.length !== 3) return
    if(!fetch(args[1])) return message.reply("Invalid URL")
    message.guild.emojis.create(args[1], args[2])
  }
}