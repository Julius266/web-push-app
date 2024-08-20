const Subscriber = require('../models/Subscriber');
const webPush = require('../config/webPush');

exports.subscribe = async (req, res) => {
    const { endpoint, keys, domain } = req.body;
    try {
        const subscriber = new Subscriber({ endpoint, keys, domain });
        await subscriber.save();
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to subscribe' });
    }
};
console.log('New Service Worker');


exports.sendNotification = async (req, res) => {
    const { endpoint, title, body } = req.body;

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
        res.status(500).json({ error: 'Error enviando notificación' });
    }
};

// Definir la función getSubscriptions
exports.getSubscriptions = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({});
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
};


