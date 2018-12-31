const Promise = require('bluebird');
const mongoose = require('mongoose');

var Features = new mongoose.Schema({
    feature: {
        type: String
    },
    access: {
        type: String
    }
});

const SubPlanSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    cost: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    features: [Features]
  },
  { usePushEach: true });
  
  SubPlanSchema.method({
  });
  
  SubPlanSchema.statics = {};

  const SubscriptionPlan = mongoose.model('SubscriptionPlan', SubPlanSchema);
  
  module.exports = SubscriptionPlan;
  