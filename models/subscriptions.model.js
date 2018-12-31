const Promise = require('bluebird');
const mongoose = require('mongoose');

const SubscriptionsSchema = new mongoose.Schema({
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
  payment_type: {
    type: String
  },
  cost: {
    type: String,
    default: '0'
  },
  status: {
    type: String,
    default: 'active'
  }
},
{ usePushEach: true, timestamps: true });

SubscriptionsSchema.method({ });

SubscriptionsSchema.statics = {};

const Subscriptions = mongoose.model('Subscriptions', SubscriptionsSchema);

module.exports = Subscriptions;