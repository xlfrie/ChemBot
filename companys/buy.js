const config = require("../config.json")

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  var companys = mongoose.model("companie", Schemas.companies)
  var bals = mongoose.model("balance", Schemas.balances)
  var bal = await bals.findById(message.author.id)
  var company = (await companys.find()).find(company => company.users.includes(message.author.id))
  if (!company) return message.reply("You aren't in a company!")
  if(company.owner != message.author.id) return message.reply("You don't own this company!")
  var items = new Discord.Collection()
  config.cShop.forEach(it => items.set(it.name, { name: it.name, price: it.price }))
  items.sort((a, b) => b.price - a.price)
  var idIndex = 1
  items.forEach(it => { items.set(it.name, { name: it.name, price: it.price, id: idIndex }); idIndex++ })
  console.log(items)
  var item = items.find(it => it.id == args[2] )
  if(!item) return message.reply("No item found.")
  if(company.bal < item.price) return message.reply("Your company doesn't have enough to do this.")
  message.reply(`Are you sure you want to buy **${item.name}** for \`${item.price.toLocaleString()}\`?`).then(msg => msg.react("✅").then(msg.react("❌").then(() => {
    const filter = (reaction, user) => {
      return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    msg.awaitReactions(filter, { max: 1, time: 60000 }).then(collected => {
        var reaction = collected.first()
        switch (reaction.emoji.name) {
          case "✅":
            if(!company.multipliers) company.multipliers = []
            if(company.multipliers.includes(item.name)) return message.reply("Your company already has this!")
            message.reply(`Sucessfully bought **${item.name}** for \`${item.price.toLocaleString()}\` **test tubes**!`)
            company.multipliers.push(item.name)
            company.bal = company.bal - item.price
            company.save()
            break;
          case "❌":
            msg.reactions.removeAll()
            message.reply("Sucessfully cancelled order.")
            break;
        }
      })
  })))
}