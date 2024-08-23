const express = require("express");
const {
  getSubscriptions,
  subscribe,
  sendNotification,
  deleteSubscription
} = require("../controllers/notificationController");
const router = express.Router();

router.get("/subscriptions", getSubscriptions);
router.post("/subscribe", subscribe);
router.post("/send", sendNotification);
router.delete('/unsubscribe', deleteSubscription); 

module.exports = router;
