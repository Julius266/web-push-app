const Subscriber = require("../models/Subscriber");
const NotificationLog = require("../models/NotificationLog");
const webPush = require("../config/webPush");
const moment = require("moment-timezone");

// Middleware para manejo de errores
function errorHandler(err, res, customMessage) {
  console.error(err.message);
  res.status(500).json({ error: customMessage || "Error en el servidor" });
}

exports.subscribe = async (req, res) => {
  console.log(req.body); // Verificar datos recibidos

  const { endpoint, keys, location } = req.body;
  const domain = req.headers.origin;
  const subscriptionDate = moment().tz("America/Guayaquil").toDate();
  const ipAddress = req.ip;
  const userAgent = req.headers["user-agent"];

  if (
    !endpoint ||
    typeof endpoint !== "string" ||
    !keys ||
    typeof keys !== "object"
  ) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  try {
    // Guardar suscriptor
    const subscriber = new Subscriber({
      endpoint,
      keys,
      domain,
      subscriptionDate,
      ipAddress,
      userAgent,
      location,
    });
    await subscriber.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    errorHandler(error, res, "Failed to subscribe");
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    // Obtener todos los suscriptores
    const subscribers = await Subscriber.find({});
    res.status(200).json(subscribers);
  } catch (error) {
    errorHandler(error, res, "Failed to fetch subscriptions");
  }
};

exports.sendNotification = async (req, res) => {
  const { endpoint, title, body, url } = req.body;

  if (
    !endpoint ||
    typeof endpoint !== "string" ||
    !title ||
    typeof title !== "string" ||
    !body ||
    typeof body !== "string"
  ) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const finalUrl = url || "https://sistemasgenesis.com.ec/"; // URL predeterminada

  const notificationPayload = JSON.stringify({
    title,
    body,
    url: finalUrl,
    icon: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W",
  });

  try {
    // Buscar suscriptor por endpoint
    const subscriber = await Subscriber.findOne({ endpoint });
    if (subscriber) {
      const pushSubscription = {
        endpoint: subscriber.endpoint,
        keys: subscriber.keys,
      };
      await webPush.sendNotification(pushSubscription, notificationPayload);

      // Guardar registro de la notificación
      const notificationLog = new NotificationLog({
        title,
        body,
        url: finalUrl,
        domain: subscriber.domain,
        sentAt: new Date(),
      });
      await notificationLog.save();

      res.status(200).json({ message: "Notificación enviada con éxito" });
    } else {
      res.status(404).json({ error: "Suscripción no encontrada" });
    }
  } catch (error) {
    console.error("Error enviando notificación:", error);
    res.status(500).json({ error: "Error enviando notificación" });
  }
};

exports.deleteSubscription = async (req, res) => {
  const { endpoint } = req.body;

  if (!endpoint) {
    return res.status(400).json({ error: "Endpoint es requerido" });
  }

  try {
    // Eliminar suscripción por endpoint
    const result = await Subscriber.deleteOne({ endpoint });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Suscripción no encontrada" });
    }
    res.status(200).json({ message: "Suscripción eliminada con éxito" });
  } catch (error) {
    errorHandler(error, res, "Error eliminando suscripción");
  }
};
