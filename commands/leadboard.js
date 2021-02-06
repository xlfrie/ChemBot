const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "leaderboard",
  description: "View the current leaders in test tubes!",
  usage: "",
  aliases: ["lb"],
  category: "Fun",
  async execute(message, args, client, Discord, Topgg, mongoose, Schemas) {
    switch (args[1] ? args[1].toLowerCase() : args[1]) {
      case 'tubes':
      default:
      case 'global':
        require('../leaderboards/tubes.js')(message, args, client, Discord, mongoose, Schemas)
        break;
      case 'levels':
      case "lvls":
      case "level":
      case 'xp':
        require('../leaderboards/levels.js')(message, args, client, Discord, mongoose, Schemas)
        break;
        case 'companies':

        break;
    }
  }
}
