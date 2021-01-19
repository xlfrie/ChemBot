const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = (client, message, args, Discord) => {
  var companys = db.prepare("SELECT * FROM companys").all()
  var users = []
  companys.forEach(company => Object.keys(JSON.parse(company.users)).forEach(user => users.push(user)))
  if (!users.includes(message.author.id)) return message.reply("You aren't in a company!")
  var company = companys.filter(company => Object.keys(JSON.parse(company.users)).includes(message.author.id))[0]
  if (company.owner != message.author.id) return message.reply("You must be the owner to delete this company!")
  message.reply("Are you sure you want to delete " + company.company + "?").then(msg => msg.react("✅").then(() => {
      msg.react("❌")
      const filter = (reaction, user) => {
        return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
      };
      msg.awaitReactions(filter, { max: 1, time: 60000 }).then(collected => {
        var reaction = collected.first()
        switch (reaction.emoji.name) {
          case "✅":
            msg.reactions.removeAll()
            db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(message.author.id).testtubes + db.prepare("SELECT * FROM companys WHERE owner = (?)").get(message.author.id).bal, message.author.id)
            db.prepare("DELETE FROM companys WHERE owner = (?)").run(message.author.id)
            message.reply("Delete " + company.company + " and transferred " + company.bal.toLocaleString() + " to " + message.author.tag)
            break;
          case "❌":
            msg.reactions.removeAll()
            message.reply("Cancelled deletion.")
            break;
        }
      })
  }))
}