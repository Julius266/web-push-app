const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    endpoint: String,
    keys: {
        p256dh: String,
        auth: String
    }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
