module.exports = {
  name: "whois",
  description: "Get information on a member.",
  usage: "<user>",
  aliases: [],
  category: "Moderation",
  async execute(message, args, client, Discord) {
    var user = message.member
    if(args[1]) {
      user = message.mentions.members.first() || message.guild.members.cache.find(user => user.user.tag.toLowerCase() == args[1].toLowerCase() || user.user.username.toLowerCase() == args[1].toLowerCase()) || message.guild.members.cache.get(args[1])
    }
    var em = new Discord.MessageEmbed()
    .setColor(user.displayHexColor == "#000000" ? "#68e960" : user.displayHexColor)
    .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
    .setTitle("Information")
    .addFields(
      { name: "**Joined**", value: user.joinedAt.toLocaleDateString('en-US', { weekday: 'short', year: "numeric", month: 'long', day: 'numeric' }) + ", " + `${user.joinedAt.toLocaleTimeString('en-US')}`, inline: true},
      { name: "**Registered**", value: user.user.createdAt.toLocaleDateString('en-US', { weekday: 'short', year: "numeric", month: 'long', day: 'numeric' }) + ", " + `${user.user.createdAt.toLocaleTimeString('en-US')}`, inline: true })
    message.reply(em)
  }
}