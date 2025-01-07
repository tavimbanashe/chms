const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'your_smtp_host',
    port: 587, // or 465 for secure
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'your_email@example.com',
        pass: 'your_email_password',
    },
});

exports.send = async (recipients, subject, body) => {
    const mailOptions = {
        from: '"Church Management" <your_email@example.com>',
        to: recipients,
        subject: subject,
        text: body,
        html: `<p>${body}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
};
