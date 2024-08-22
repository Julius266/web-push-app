const express = require('express');
const { getSubscriptions, subscribe, sendNotification } = require('../controllers/notificationController');
const router = express.Router();

router.get('/subscriptions', getSubscriptions); // Asegúrate de que getSubscriptions está definido
router.post('/subscribe', subscribe); // Asegúrate de que subscribe está definido
router.post('/send', sendNotification); // Asegúrate de que sendNotification está definido

module.exports = router;
