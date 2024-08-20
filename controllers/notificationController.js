const Subscriber = require('../models/Subscriber');
const webPush = require('../config/webPush');

exports.subscribe = async (req, res) => {
    const { endpoint, keys } = req.body;
    try {
        const subscriber = new Subscriber({ endpoint, keys });
        await subscriber.save();
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to subscribe' });
    }
};
console.log('New Service Worker');


exports.sendNotification = async (req, res) => {
    const notificationPayload = JSON.stringify({
        title: "Nueva Notificación",
        body: "Este es el contenido de la notificación",
    });

    try {
        const subscribers = await Subscriber.find({});
        subscribers.forEach(subscriber => {
            const pushSubscription = {
                endpoint: subscriber.endpoint,
                keys: subscriber.keys
            };
            webPush.sendNotification(pushSubscription, notificationPayload)
                .catch(error => console.error('Error sending notification:', error));
        });
        res.status(200).json({ message: 'Notificaciones enviadas' });
    } catch (error) {
        res.status(500).json({ error: 'Error enviando notificaciones' });
    }
};
