const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');

router.post('/track-visit', async (req, res) => {
    const { visitedPages } = req.body;

    if (visitedPages && visitedPages.length > 0) {
        try {
            await Promise.all(visitedPages.map(url => {
                const visit = new Visit({ url });
                return visit.save();
            }));
            res.status(200).json({ message: 'Visits tracked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error saving visits', error });
        }
    } else {
        res.status(400).json({ message: 'No URLs to track' });
    }
});

module.exports = router;
