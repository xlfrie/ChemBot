const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = (client, message, args, Discord) => {
  var em = new Discord.MessageEmbed()
    .setTitle("A Guide to Companies")
    .setColor(message.member.displayHexColor == "#000000" ? "#68e960" : message.member.displayHexColor)
    .setDescription("**Creating companies**:\n Come up with a company name.\nThen create your using `,company create <name>`.\n\n**Inviting**: Use `,company invite <user>` to invite a user. Replace <user> with a mention or ID.\n\n**Invites**:\nTo view 10 of your invitations please use `,company requests`.\nTo accept an invitation use `,company requests accept <company>`. Replace <company> with the company name.\n\n**View a company**:\n To view yours or someone elses' company use the following command `,company <company>`. Replace <company> with their or your company name.\nKeep in mind if you want to view the company you are in use `,company`\n\n**Bank**:\nYour company's bank is visible on it's company page.\nTo deposit test tubes use `,company deposit <amount>`. Replace <amount> with the amount you want to deposit. Using all as <amount> will deposit all your test tubes.\n\nTo withdraw from the company bank you must be the company owner. If you are the company owner use the command `,company withdraw <amount>`. Replace <amount> with your amount you want to withdraw. You also may say `all` for the amount to withdraw everything from the company bank.\n\n**Deletion**: To delete your company use the following command `,company delete`. After using the command react to the response with ✅.")
    .setTimestamp()
  message.reply(em)
}