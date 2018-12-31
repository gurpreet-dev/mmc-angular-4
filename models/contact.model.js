const Promise = require('bluebird');
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  reply: {
    type: String,
    default: ''
  }
},
{ usePushEach: true, timestamps: true });

ContactSchema.method({ });

ContactSchema.statics = {};

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;