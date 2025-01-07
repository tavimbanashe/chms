require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');

// Import routes
const authRoutes = require('./routes/authRoutes');
// (Other route imports omitted for brevity)

// Create the Express app
const app = express();

// CORS Configuration
const corsOptions = {
    origin: 'https://churchmanagementsystem.netlify.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Register routes
app.use('/auth', authRoutes);
// (Other routes omitted for brevity)

// Default route for health check
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Church Management System API' });
});

// SSL Configuration
const sslOptions = {
    cert: process.env.PEM_CERT, // Certificate loaded from environment variable
};

// Start the HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running securely on port ${PORT}`);
});

// HTTP server to redirect to HTTPS
const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
    res.end();
});

// Start the HTTP server for redirection
const HTTP_PORT = 80;
httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on port ${HTTP_PORT} and redirecting to HTTPS`);
});
