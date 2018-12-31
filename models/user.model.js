const Promise = require('bluebird');
const mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); 

// var Subscriptions = new mongoose.Schema({
//   title: {
//     type: String
//   },
//   cost: {
//     type: String
//   },
//   plan_id: {
//     type: String
//   },
//   startdate: Date,
//   enddate: Date,
//   transaction_id: String,
//   payment_type: String
// });

var Photos = new mongoose.Schema({
  url: {
      type: String
  }
},
{ usePushEach: true, timestamps: true });

var Albums = new mongoose.Schema({
  title: {
      type: String,
      required: true
  },
  thumbnail: {
      type: String,
      required: true
  },
  images: [Photos]
},
{ usePushEach: true, timestamps: true });

var Favorite_images = new mongoose.Schema({
  image_id: {
      type: mongoose.Schema.Types.ObjectId
  },
},
{ usePushEach: true, timestamps: true });

var Favorite_videos = new mongoose.Schema({
  video_id: {
      type: mongoose.Schema.Types.ObjectId
  }
},
{ usePushEach: true, timestamps: true });

var Payment_info = new mongoose.Schema({
    account_holder: {
      type: String
    },
    bank: {
      type: String
    },
    account_no: {
      type: String
    },
    swift_code: {
      type: String
    },
    country: {
      type: String
    },
    paypal_email: {
      type: String
    }
},
{ usePushEach: true, timestamps: true });

var Plans = new mongoose.Schema({
  title: {
    type: String
  },
  cost: {
    type: String
  },
  duration: {
    type: String
  }
},
{ usePushEach: true, timestamps: true });

var Auctions = new mongoose.Schema({
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
  }
},
{ usePushEach: true, timestamps: true });

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  phone: {
    type: String
  },
  profilepic: {
    type: String
  },
  bannerpic: {
    type: String
  },
  dob: {
    type: String
  },
  gender: {
    type: String
  },
  country: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  online: {
    type: String,
    default: 'no'
  },
  opentok_session: {
    type: String
  },
  password: String,
  subscribed: {
    type: String,
    default: '0'
  },
  // startdate: Date,
  // enddate: Date,
  albums: [Albums],
  payment_info: Payment_info,
  description: {
    type: String
  },
  favorite_images: [Favorite_images],
  favorite_videos: [Favorite_videos],
  plans: [Plans],
  auctions: [Auctions]
},
{ usePushEach: true, timestamps: true });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
});

/**
 * Statics
 */
UserSchema.statics = {};

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
 
// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * @typedef User
 */
const User = mongoose.model('User', UserSchema);

module.exports = User;