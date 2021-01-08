const config = require("../config.json")
module.exports = {
  name: "help",
  description: "Get help with ChemBot.",
  usage: "[module] [command]",
  aliases: [],
  category: "Information",
  execute(message, args, client, Discord) {
    if (!args[1]) {
      var em = new Discord.MessageEmbed()
        .setTitle("Help")
        .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
        .addFields(
          { name: "Commands", value: `${config.prefix}help commands` })
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
      message.channel.send(em)
    } else {
      switch (args[1].toLowerCase()) {
        case "commands":
          var em = new Discord.MessageEmbed()
            .setTitle("Commands")
            .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
          var commands = { "Information": [], "Fun": [] }
          client.commands.forEach(cmd => commands[cmd.category].push(cmd.name))
          for (var key in commands) {
            em.addField("\u200b", `${key}:`)
            commands[key].forEach(cmd => em.addField(`__**${config.prefix + cmd}**__`, client.commands.get(cmd).description, true))
          }
          message.author.send(em, { split: true })
          if (args[2]) {
            const cmd = client.commands.get(args[2]) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[2]))
            if (!cmd) return message.reply("No command found.")
          }
          break;
      }
    }
  }
}