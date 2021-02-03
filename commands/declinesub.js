const Database = require('better-sqlite3')
const db = new Database("db.txt")
const config = require("../config.json")

module.exports = {
  name: "declinesub",
  description: "Decline a submission!",
  usage: "<submission ID>",
  aliases: [],
  category: "Dev",
  async execute(message, args, client, Discord, dbl, mongoose, Schemas) {
    if(!args[1]) return message.reply("Please provide a submission ID to proceed.");
    var submissions = mongoose.model("submission", Schemas.submissions)
    var submission = await submissions.findById(args[1])
    if(!submission) return message.reply("Please provide a **valid** submission ID to proceed.")
    var subUser = await client.users.fetch(submission.submitter)
    try {
      subUser.send(`Your ${submission.type == "bug"?"bug report":"suggestion"} has been declined.`)
    } catch {  }
    submissions.deleteOne({ _id: args[1] })
    message.delete()
  }
}