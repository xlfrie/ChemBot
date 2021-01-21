const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  var companys = mongoose.model("companie", Schemas.companies)
  var bals = mongoose.model("balance", Schemas.balances)
  var bal = await bals.findById(message.author.id)
  var company = (await companys.find()).find(company => company.users.includes(message.author.id))
  if (!company) return message.reply("You aren't in a company!")
  if (!args[2]) return message.reply("Please provide an amount to deposit!")
  var depositing = args[2].toLowerCase() == "all" ? bal.bal : parseInt(args[2].split(",").join(""))
  if (isNaN(depositing)) return message.reply("Please provide a valid amount of test tubes to desposit.")
  if (depositing < 10) return message.reply("The minimum amount to deposit is 10 test tubes.")
  if (depositing > bal.bal) return message.reply("You don't have enough to deposit!")
  bal.bal = bal.bal - depositing
  bal.save()
  company.bal = company.bal + depositing
  company.save()
  message.reply(`Deposited ${depositing.toLocaleString()} **test tubes**!`)
}