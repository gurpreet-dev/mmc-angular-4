const Promise = require('bluebird');
const mongoose = require('mongoose');

const StaticPagesSchema = new mongoose.Schema({
  title: {
    type: String
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String
  },
  status: {
    type: Number,
    default: 1
  }
},
{ usePushEach: true, timestamps: true });

StaticPagesSchema.method({ });

StaticPagesSchema.statics = {};

const StaticPages = mongoose.model('StaticPages', StaticPagesSchema);

module.exports = StaticPages;