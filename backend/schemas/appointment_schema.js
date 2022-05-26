const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({

    userId: String,
    service: String,
    date: String,
    userName: String,
    phone: String,
    time: String,
});

module.exports = appointmentSchema;