const config = require("../config.json")
module.exports = {
	name: "help",
	description: "Get help with the bot.",
	usage: "[command]",
	aliases: [],
	category: "Information",
	execute(message, args, client, Discord) {
		if (!args[1]) {
			var em = new Discord.MessageEmbed()
				.setTitle("Help")
				.addFields(
					{ name: "Commands", value: `${config.prefix}help commands` })
			message.channel.send(em)
		} else {
			switch (args[1].toLowerCase()) {
				case "commands":
					var em = new Discord.MessageEmbed()
						.setTitle("Commands")
					var commands = { "Information": [] }
					client.commands.forEach(cmd => commands[cmd.category].push(cmd.name))
					for (var key in commands) {
						em.addField("\u200b", `${key}:`)
						commands[key].forEach(cmd => em.addField(`__**${config.prefix + cmd}**__`, client.commands.get(cmd).description, true))
					}
					message.author.send(em)
					break;
			}
		}
	}
}