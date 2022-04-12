const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

email : String,   
passWord : String,
name : String,
phoneNumber: String,
connected : Boolean
});

const User = mongoose.model('user', userSchema);

module.exports = User;