const ms = require('ms')
const GiveawayManager = require("../giveawayManager.js")

module.exports = {
  name: "create",
  description: "Create a giveaway.",
  usage: "",
  aliases: [],
  category: "Giveaway",
  async execute(message, args, client, Discord, Topgg, mongoose, Schemas) {
    if(!message.member.hasPermission("MANAGE_SERVER")) return message.reply("You need the `Manage Server` permission to use this!")
    var filter = msg => {
      return msg.author.id == message.author.id
    }
    var gmod = mongoose.model("giveaway", Schemas.giveaways)
    message.reply("What channel should I host this in?")
    message.channel.awaitMessages(filter, { time: ms('1m'), errors: ['time'], max: 1 }).then(collected => {
      let msg = collected.first()
      var channel = msg.mentions.channels.first() || client.channels.cache.get(msg.content)
      if(!channel || channel.guild.id != msg.guild.id) return msg.reply("Please provide a valid channel to host this giveaway in. Automatically cancelling.")
      msg.reply(`Ok so hosting it in ${channel.toString()}. But how long should the giveaway last?`)
      message.channel.awaitMessages(filter, { time: ms('1m'), errors: ['time'], max: 1 }).then(collected => {
        let msg = collected.first()
        let args = msg.content.trim().split(/ +/)
        var length = 0;
        args.forEach(arg => length = length + ms(arg))
        if(length < 15000 || length > ms("1w") || parseInt(msg.content) == msg.content) return msg.reply("Please provide a valid giveaway length. (Must be at least 15 seconds and no longer than 1 week.) Automatically cancelling.")
        msg.reply(`Ok! Now what will be the giveaway for? (this will start the giveaway in ${channel.toString()})`)
        message.channel.awaitMessages(filter, { time: ms('1m'), errors: ['time'], max: 1 }).then(collected => {
          let msg = collected.first()
          const em = new Discord.MessageEmbed()
            .setDescription(`React with 🎉 to enter.\nWinners: ${"1"}\nHost: ${msg.author.toString()}`)
            .setAuthor(`${Discord.Util.cleanContent(msg.content, msg)}`)
            .setColor(msg.guild.me.displayColor)
            .setFooter('Ends')
            .setTimestamp(Date.now() + length)
          channel.send(em).then(giveawayMsg => {
            giveawayMsg.react("🎉")
            new gmod({ id: giveawayMsg.id, channel: channel.id, prize: Discord.Util.cleanContent(msg.content, msg), winners: 1, ends: Date.now() + length, host: msg.author.id }).save()
            new GiveawayManager.Manager({ id: giveawayMsg.id, channel: channel.id, prize: Discord.Util.cleanContent(msg.content, msg), winners: 1, ends: Date.now() + length, host: msg.author.id }, client, mongoose, Schemas)
          })
        })
      })
    })
  }
}