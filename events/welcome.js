const { createCanvas, loadImage, registerFont } = require("canvas")

module.exports = {
  event: "guildMemberAdd",
  execute(client, Discord) {
    client.on("guildMemberAdd", async (member) => {
      if(member.guild.id != 793684121511526400) return;
      registerFont('./font2.ttf', { family: 'Krunker' });
      const canvas = new createCanvas(350, 150)
      const ctx = canvas.getContext("2d")
      const background = await loadImage('https://cdn.discordapp.com/attachments/796479848360575009/797203612480307270/Welcome.png');
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
      ctx.font = "14px Krunker";
      ctx.textAlign = "center";
      ctx.fillText(`${member.user.tag}`, 350 / 2, 37)
      var R = 50;
      ctx.beginPath()
      ctx.arc(175, 95, 50, 0, 2 * Math.PI, false);
      ctx.lineWidth = 5;
      ctx.stroke()
      ctx.arc(175, 95, R, 0, 2 * Math.PI, false);
      ctx.clip()
      const avatar = await loadImage(`${member.user.displayAvatarURL({ format: "png", size: 4096 })}`)
      ctx.drawImage(avatar, 125, 45, 100, 100)
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `Welcome_Image.png`)
      client.channels.cache.get("797203700753236039").send(`Welcome ${member.user.toString()}! Please get roles in <#797998497076477992>!`, attachment)
      member.roles.add(client.guilds.cache.get("793684121511526400").roles.cache.get("793686843442331659"))
      console.log("New user")
    })
    client.on("guildMemberRemove", (member) => {
      if(member.guild.id != 793684121511526400) return;
      client.channels.cache.get("797203700753236039").send(`**${member.user.tag}** has left the server.`)
    })
  }
}