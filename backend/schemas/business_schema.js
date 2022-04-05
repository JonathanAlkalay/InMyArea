const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessSchema = new Schema({

userName : String,   
passWord : String,
connected : Boolean
});

const Business = mongoose.model('business', businessSchema);

module.exports = Business;