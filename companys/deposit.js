const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = (client, message, args, Discord) => {
  var companys = db.prepare("SELECT * FROM companys").all()
  var users = []
  companys.forEach(company => Object.keys(JSON.parse(company.users)).forEach(user => users.push(user)))
  if (!users.includes(message.author.id)) return message.reply("You aren't in a company!")
  if (!args[2]) return message.reply("Please provide an amount to deposit!")
  var depositing = args[2].toLowerCase() == "all" ? db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes : parseInt(args[2].split(",").join(""))
  if (isNaN(depositing)) return message.reply("Please provide a valid amount of test tubes to desposit.")
  if (depositing < 10) return message.reply("The minimum amount to deposit is 10 test tubes.")
  var userBal = db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes
  if (depositing > userBal) return message.reply("You don't have enough to deposit!")
  db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(userBal - depositing, message.author.id)
  var company = companys.filter(company => Object.keys(JSON.parse(company.users)).includes(message.author.id))[0]
  db.prepare("UPDATE companys SET bal = (?) WHERE owner = (?)").run(db.prepare("SELECT * FROM companys WHERE owner = (?)").get(company.owner).bal + depositing, company.owner)
  message.reply(`Deposited ${depositing.toLocaleString()} **test tubes**!`)
}