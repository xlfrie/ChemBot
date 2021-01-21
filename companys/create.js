const Database = require('better-sqlite3')
const db = new Database("db.txt")
const noName = ["help"]

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  if (!args[2]) return message.reply("Please provide a four letter name for your company.")
  var companys = mongoose.model("companie", Schemas.companies)
  var company = (await companys.find()).find(company => company.users.includes(message.author.id))
  if (company) return message.reply("You are already in a company!")
  if (args[2].length > 4) return message.reply("The maximum length for a company name is four letters.")
  if (!/^[a-zA-Z]+$/.test(args[2])) return message.reply("We only support a-z letters!")
  if (noName.includes(args[2].toLowerCase())) return message.reply("This name is not allowed!")
  if ((await companys.find()).find(company => company.name.toLowerCase() == args[2].toLowerCase())) return message.reply("This company name is already taken!")
  var companyData = []
  companyData.push(message.author.id)
  new companys({ name: args[2], users: companyData, owner: message.author.id, bal: 0 }).save()
  message.reply("Created company " + Discord.Util.cleanContent(args[2], message) + "!")
}