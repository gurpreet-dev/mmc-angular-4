const Promise = require('bluebird');
const mongoose = require('mongoose');

var Bids = new mongoose.Schema({
  user_id:{
    type: mongoose.Schema.Types.ObjectId
  },
  price: {
    type: String
  },
  status: {
    type: Number,
    default: 0
  }
},
{ usePushEach: true, timestamps: true });

const AuctionSchema = new mongoose.Schema({
    user_id:{
      type: mongoose.Schema.Types.ObjectId
    },
    title: {
      type: String
    },
    price: {
      type: String
    },
    start_date: {
      type: Date
    },
    end_date: {
      type: Date
    },
    type: {
      type: String
    },
    file: {
      type: String
    },
    thumbnail: {
      type: String
    },
    size: {
      type: String
    },
    duration: {
      type: String
    },
    status: {
      type: Number,
      default: 1
    },
    payment_mode: {
      type: String
    },
    transaction_id: {
      type: String
    },
    transaction_date: {
      type: Date
    },
    sold_price: {
      type: String
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId
    },
    status2:{
      type: Number,
      default: 1,
    },
    bids: [Bids]
},
{ usePushEach: true, timestamps: true });

AuctionSchema.method({ });

AuctionSchema.statics = {};

const Auctions = mongoose.model('Auctions', AuctionSchema);

module.exports = Auctions;