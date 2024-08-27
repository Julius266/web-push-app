const webpush = require("web-push");
const { PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY } = process.env;

// Configurar detalles de VAPID para web push
webpush.setVapidDetails(
  "mailto:correodeejemplo@gmail.com",
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

module.exports = webpush; // Exportar la configuración de web push
