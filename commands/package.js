const crypto = require('crypto')

module.exports = {
  name: "pack",
  description: "Put test tubes into a voucher.",
  usage: "<amount>",
  aliases: ["package"],
  category: "Dev",
  async execute(message, args, client, Discord, dbl, mongoose, Schemas) {
    var balances = mongoose.model("balance", Schemas.balances)
    var balance = await balances.findById(message.author.id)
    var vouchers = mongoose.model("voucher", Schemas.vouchers)
    if(!args[1]) return message.reply("Not a valid amount of **test tubes**.")
    var amount = args[1].toLowerCase() == 'all' ? balance.bal : parseInt(args[1].split`,`.join``)
    if(isNaN(amount)) return message.reply("Not a valid amount of **test tubes**.")
    if(amount < 10) return message.reply("The minimum amount to package is 10 **test tubes**.")
    if(amount > balance.bal) return message.reply("You don't have enough test tubes.")
    var code = "V-" + crypto.randomBytes(8).toString('hex')
    message.author.send(`Here is your voucher for \`${amount.toLocaleString()}\` **test tubes**! ${code}`).catch(err => {
      return message.reply("I can't send you dms!") 
    })
    var map = new Map()
    map.set('amount', amount)
    balance.bal = balance.bal - amount
    balance.save()
    new vouchers({ code: code, data: map }).save()
  }  
}