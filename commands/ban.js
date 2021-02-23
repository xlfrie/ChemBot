module.exports = {
  name: "ban",
  description: "ban a member.",
  usage: "<user> [reason]",
  aliases: [],
  category: "Dev",
  async execute(message, args, client, Discord) {
    if (!message.member.hasPermission(0x00000004)) return message.reply("You don't have permission to do this!")
    if (!args[1]) return message.reply("Please provide a user to ban.")
    try {
      var member = message.mentions.members.first() || await message.guild.members.fetch(args[1])
    } catch (err) {
      message.reply("Please provide a user to ban.")
    }
    // if(message.member.roles.cache.first().comparePositionTo(member.roles.cache.first()) <= 0) return message.reply("You don't have the permissions to do this.")
      message.guild.members.ban(member.id).catch(err => { if(err.toString() == "DiscordAPIError: Missing Permissions") return message.reply("I don't have permissions to do this.") }).then(message.channel.send(new Discord.MessageEmbed() .setColor("GREEN") .setDescription("***" + member.user.tag + " was banned***")))
  }
}