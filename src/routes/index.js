const { Router } = require('express')
const router = Router()

const webpush = require('../webpush')
let pushSubscription;

router.post('/subscription', async (req, res) => {
    pushSubscription = req.body;
    res.status(200).json();

    const payload = JSON.stringify({
        title: 'My notification',
        message: 'Hola mundo'
    })

    try {
        await webpush.sendNotification(pushSubscription, payload)
    } catch (error) {
        console.log(error) 
    }
})




module.exports = router;