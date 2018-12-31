const Promise = require('bluebird');
const mongoose = require('mongoose');
/****************/

var Videos = new mongoose.Schema({
  title: {
    type: String
  },
  thumbnail: {
    type: String,
  },
  video: {
    type: String
  },
  duration: {
    type: String
  },
  description: {
    type: String
  },
  size: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!' },
  createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
},
{ timestamps: true });

var SubCategory = new mongoose.Schema({
    title: {
      type: String,
      unique: true,
      required: true,
      index: true,
      sparse: true
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      index: true, 
      sparse: true
    },
    status: {
      type: String,
      default: '1'
    },
    meta_keywords: {
      type: String
    },
    meta_description: {
      type: String
    },
    videos: [Videos]
},
{ usePushEach: true,  timestamps: true });

const VideoCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  status: {
    type: String,
    default: '1'
  },
  subcategories: [SubCategory]
},
{ usePushEach: true,  timestamps: true });

/***********************/

VideoCategorySchema.method({
});


const VideoCategory = mongoose.model('VideoCategory', VideoCategorySchema);

module.exports = VideoCategory;
