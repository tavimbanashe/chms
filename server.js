require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan'); // For logging requests

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
// ...other imports

// Create the Express app
const app = express();

// CORS Configuration: Allow requests from the frontend (Netlify)
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? 'https://churchmanagementsystem.netlify.app'
        : 'http://localhost:3000', // Localhost for development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions)); // Use CORS middleware with options
app.use(bodyParser.json()); // Automatically parse JSON requests
app.use(helmet()); // Secure the app with HTTP headers
app.use(morgan('combined')); // Log HTTP requests

// Register routes
app.use('/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
// ...other route registrations

// Default route for health check
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Church Management System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
