const Promise = require('bluebird');
const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
},
{ usePushEach: true, timestamps: true });

FaqSchema.method({ });

FaqSchema.statics = {};

const Faq = mongoose.model('Faq', FaqSchema);

module.exports = Faq;