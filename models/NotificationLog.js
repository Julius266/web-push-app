const mongoose = require("mongoose");

// Definir el esquema para el registro de notificaciones
const NotificationLogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  url: { type: String, required: true },
  domain: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NotificationLog", NotificationLogSchema); // Exportar el modelo de registro de notificaciones
