const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = async (client, message, args, Discord, mongoose, Schemas) => {
  var companys = mongoose.model("companie", Schemas.companies)
  var company = (await companys.find()).find(company => company.users.includes(message.author.id))
  if (!company) return message.reply("You aren't in a company!")
  if (company.owner != message.author.id) return message.reply("You must be the owner to delete this company!")
  message.reply("Are you sure you want to delete " + company.name + "?").then(msg => msg.react("✅").then(() => {
      msg.react("❌")
      const filter = (reaction, user) => {
        return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
      };
      msg.awaitReactions(filter, { max: 1, time: 60000 }).then(async (collected) => {
        var reaction = collected.first()
        switch (reaction.emoji.name) {
          case "✅":
            msg.reactions.removeAll()
            var bals = mongoose.model("balance", Schemas.balances)
            var bal = await bals.findById(message.author.id)
            bal.bal = bal.bal + company.bal
            bal.save()
            companys.deleteOne({ name: company.name }).exec()
            message.reply("Delete " + company.name + " and transferred " + company.bal.toLocaleString() + " to " + message.author.tag)
            break;
          case "❌":
            msg.reactions.removeAll()
            message.reply("Cancelled deletion.")
            break;
        }
      })
  }))
}