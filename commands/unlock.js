module.exports = {
  name: "unlock",
  description: "Unlock the current channel.",
  usage: "[Time]",
  aliases: [],
  category: "Moderation",
  execute(message, args, client, Discord) {
    if(!message.member.hasPermission(0x00000020)) return message.reply("You can't do this!")
    if(!args[1]) {
      message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
        SEND_MESSAGES: true
      })
      message.reply("Unlocked channel.")
    }
  }  
}