const mongoose = require('mongoose');
const appointmentSchema = require('./appointment_schema');
const Schema = mongoose.Schema;

const businessSchema = new Schema({

email : String,   
passWord : String,
connected : Boolean,
name : String,
phoneNumber : String,
description : String,
location : String,
category : String,
services : [String],
appointments : [appointmentSchema]
});

const Business = mongoose.model('business', businessSchema);

module.exports = Business;