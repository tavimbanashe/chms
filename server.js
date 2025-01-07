require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/authRoutes');
// (Other route imports omitted for brevity)
const dashboardRoutes = require('./routes/dashboardRoutes');
const memberRoutes = require('./routes/memberRoutes');
// (Additional route imports omitted)

const app = express();

// CORS Configuration
const corsOptions = {
    origin: 'https://churchmanagementsystem.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cors(corsOptions)); 
app.use(bodyParser.json());

// Register routes
app.use('/auth', authRoutes);
// (Other routes omitted for brevity)
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/members', memberRoutes);
// (Additional route registration omitted)

app.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Church Management System API' });
});

// SSL Configuration (Read certificate, key, and CA)
const sslOptions = {
    cert: fs.readFileSync(process.env.PEM_CERT), // Load certificate
    key: fs.readFileSync(process.env.PEM_KEY), // Load private key
    ca: fs.readFileSync(process.env.PEM_CA), // Load CA chain (if applicable)
};

// Start HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running securely on port ${PORT}`);
});

// HTTP server for redirecting HTTP traffic to HTTPS
const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { 'Location': `https://${req.headers.host}${req.url}` });
    res.end();
});
const HTTP_PORT = 80;
httpServer.listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on port ${HTTP_PORT} and redirecting to HTTPS`);
});
