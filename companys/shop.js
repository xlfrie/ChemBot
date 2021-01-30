const config = require('../config.json')

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  var Companies = mongoose.model("companie", Schemas.companies)
  var company = (await Companies.find()).find(company => company.users.includes(message.author.id))
  var em = new Discord.MessageEmbed()
    .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
    .setTitle("Company Shop")
    .setTimestamp()
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
  var items = new Discord.Collection()
  config.cShop.forEach(it => items.set(it.name, { name: it.name, price: it.price }))
  items.sort((a, b) => b.price - a.price)
  var idIndex = 1
  items.forEach(it => { items.set(it.name, { name: it.name, price: it.price, id: idIndex }); idIndex++ })
  em.setDescription(items.map(it => "**" + it.id + "**. " + it.name + " - **" + it.price.toLocaleString() + "**").join('\n'))
  message.channel.send(em)
}