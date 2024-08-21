const Subscriber = require('../models/Subscriber');
const webPush = require('../config/webPush');
const moment = require('moment-timezone');

// Middleware para manejo de errores
function errorHandler(err, res, customMessage) {
    console.error(err.message);
    res.status(500).json({ error: customMessage || 'Error en el servidor' });
}

exports.subscribe = async (req, res) => {
    const { endpoint, keys } = req.body;
    const domain = req.headers.origin;
    const subscriptionDate = moment().tz('America/Guayaquil').toDate(); // Cambia 'America/New_York' por tu zona horaria
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    if (!endpoint || typeof endpoint !== 'string' || !keys || typeof keys !== 'object') {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
        const subscriber = new Subscriber({ 
            endpoint, 
            keys, 
            domain, 
            subscriptionDate, 
            ipAddress, 
            userAgent 
        });
        await subscriber.save();
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        errorHandler(error, res, 'Failed to subscribe');
    }
};

exports.sendNotification = async (req, res) => {
    const { endpoint, title, body } = req.body;

    if (!endpoint || typeof endpoint !== 'string' || 
        !title || typeof title !== 'string' || 
        !body || typeof body !== 'string') {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    const notificationPayload = JSON.stringify({
        title,
        body,
        icon: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTnKvQE0xOyMLhnfmhBRZbUXkmQWmlTTMGPUABNn7bNs9XYRi1W'
    });

    try {
        const subscriber = await Subscriber.findOne({ endpoint });
        if (subscriber) {
            const pushSubscription = {
                endpoint: subscriber.endpoint,
                keys: subscriber.keys
            };
            await webPush.sendNotification(pushSubscription, notificationPayload);
            res.status(200).json({ message: 'Notificación enviada' });
        } else {
            res.status(404).json({ error: 'Suscripción no encontrada' });
        }
    } catch (error) {
        errorHandler(error, res, 'Error enviando notificación');
    }
};

exports.getSubscriptions = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({});
        res.status(200).json(subscribers);
    } catch (error) {
        errorHandler(error, res, 'Failed to fetch subscriptions');
    }
};
