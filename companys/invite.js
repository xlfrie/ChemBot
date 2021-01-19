const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = async (client, message, args, Discord) => {
  var companys = db.prepare("SELECT * FROM companys").all()
  var users = []
  companys.forEach(company => Object.keys(JSON.parse(company.users)).forEach(user => users.push(user)))
  if (!users.includes(message.author.id)) return message.reply("You aren't in a company!")
  var company = companys.filter(company => Object.keys(JSON.parse(company.users)).includes(message.author.id))[0]
  if (company.owner !== message.author.id) return message.reply("You can't invite this person since you donn't own this company.")
  var user = message.mentions.users.first() || client.users.cache.get(args[2])
  if (!user) return message.reply("Please provide a user to invite.")
  if (users.includes(user.id)) return message.reply(`${user.tag} is already in a company.`)
  if (!db.prepare("SELECT * FROM userRequests WHERE id = (?)").get(user.id)) db.prepare("INSERT INTO userRequests (id,requests) VALUES (?,?)").run(user.id, JSON.stringify([]))
  if (JSON.parse(db.prepare("SELECT * FROM userRequests WHERE id = (?)").get(user.id).requests).includes(company.company)) return message.reply("This user has already been invited to " + company.company + ".")
  message.reply(`Invited ${user.tag} to ${company.company}!`)
  var userRequests = JSON.parse(db.prepare("SELECT * FROM userRequests WHERE id = (?)").get(user.id).requests)
  userRequests.push(company.company)
  db.prepare("UPDATE userRequests SET requests = (?) WHERE id = (?)").run(JSON.stringify(userRequests), user.id)
}