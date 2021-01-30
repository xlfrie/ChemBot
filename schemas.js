module.exports = (mongoose, Schema) => {
  return {
    cooldowns: new Schema({
      id: {
        type: String,
        required: true
      },
      ends: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        required: true
      }
    }),
    balances: new Schema({
      _id: {
        type: String,
        required: true
      },
      bal: {
        type: Number,
        required: true
      }
    }),
    inventory: new Schema({
      _id: {
        type: String,
        required: true
      },
      inv: {
        type: Array,
        required: true
      }
    }),
    companies: new Schema({
      name: {
        type: String,
        required: true
      },
      users: {
        type: Array,
        required: true
      },
      owner: {
        type: String,
        required: true
      },
      bal: {
        type: Number,
        required: true
      },
      multipliers: {
        type: Array,
        required: true
      }
    }),
    crequests: new Schema({
      _id: {
        type: String,
        required: true
      },
      requests: {
        type: Array,
        required: true
      }
    }),
    levels: new Schema({
      guildid: {
        type: String,
        required: true
      },
      levels: {
        type: Map,
        required: true
      }
    }),
    vouchers: new Schema({
      code: {
        type: String,
        required: true
      },
      data: {
        type: Map,
        required: true
      }
    })
  }
}