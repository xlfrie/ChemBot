const ms = require('ms')

module.exports = {
  name: "vote",
  description: "Get information on voting.",
  usage: "",
  aliases: [],
  category: "Information",
  async execute(message, args, client, Discord, Topgg, mongoose, Schemas) {
    var vmod = mongoose.model("vote", Schemas.votes)
    var vote = await vmod.findById(message.author.id)
    console.log(vote)
    var votes = await vmod.find()
    var voteLb = new Discord.Collection()
    votes.forEach(vote => {
      voteLb.set(vote.tag, { votes: vote.votes, tag: vote.tag })
    })
    voteLb.sort((a,b) => b.votes - a.votes)
    var i = 1
    voteLb.first(10).forEach(vote => { voteLb.set(vote.tag, { votes: vote.votes, tag: vote.tag, num: i }); i++; });
    if(!vote.voted) vote.voted = Date.now() 
    x = ((vote.voted + ms("12h")) - Date.now()) / 1000
    seconds = Math.trunc(x % 60)
    x /= 60
    minutes = Math.trunc(x % 60)
    x /= 60
    hours = Math.trunc(x % 24)
    x /= 24
    days = Math.trunc(x)
    var wait = [];
    if(days != 0) 
      wait.push(`${days.toLocaleString()} ${days == 1 ? "day" : "days"}`);
    if(hours != 0) 
      wait.push(`${hours.toLocaleString()} ${hours == 1 ? "hour" : "hours"}`);
    if(minutes != 0) 
      wait.push(`${minutes.toLocaleString()} ${minutes == 1 ? "minute" : "minutes"}`);
    if(seconds != 0) 
      wait.push(`${seconds.toLocaleString()} ${seconds == 1 ? "second" : "seconds"}`);
    if(wait.length != 1 || wait.length != 0)
      wait[wait.length - 1] = "and " + wait[wait.length - 1]
    var em = new Discord.MessageEmbed()
      .setTitle("Vote Information")
      .setColor(0xff00d9)
      .setDescription(`${!vote || (vote.voted + ms('12h')) < Date.now()  ? `**You can vote now! We would love you to vote [here](https://top.gg/bot/796480356055777360/vote).**` : `**Please wait ${wait.join(", ")} before voting again.**`}\n\nYou are placed ${voteLb.get(message.author.tag).num.toLocaleString()}/${voteLb.size.toLocaleString()}`)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic:true }))
    message.reply(em)
  }
}