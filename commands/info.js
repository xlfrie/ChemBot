module.exports = {
  name: "info",
  description: "Get information for the bot.",
  usage: "",
  aliases: ["invite","information"],
  category: "Information",
  execute(message, args, client, Discord) {
    message.channel.send(new Discord.MessageEmbed()
    .setTitle("Information")
    .addFields(
      {name: "__Invite__", value: "[Click here](https://discord.com/oauth2/authorize?client_id=796480356055777360&permissions=8&scope=bot)", inline: true},
      {name: "__Support Server__", value: "[Join Here](https://discord.gg/qcQYWqpXHB)", inline: true}))
    
  }
}