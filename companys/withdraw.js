const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = (client, message, args, Discord) => {
  var companys = db.prepare("SELECT * FROM companys").all()
  var users = []
  companys.forEach(company => Object.keys(JSON.parse(company.users)).forEach(user => users.push(user)))
  var company = companys.filter(company => Object.keys(JSON.parse(company.users)).includes(message.author.id))[0]
  if (!users.includes(message.author.id)) return message.reply("You aren't in a company!")
  if (company.owner !== message.author.id) return message.reply("You aren't the owner of this company!")
  if (!args[2]) return message.reply("Please provide an amount to withdraw.")
  var withdrawing = args[2].toLowerCase() == "all" ? company.bal : parseInt(args[2].split(",").join(""))
  if (withdrawing < 0) message.reply("Please provide a positive number to withdraw!")
  if (company.bal < withdrawing) return message.reply("The company doesn't have enough test tubes to withdraw!")
  db.prepare("UPDATE companys SET bal = (?) WHERE owner = (?)").run(company.bal - withdrawing, company.owner)
  db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes + withdrawing, message.author.id)
  message.reply(`Withdrawed ${withdrawing.toLocaleString()} **test tubes**!`)
}