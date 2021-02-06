module.exports = {
  name: "redeem",
  description: "Redeem a voucher code.",
  usage: "<code>",
  aliases: [],
  category: "Fun",
  async execute(message, args, client, Discord, Topgg, mongoose, Schemas) {
    var vouchers = mongoose.model("voucher", Schemas.vouchers)
    var voucher = await vouchers.findOne({ code: args[1] })
    var bals = mongoose.model("balance", Schemas.balances)
    var bal = await bals.findById(message.author.id)
    if(!args[1] || !voucher) return message.reply("Please provide a valid voucher code.")
    bal.bal = bal.bal + voucher.data.get("amount")
    bal.save()
    vouchers.deleteOne({ code: voucher.code }).exec()
    message.reply(`Redeemed \`${voucher.data.get('amount').toLocaleString()}\` test tubes!`)
  }  
}