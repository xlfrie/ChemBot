const config = require("../config.json")
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = (client, message, args, Discord) => {
  if (!db.prepare("SELECT * FROM userRequests WHERE id = (?)").get(message.author.id)) db.prepare("INSERT INTO userRequests (id,requests) VALUES (?,?)").run(message.author.id, JSON.stringify([]))
  var companys = db.prepare("SELECT * FROM companys").all()
  var users = []
  companys.forEach(company => Object.keys(JSON.parse(company.users)).forEach(user => users.push(user)))
  var company = companys.filter(company => Object.keys(JSON.parse(company.users)).includes(message.author.id))[0]
  if (users.includes(message.author.id)) return message.reply("You are already in a company!")
  switch (args[2]) {
    default:
      var em = new Discord.MessageEmbed()
        .setTitle("Requests")
        .setDescription(JSON.parse(db.prepare("SELECT * FROM userRequests WHERE id = (?)").get(message.author.id).requests).slice(0, 10).join('\n'))
        .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
        .setFooter(`Use ${config.prefix}company requests accept <company> to join a company.`)
      message.reply(em)
      break;
    case 'accept':
      if (!args[3]) return message.reply("Please provide a request to accept.")
      var userReqs = JSON.parse(db.prepare("SELECT * FROM userRequests WHERE id = (?)").get(message.author.id).requests)
      if (!userReqs.find(req => req.toLowerCase() == args[3].toLowerCase())[0]) message.reply("No requests found.")
      db.prepare("UPDATE userRequests SET requests = (?) WHERE id = (?)").run(JSON.stringify(userReqs.filter(req => req.toLowerCase() != args[3].toLowerCase())), message.author.id)
      var companyUsers = JSON.parse(db.prepare("SELECT * FROM companys WHERE company = (?)").get(userReqs.find(req => req.toLowerCase() == args[3].toLowerCase())).users)
      companyUsers[message.author.id] = { profits: "personal" }
      db.prepare("UPDATE companys SET users = (?) WHERE company = (?)").run(JSON.stringify(companyUsers), userReqs.find(req => req.toLowerCase() == args[3].toLowerCase()))
      message.reply(`Joined ${userReqs.find(req => req.toLowerCase() == args[3].toLowerCase())}!`)
      break;
  }
}