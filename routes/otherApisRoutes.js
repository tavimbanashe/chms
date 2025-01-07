const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/weather', async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${process.env.WEATHER_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

router.get('/jokes', async (req, res) => {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch joke data' });
    }
});

module.exports = router;
