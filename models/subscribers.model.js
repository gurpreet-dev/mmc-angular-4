const Promise = require('bluebird');
const mongoose = require('mongoose');

const SubscribersSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true
  },
  channel_id: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!' },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!' },
  startdate: Date,
  enddate: Date,
  transaction_id: {
    type: String
  },
  cost: {
    type: String,
    default: '0'
  },
  payment_type: {
    type: String
  }
},
{ usePushEach: true, timestamps: true });

SubscribersSchema.method({ });

SubscribersSchema.statics = {};

const Subscribers = mongoose.model('Subscribers', SubscribersSchema);

module.exports = Subscribers;