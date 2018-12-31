const Promise = require('bluebird');
const mongoose = require('mongoose');

const VideoViewsSchema = new mongoose.Schema({
    video_id: { type: mongoose.Schema.Types.ObjectId, required: '{PATH} is required!' },
    views: {
        type: Number,
        default: 0
    } 
},
{ usePushEach: true, timestamps: true });

VideoViewsSchema.method({ });

VideoViewsSchema.statics = {};

const VideoViews = mongoose.model('VideoViews', VideoViewsSchema);

module.exports = VideoViews;