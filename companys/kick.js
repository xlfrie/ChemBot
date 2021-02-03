const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  var companys = mongoose.model("companie", Schemas.companies)
  companys = await companys.find()
  var company = companys.find(company => company.users.includes(message.author.id))
  if (!company) return message.reply("You aren't in a company.")
  if (company.owner !== message.author.id) return message.reply("You aren't the company owner!")
  var user;
  if (args[2]) {
    user = message.mentions.members.first() || client.users.cache.find(user => user.tag.toLowerCase() == args[2].toLowerCase() || user.username.toLowerCase() == args[1].toLowerCase()) || client.users.cache.get(args[2])
  }
  if(!user) message.reply("Please provide a valid user to kick.")
  company.users = company.users.filter(u => u != user.id)
  company.save()
  message.reply(`***Kicked ${user.tag} from ${company.name}***`)
}