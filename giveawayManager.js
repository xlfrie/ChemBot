const Discord = require('discord.js')

this.Manager = class Manager {
  constructor(data, client, mongoose, Schemas) {
    setTimeout(() => {
      var gmod = mongoose.model("giveaway", Schemas.giveaways)
      gmod.deleteOne({ id: data.id }).exec()
      client.channels.cache.get(data.channel).messages.fetch(data.id).then(message => {
        const em = new Discord.MessageEmbed()
        .setAuthor(data.prize)
        .setColor("#2f3136")
        .setFooter("Ended")
        .setTimestamp()
        var winner;
        message.reactions.cache.find(r => r.emoji.name == "🎉").users.fetch().then(users => {
          var winner = users.filter(user => !user.bot).random(data.winners)
          if(winner.length == 0) winner = "No one reacted"
          em.setDescription(`Winner: ${winner.toString()}\nHost: <@!${data.host}>`)
          message.edit("🎉 Giveaway ended! 🎉", { embed: em })
          message.channel.send(winner == "No one reacted" ? "No user has reacted to the giveaway." : `${winner} has won **${data.prize}**!`)
        })
      })
    }, data.ends - Date.now())
  }
}