module.exports = {
  name: "unban",
  description: "unban a member.",
  usage: "<user> [reason]",
  aliases: [],
  category: "Dev",
  async execute(message, args, client, Discord) {
    if (!message.member.hasPermission(0x00000004)) return message.reply("You don't have permission to do this!")
    if (!args[1]) return message.reply("Please provide a user to ban.")
    try {
      var member = message.mentions.users.first() || await client.users.fetch(args[1])
    } catch (err) {
      message.reply("Please provide a user to ban.")
    }
    message.guild.members.unban(member.id)
    message.channel.send(new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription("***" + member.tag + " was unbanned***"))
  }
}