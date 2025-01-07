const axios = require('axios');
const otherApisModel = require('../models/otherApisModel');

exports.fetchWeatherData = async (req, res) => {
    const { city } = req.query;

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: process.env.WEATHER_API_KEY,
            },
        });

        await otherApisModel.logApiRequest(
            'Weather API',
            { city },
            response.data,
            response.status
        );

        res.status(200).json(response.data);
    } catch (error) {
        await otherApisModel.logApiRequest(
            'Weather API',
            { city },
            { error: error.message },
            error.response?.status || 500
        );

        res.status(error.response?.status || 500).json({ message: 'Error fetching weather data', error: error.message });
    }
};

exports.fetchCurrencyExchangeRates = async (req, res) => {
    const { base } = req.query;

    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);

        await otherApisModel.logApiRequest(
            'Currency Exchange API',
            { base },
            response.data,
            response.status
        );

        res.status(200).json(response.data);
    } catch (error) {
        await otherApisModel.logApiRequest(
            'Currency Exchange API',
            { base },
            { error: error.message },
            error.response?.status || 500
        );

        res.status(error.response?.status || 500).json({ message: 'Error fetching exchange rates', error: error.message });
    }
};
