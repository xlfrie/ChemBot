module.exports = {
  name: "info",
  description: "Get information for ChemBot.",
  usage: "",
  aliases: ["invite", "information"],
  category: "Information",
  execute(message, args, client, Discord) {
    console.log(message.member.displayHexColor)
    message.channel.send(new Discord.MessageEmbed()
      .setTitle("Information")
      .addFields(
        { name: "__Invite__", value: "[Click here](https://discord.com/oauth2/authorize?client_id=796480356055777360&permissions=8&scope=bot)", inline: true },
        { name: "__Support Server__", value: "[Join Here](https://discord.gg/qcQYWqpXHB)", inline: true },
        { name: "\u200b", value: `Servers: \`${client.guilds.cache.size}\`` })
      .setTimestamp()
      .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
      .setFooter(`Requested by ${message.author.tag}.`, message.author.displayAvatarURL({ dynamic: true }))
    )
  }
}