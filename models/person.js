const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: { type: String, required: true },
    age: Number,
    balance: Number
});

module.exports = mongoose.model('Employee', personSchema);