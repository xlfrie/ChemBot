const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  var companys = mongoose.model("companie", Schemas.companies)
  companys = await companys.find()
  var company = companys.find(company => company.users.includes(message.author.id))
  if(!company) return message.reply("You aren't in a company.")
  if (company.owner == message.author.id) return message.reply("You can't leave your own company!")
  company.users = company.users.filter(user => user != message.author.id)
  company.save()
  message.reply(`Successfully left ${company.name}.`)
}