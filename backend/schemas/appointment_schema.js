const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({

    userId: String,
    businessId: String,
    service: String,
    date: String,
    userName: String,
    phone: String,
    time: String,
});

const Appointment = mongoose.model('appointment', appointmentSchema);

module.exports = Appointment;