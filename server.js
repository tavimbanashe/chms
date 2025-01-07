require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

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
    origin: 'https://churchmanagementsystem.netlify.app/', // Netlify frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allows cookies or authentication headers
};

app.use(cors(corsOptions)); // Use CORS middleware with options
app.use(bodyParser.json()); // Automatically parse JSON requests

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

// SSL Configuration for Express server
const sslOptions = {
    //key: fs.readFileSync(process.env.PEM_CERT_KEY), // Path to your private key for your server (if required)
    cert: fs.readFileSync(process.env.PEM_CERT), // Path to your public certificate for your server
    //ca: fs.readFileSync(process.env.PEM_CERT_CA), // Path to your certificate authority file (if required)
};

// Start the HTTPS server
const PORT = process.env.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
});
