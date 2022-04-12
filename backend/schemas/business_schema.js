const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessSchema = new Schema({

email : String,   
passWord : String,
connected : Boolean,
name : String,
ownerName: String,
phoneNumber : String,
description : String,
location : String,
category : String
});

const Business = mongoose.model('business', businessSchema);

module.exports = Business;