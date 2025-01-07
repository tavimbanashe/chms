const express = require('express');
const router = express.Router();

router.get('/stats', async (req, res) => {
    // Example stats data
    const stats = {
        members: 120,
        events: 15,
        donations: 5000,
    };
    res.json(stats);
});

module.exports = router;
