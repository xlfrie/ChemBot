const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = (client, message, args, Discord) => {
  var companys = db.prepare("SELECT * FROM companys").all()
  var users = []
  companys.forEach(company => Object.keys(JSON.parse(company.users)).forEach(user => users.push(user)))
  if (!users.includes(message.author.id)) return message.reply("You aren't in a company!")
  var company = companys.filter(company => Object.keys(JSON.parse(company.users)).includes(message.author.id))[0]
  if (company.owner == message.author.id) return message.reply("You can't leave your own company!")
  const cusers = JSON.parse(company.users)
  delete cusers[message.author.id]
  db.prepare("UPDATE companys SET users = (?) WHERE owner = (?)").run(JSON.stringify(cusers), company.owner)
  message.reply(`Successfully left ${company.company}.`)
}