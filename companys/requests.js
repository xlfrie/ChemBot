const config = require("../config.json")
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  var requests = mongoose.model("crequest", Schemas.crequests)
  var userrequest = await requests.findById(message.author.id)
  if (!userrequest) userrequest = await new requests({ _id: message.author.id, requests: [] })
  var companys = mongoose.model("companie", Schemas.companies)
  var company = (await companys.find()).find(company => company.users.includes(message.author.id))
  if (company) return message.reply("You are already in a company!")
  switch (args[2]) {
    default:
      var em = new Discord.MessageEmbed()
        .setTitle("Requests")
        .setDescription(userrequest.requests.slice(0, 10).join('\n'))
        .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
        .setFooter(`Use ${config.prefix}company requests accept <company> to join a company.`)
      message.reply(em)
      break;
    case 'accept':
      if (!args[3]) return message.reply("Please provide a request to accept.")
      if (!userrequest.requests.find(req => req.toLowerCase() == args[3].toLowerCase())[0]) message.reply("No requests found.")
      var requestedcompany = (await companys.find()).find(company => company.name.toLowerCase() == args[3].toLowerCase())
      requestedcompany.users.push(message.author.id)
      requestedcompany.save()
      userrequest.requests = userrequest.requests.filter(req => req.toLowerCase() != args[3].toLowerCase())
      message.reply(`Joined ${requestedcompany.name}!`)
      userrequests.save()
      break;
  }
}