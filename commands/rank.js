const { createCanvas, loadImage, registerFont } = require("canvas")
const Database = require('better-sqlite3')
const db = new Database("db.txt")

module.exports = {
  name: "rank",
  description: "Get your rank.",
  usage: "",
  aliases: ["level"],
  category: "Fun",  
  async execute(message, args, client, Discord, Topgg, mongoose, Schemas) {
    var levelModel = mongoose.model("level", Schemas.levels)
    if (!(await levelModel.findOne({ guildid: message.guild.id }))) new levelModel({ guildid: message.guild.id, levels: {} }).save()
    var levels = await levelModel.findOne({ guildid: message.guild.id })
    if (!levels.levels.get(message.author.id)) {
      levels.levels.set(message.author.id, { "level": 1, "xp": 0, "xpNeeded": 110, "totalXp": 0 })
      levels.save()
    }
    var xp = levels.levels.get(message.author.id).xp
    var goal = levels.levels.get(message.author.id).xpNeeded
    var level = levels.levels.get(message.author.id).level
    const canvas = new createCanvas(350, 150)
    const ctx = canvas.getContext("2d")
    const background = await loadImage('https://cdn.discordapp.com/attachments/762029072821387304/799388704384221214/LevelBG.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#b0b0b090"
    ctx.beginPath()
    ctx.moveTo(25, 122)
    ctx.lineWidth = 1
    ctx.lineTo(100, 122)
    ctx.arc(225, 131, 9, -1.5708, 1.5708);
    ctx.arc(25, 131, 9, 1.5708, -1.5708);
    ctx.fill()
    ctx.fillStyle = "#68e96080"
    ctx.beginPath()
    ctx.moveTo(25, 125)
    ctx.lineWidth = 5
    ctx.lineTo(100, 125)
    ctx.arc(xp == 0 ? 25 : 225 / (goal / xp), 131, 6, -1.5708, 1.5708);
    ctx.arc(25, 131, 6, 1.5708, -1.5708);
    ctx.fill()
    registerFont('./font2.ttf', { family: 'Krunker' });
    registerFont('./poppins.ttf', { family: 'poppins' });
    ctx.font = "16px poppins bold";
    ctx.fillStyle = "#00000075"
    ctx.fillText(message.author.tag, 95, 85);
    ctx.font = "6px Krunker"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText(`${xp} / ${goal}`, 135, 134);
    ctx.font = "9px Krunker"
    ctx.textAlign = "left"
    ctx.fillText(`Level: ${level}`, 250, 136);
    const pfp = await loadImage(message.author.displayAvatarURL({ format: "png" }));
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(56, 76, 64 / 2, 0, 2 * Math.PI);
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(56, 76, 64 / 2, 0, 2 * Math.PI);
    ctx.clip()
    ctx.drawImage(pfp, 24, 44, 64, 64)
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `Welcome_Image.png`)
    message.reply(attachment)
  }
}