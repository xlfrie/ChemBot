const config = require("../config.json")
module.exports = {
  name: "help",
  description: "Get help with ChemBot.",
  usage: "[module] [category]",
  aliases: [],
  category: "Information",
  execute(message, args, client, Discord) {
    if (!args[1]) {
      var em = new Discord.MessageEmbed()
        .setTitle("Help")
        .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
        .addFields(
          { name: "Commands", value: `${config.prefix}help commands\n\u200b` },
          { name: "__Invite__", value: "[Click here](https://discord.com/oauth2/authorize?client_id=796480356055777360&permissions=8&scope=bot)", inline: true },
          { name: "__Support Server__", value: "[Join Here](https://discord.gg/qcQYWqpXHB)", inline: true },
          { name: "\u200b", value: `Servers: \`${client.guilds.cache.size.toLocaleString()}\`\nUsers: \`${client.users.cache.size.toLocaleString()}\``})
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
      message.channel.send(em)
    } else {
      switch (args[1].toLowerCase()) {
        case "commands":
          if (args[2]) {
            const cmds = client.commands.filter(cmd => cmd.category.toLowerCase() == args[2].toLowerCase())
            var em = new Discord.MessageEmbed()
              .setTitle(args[2])
              .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
              .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
              .setTimestamp()
            cmds.forEach(cmd => em.addField(`__**${config.prefix + cmd.name + " " + cmd.usage}**__`, cmd.description, true))
            if(!cmds.size) return message.reply("No commands were found.")
            message.author.send(em)
          } else {
            var em = new Discord.MessageEmbed()
              .setTitle("Commands")
              .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
              .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
              .setTimestamp()
            var commands = { "Information": [], "Fun": [] }
            client.commands.forEach(cmd => {
              if (!commands[cmd.category] && (cmd.category != "Dev" || config.staff.includes(message.author.id)) && (cmd.category != "Access" || config.bugTesters.includes(message.author.id))) commands[cmd.category] = []
              if((cmd.category != "Dev" || config.staff.includes(message.author.id)) && (cmd.category != "Access" || config.bugTesters.includes(message.author.id))) commands[cmd.category].push(cmd.name)
            })
            for (var key in commands) {
              em.addField("\u200b", `${key}:`)
              commands[key].forEach(cmd => em.addField(`__**${config.prefix + cmd + " " + client.commands.get(cmd).usage}**__`, client.commands.get(cmd).description, true))
            }
            message.author.send({ split: true, embed: em }).catch(err => {
              if (err.toString() == "DiscordAPIError: Cannot send messages to this user") message.reply("I can't send you messages!")
            })
            message.reply("You got mail!")
          }
          break;
      }
    }
  }
}