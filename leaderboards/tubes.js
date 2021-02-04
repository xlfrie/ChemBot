module.exports = async (message, args, client, Discord, mongoose, Schemas) => {
  var lb = new Discord.Collection()
  var bals = mongoose.model("balance", Schemas.balances)
  var rawLb = await bals.find()
  rawLb.forEach(item => {
    if (client.users.cache.get(item._id)) lb.set(item.bal, { tubes: item.bal, id: item._id })
  })
  lb.sort((itemA, itemB) => parseInt(itemB.tubes) - parseInt(itemA.tubes))
  var lbFields = []
  var lbNum = 0;
  var lbShow = 10
  var em;
  function rendertubes(edit, msg) {
    lbNum = lbShow - 10
    lbFields = []
    lb.filter(it =>(!args[1] || args[1].toLowerCase() !== "global" ? message.guild.members.cache.map(u => u.user.id).includes(it.id) : true) && client.users.cache.get(it.id)).first(lbShow).slice(lbShow - 10).forEach(item => {
      var user = client.users.cache.get(item.id)
      lbNum++
      lbFields.push(`**${lbNum}.** ${item.tubes.toLocaleString()} **test tubes** - **${user.tag}**`);
    })
    em = new Discord.MessageEmbed()
      .setTitle(!args[1] || args[1].toLowerCase() !== "global" ? "Server Leaderboard" : "Global Leaderboard")
      .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
      .setFooter(`Requested by ${message.author.tag}.`, message.author.displayAvatarURL({ dynamic: true }))
      .setDescription(lbFields.join("\n"))
    if (edit == true) msg.edit(em)
  }
  rendertubes(false)
  message.channel.send(em).then(msg => {
    msg.react("<:Leftarrow:803813734900039681>").then(msg.react("❌").then(msg.react("<:Rightarrow:803813735461421078>")))
    const filter = (reaction, user) => {
      return ['❌', 'Leftarrow', 'Rightarrow'].includes(reaction.emoji.name) && user.id === message.author.id;
    }
    var collector = msg.createReactionCollector(filter, { time: 60000 })
    collector.on("collect", reaction => {
      switch (reaction.emoji.name) {
        case 'Rightarrow':
          if (lb.size > lbShow) {
            lbShow = lbShow + 10
            rendertubes(true, msg)
          }
          break;
        case '❌':
          msg.reactions.removeAll()
          break;
        case "Leftarrow":
          if (lbShow != 10) {
            lbShow = lbShow - 10
            lbNum = lbNum - 10
            rendertubes(true, msg)
          }
          break;
      }
      reaction.users.remove(message.author.id)
    })
    collector.on("end", collected => {
      msg.reactions.removeAll()
    })
  })
}