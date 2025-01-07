const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Read from .env
const authToken = process.env.TWILIO_AUTH_TOKEN; // Read from .env
const client = twilio(accountSid, authToken);

const sendSMS = async (to, body) => {
    try {
        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER, // Twilio number
            to,
        });
        console.log('Message sent:', message.sid);
    } catch (error) {
        console.error('Error sending SMS:', error.message);
    }
};

module.exports = { sendSMS };
