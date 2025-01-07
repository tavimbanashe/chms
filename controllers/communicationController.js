const communicationModel = require('../models/communicationModel');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const db = require('../config/db');

// Twilio Configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Fetch all communication logs
exports.getAllLogs = async (req, res) => {
    try {
        const result = await communicationModel.getAllLogs();
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching communication logs:', error);
        res.status(500).json({ message: 'Error fetching communication logs', error: error.message });
    }
};

// Send bulk emails
exports.sendBulkEmail = async (req, res) => {
    const { subject, message, customRecipients } = req.body;

    try {
        // Fetch email addresses from the Members table if no custom recipients provided
        let recipientEmails = [];
        if (!customRecipients || customRecipients.length === 0) {
            const members = await db.query('SELECT email FROM Members WHERE email IS NOT NULL');
            recipientEmails = members.rows.map((member) => member.email);
        } else {
            recipientEmails = customRecipients;
        }

        if (recipientEmails.length === 0) {
            return res.status(400).json({ message: 'No valid email recipients found.' });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmails,
            subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);

        await communicationModel.logCommunication('email', subject, message, recipientEmails);

        res.status(200).json({ message: 'Emails sent successfully.', recipients: recipientEmails });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ message: 'Error sending emails', error: error.message });
    }
};

// Send bulk SMS
exports.sendBulkSMS = async (req, res) => {
    const { message, customRecipients } = req.body;

    try {
        // Fetch phone numbers from the Members table if no custom recipients provided
        let recipientPhones = [];
        if (!customRecipients || customRecipients.length === 0) {
            const members = await db.query('SELECT phone FROM Members WHERE phone IS NOT NULL');
            recipientPhones = members.rows.map((member) => member.phone);
        } else {
            recipientPhones = customRecipients;
        }

        if (recipientPhones.length === 0) {
            return res.status(400).json({ message: 'No valid phone recipients found.' });
        }

        for (const phone of recipientPhones) {
            await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phone,
            });
        }

        await communicationModel.logCommunication('sms', null, message, recipientPhones);

        res.status(200).json({ message: 'SMS sent successfully.', recipients: recipientPhones });
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ message: 'Error sending SMS', error: error.message });
    }
};


// Fetch recipients (emails and phone numbers)
exports.getRecipients = async (req, res) => {
    try {
        const query = `
            SELECT email, phone
            FROM Members
            WHERE email IS NOT NULL OR phone IS NOT NULL;
        `;
        const result = await db.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No recipients found in the database.' });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching recipients:', error);
        res.status(500).json({ message: 'Error fetching recipients', error: error.message });
    }
};

