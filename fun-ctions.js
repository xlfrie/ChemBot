const readline = require("readline");
const crypto = require('crypto')
const Discord = require('discord.js')
const ms = require('ms')
const Database = require('better-sqlite3')
const db = new Database("db.txt")
const { MessageEmbed } = require('discord.js')

module.exports = {
  update: async (client, updateNum, ping = true) => {
    let changes = await client.channels.cache.get("798247525940985896").messages.fetch("799846200689033276")
    changes = changes.content.split("\n")
    var updateEm = new MessageEmbed()
    .setTitle("Update " + updateNum)
    .setDescription("\u200b\n**" + changes.map(change => "- " + change).join("\n") + "**\n\u200b")
    .setFooter("Keep on experimenting!", client.users.cache.get("796480356055777360").displayAvatarURL({ format: "png" }))
    .setTimestamp()
    .setColor(0x68e960)
    client.channels.cache.get("793686033551982642").send(ping == true?"<@&797868617097412639>":undefined, { embed: updateEm }).then(msg => {
      msg.crosspost()
    })
  },
  submissionsMsg: (client) => {
    client.channels.cache.get("797312863563022357").send(
`**Submissions**:
For each submission please fill out the corresponding template with detail. ***Do not contain [] in your final submission***.
**Bug Report Template**: 
> ChemBot Version: [You can check this in #update-log]
> Bug: [Bug]
*Example:*
> ChemBot Version: 1.0.0
> Bug: ChemBot won't give me infinite test tubes!
**Suggestion Template**:
There is no template for suggestion. Just make sure your submission starts with **suggest**
*Example:*
> suggest give me developer`)
  },
  give: (amount, id) => {
    db.prepare("UPDATE balances SET testtubes = (?) WHERE id = (?)").run(db.prepare("SELECT * FROM balances WHERE id = (?)").get(id).testtubes + amount, id)
  },
  autoBackup: () => {
    setInterval(function(){
      db.backup("BACKUPS/backup-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate()) + "-" + (new Date().getFullYear()) + ".txt")
    }, ms("5m"))
  },
  giveaway: async (client, mongoose, Schemas, amount) => {
    var members = await client.guilds.cache.get("793684121511526400").members.fetch()
    var user = members.filter(mem => !mem.user.bot).random().user
    var vouchers = mongoose.model("voucher", Schemas.vouchers)
    var code;
    await crypto.randomBytes(8, async function(err, buffer) { 
      code =  "V-" + buffer.toString('hex')
    var map = new Map()
    map.set("amount", amount)
    function reroll() {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question(`Winner: ${user.tag}. Do you want to reroll?`, (res) => {
        if(res == "yes") {
          user = members.filter(mem => !mem.user.bot).random().user
          reroll()
        } else {
          user.send(`You have won \`${amount.toLocaleString()}\` test tube. Please use \`,redeem ${code}\` in ChemBot Labs.`)
        }
      })
    }
    reroll()
    new vouchers({ code: code, data: map}).save()
    })
  }
}