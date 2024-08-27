const express = require("express");
const {
  getSubscriptions,
  subscribe,
  sendNotification,
  deleteSubscription,
} = require("../controllers/notificationController");
const router = express.Router();

// Definir rutas para las operaciones de notificaciones
router.get("/subscriptions", getSubscriptions); // Obtener todas las suscripciones
router.post("/subscribe", subscribe); // Suscribir un nuevo cliente
router.post("/send", sendNotification); // Enviar una notificación
router.delete("/unsubscribe", deleteSubscription); // Eliminar una suscripción

module.exports = router; // Exportar las rutas de notificaciones
