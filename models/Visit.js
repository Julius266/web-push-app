const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    url: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visit', visitSchema);
