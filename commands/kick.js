module.exports = {
  name: "kick",
  description: "Kick a member.",
  usage: "<user> [reason]",
  aliases: [],
  category: "Moderation",
  async execute(message, args, client, Discord) {
    if (!message.member.hasPermission(0x00000002)) return message.reply("You don't have permission to do this!")
    if (!args[1]) return message.reply("Please provide a user to kick.")
    try {
      console.log(message.mentions.users.size)
      var member;
      if (message.mentions.users.size == 0) {
        member = await message.guild.members.fetch(args[1])
      } else {
        member = await message.guild.members.fetch(message.mentions.users.first().id)
      }
    } catch {
      message.reply("Please provide a user to kick.")
    }
    member.kick()
    message.channel.send(new Discord.MessageEmbed()
      .setColor("GREEN")
      .setDescription("***" + member.user.tag + " was kicked***"))
  }
}