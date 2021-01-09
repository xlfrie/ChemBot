const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require("../config.json")

module.exports = {
  name: "declinesub",
  description: "Decline a submission!",
  usage: "<submission ID>",
  aliases: [],
  category: "Dev",
  async execute(message, args, client, Discord) {
    if(!args[1]) return message.reply("Please provide a submission ID to proceed.");
    var submission = db.prepare("SELECT * FROM submissions WHERE subid = (?)").get(args[1])
    if(!submission) return message.reply("Please provide a **valid** submission ID to proceed.")
    var subUser = await client.users.fetch(submission.submitter)
    try {
      subUser.send(`Your ${submission.type == "bug"?"bug report":"suggestion"} has been declined.`)
    } catch {  }
    db.prepare("DELETE FROM submissions WHERE subid = (?)").run(args[1])
    message.delete()
  }
}