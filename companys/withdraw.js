const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  var companys = mongoose.model("companie", Schemas.companies)
  var company = (await companys.find()).find(company => company.users.includes(message.author.id))
  if (!company) return message.reply("You aren't in a company!")
  if (company.owner !== message.author.id) return message.reply("You aren't the owner of this company!")
  if (!args[2]) return message.reply("Please provide an amount to withdraw.")
  var withdrawing = args[2].toLowerCase() == "all" ? company.bal : parseInt(args[2].split(",").join(""))
  if (withdrawing < 0) message.reply("Please provide a positive number to withdraw!")
  if (company.bal < withdrawing) return message.reply("The company doesn't have enough test tubes to withdraw!")
  company.bal = company.bal - withdrawing
  company.save()
  var bals = mongoose.model("balance", Schemas.balances)
  var bal = await bals.findById(message.author.id)
  bal.bal = bal.bal + withdrawing, message.author.id
  bal.save()
  message.reply(`Withdrawed ${withdrawing.toLocaleString()} **test tubes**!`)
}