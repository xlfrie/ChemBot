module.exports = {
  name: "eval",
  description: "Evaluate a script.",
  usage: "",
  aliases: [],
  category: "Dev",
  execute(message, args, client, Discord, dbl, mongoose, Schemas) {
    const clean = text => {
      if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else
        return text;
    }
    if (message.author.id !== "684573515948490793") return message.reply("This is a dev only command!")
    try {
      const code = args.slice(1).join(" ")
      let evaled = eval(code)
      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled)
      var em = new Discord.MessageEmbed()
        .setTitle("Evaled")
        .setDescription(`📥\n\`\`\`javascript\n${code}\`\`\`\n\n📤\n\`\`\`javascript\n${clean(evaled)}\`\`\``)
        .setFooter("Evaled results")
        .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
        .setTimestamp()
      message.channel.send(em)
    } catch (err) {
      console.error(err)
      message.channel.send(`ERROR\`\`\`\n${clean(err)}\n\`\`\``);
    }
  }
}