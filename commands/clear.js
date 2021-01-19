module.exports = {
  name: "clear",
  description: "Clear messages in mass!",
  usage: "<amount of messages to Delete>",
  aliases: ["purge"],
  category: "Moderation",
  execute(message, args, client, Discord) {
    if (!message.member.hasPermission(0x00002000)) return message.reply("You don't have permission to do this.")
    if (isNaN(args[1])) return message.reply("Please provide an amount of messages to purge.")
    if (parseInt(args[1]) > 99 || parseInt(args[1]) < 1) return message.reply("The minimum amount of messages is 1 message and the maximum is 99.")
    if (message.mentions.users.size == 0) {
      message.delete()
      message.channel.bulkDelete(parseInt(args[1]), true)
    } else {
      message.channel.messages.fetch({ limit: (parseInt(args[1]) + 1) }).then(msgs => {
        message.channel.bulkDelete(msgs.filter(msg => msg.author.id == message.mentions.users.first().id), true)
      })
    }
  }
}