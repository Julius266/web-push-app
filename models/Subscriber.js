const mongoose = require("mongoose");

const SubscriberSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  domain: { type: String },
  subscriptionDate: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);
