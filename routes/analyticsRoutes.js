const express = require("express");
const {
  registerVisit,
  getLastVisitedTab,
  acceptCookies,
  trackVisit // Añadir esta línea
} = require("../controllers/analyticsController");
const router = express.Router();

// Definir rutas para las operaciones de análisis
router.get("/visit/:tabName", registerVisit); // Registrar la pestaña visitada y guardarla en la base de datos
router.get("/last-visited", getLastVisitedTab); // Verificar la última pestaña visitada desde la cookie
router.post("/accept-cookies", acceptCookies); // Registrar la aceptación de cookies
router.post("/track-visit", trackVisit); // Ruta para recibir los datos de visitas desde el frontend

module.exports = router;
