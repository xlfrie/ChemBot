const Database = require('better-sqlite3')
const db = new Database("db.txt")
const noName = ["help"]

module.exports = (client, message, args, Discord) => {
  if (!args[2]) return message.reply("Please provide a four letter name for your company.")
  var companys = db.prepare("SELECT * FROM companys").all()
  var users = []
  companys.forEach(company => Object.keys(JSON.parse(company.users)).forEach(user => users.push(user)))
  if (users.includes(message.author.id)) return message.reply("You are already in a company!")
  if (args[2].length > 4) return message.reply("The maximum length for a company name is four letters.")
  if (!/^[a-zA-Z]+$/.test(args[2])) return message.reply("We only support a-z letters!")
  if (noName.includes(args[2].toLowerCase())) return message.reply("This name is not allowed!")
  if (companys.find(company => company.company.toLowerCase() == args[2].toLowerCase())) return message.reply("This company name is already taken!")
  var companyData = {}
  companyData[message.author.id] = { "profits": "personal" }
  db.prepare("INSERT INTO companys (company,users,owner,bal) VALUES (?,?,?,?)").run(args[2], JSON.stringify(companyData), message.author.id, 0)
  message.reply("Created clan " + Discord.Util.cleanContent(args[2], message) + "!")
}