const express = require('express');
const { getSubscriptions, subscribe, sendNotification } = require('../controllers/notificationController');
const router = express.Router();

router.get('/subscriptions', getSubscriptions);
router.post('/subscribe', subscribe);
router.post('/send', sendNotification);

module.exports = router;
