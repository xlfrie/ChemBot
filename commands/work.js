const Database = require('better-sqlite3')
const db = new Database("db.txt", { verbose: console.log })

module.exports = {
  name: "work",
  description: "Work every 1 minute to gain test tubes!",
  usage: "[]",
  aliases: [],
  category: "Fun",
  execute(message, args, client, Discord) {
    
  }
}