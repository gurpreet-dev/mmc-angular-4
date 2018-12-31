const Promise = require('bluebird');
const mongoose = require('mongoose');

var Photos = new mongoose.Schema({
    url: {
        type: String
    }
});

const AlbumSchema = new mongoose.Schema({
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

AlbumSchema.method({
});

AlbumSchema.statics = {};

const Albums = mongoose.model('Albums', AlbumSchema);

module.exports = Albums;