require('dotenv').config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); // For logging requests
const rateLimit = require('express-rate-limit'); // For rate limiting

// Import routes
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const memberRoutes = require('./routes/memberRoutes');
const cellMinistryRoutes = require('./routes/cellMinistryRoutes');
const counselingRoutes = require('./routes/counselingRoutes');
const givingReportsRoutes = require('./routes/givingReportsRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const serviceAgendaRoutes = require('./routes/serviceAgendaRoutes');
const volunteerScheduleRoutes = require('./routes/volunteerScheduleRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const rolesPermissionsRoutes = require('./routes/rolesPermissionsRoutes');
const onlineGivingRoutes = require('./routes/onlineGivingRoutes');
const servicePlanRoutes = require('./routes/servicePlanRoutes');
const tithesRoutes = require('./routes/tithesRoutes');
const specialGivingRoutes = require('./routes/specialGivingRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const reportsAnalyticsRoutes = require('./routes/reportsAnalyticsRoutes');
const eventRoutes = require('./routes/eventRoutes');
const otherApisRoutes = require('./routes/otherApisRoutes');
const offeringsRoutes = require('./routes/offeringsRoutes');

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
app.use(express.json()); // Automatically parses JSON request bodies
app.use(helmet()); // Secure the app with HTTP headers

// Logging configuration based on environment
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('tiny'));  // Minimal logging in production
} else {
    app.use(morgan('combined'));  // Detailed logging in development
}

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests, please try again later.'
});
app.use(limiter);  // Apply rate limiter globally

// Register routes
app.use('/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/cell-ministries', cellMinistryRoutes);
app.use('/api/members/counseling', counselingRoutes);
app.use('/api/giving-reports', givingReportsRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/service-agenda', serviceAgendaRoutes);
app.use('/api/volunteer-schedules', volunteerScheduleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/roles-permissions', rolesPermissionsRoutes);
app.use('/api/online-giving', onlineGivingRoutes);
app.use('/api/service-planning', servicePlanRoutes);
app.use('/api/tithes', tithesRoutes);
app.use('/api/special-givings', specialGivingRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reports-analytics', reportsAnalyticsRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', otherApisRoutes);
app.use('/api/offerings', offeringsRoutes);

// Default route for health check
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to the Church Management System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

// SSL Configuration
const sslEnabled = process.env.NODE_ENV === 'production';

// Check if SSL certificates exist in the environment
if (sslEnabled) {
    // Load CA certificate (since you only have the CA cert)
    const ca = fs.readFileSync(process.env.DB_SSLROOTCERT, 'utf8');  // Load the CA certificate

    const credentials = { ca };  // Using CA certificate to verify connections

    // Create HTTPS server using CA certificate (without server key/certificate)
    https.createServer(credentials, app).listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
} else {
    // Fallback to HTTP in development
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
