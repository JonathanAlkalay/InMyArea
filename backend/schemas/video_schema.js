const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({

email : String,   
filePath : String
});

const Video = mongoose.model('video', videoSchema);

module.exports = Video;