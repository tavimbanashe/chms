require('dotenv').config(); // Load environment variables
const paypal = require('@paypal/checkout-server-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const onlineGivingModel = require('../models/onlineGivingModel');

// PayPal Environment Setup
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Process Payment
exports.processPayment = async (req, res) => {
    const { donor_name, email, amount, platform } = req.body;

    try {
        if (!donor_name || !email || !amount || !platform) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        let transactionId = null;
        let approvalUrl = null;

        if (platform.toLowerCase() === 'paypal') {
            // PayPal Payment Logic
            const request = new paypal.orders.OrdersCreateRequest();
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            value: amount.toFixed(2), // Ensure amount is formatted correctly
                            currency_code: 'USD',
                        },
                    },
                ],
            });

            const response = await paypalClient.execute(request);
            transactionId = response.result.id;
            approvalUrl = response.result.links.find(link => link.rel === 'approve')?.href;

            // Save the transaction to the database
            await onlineGivingModel.createDonation(donor_name, email, amount, 'paypal', transactionId, 'Pending');
        } else if (platform.toLowerCase() === 'stripe') {
            // Stripe Payment Logic
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Online Giving',
                            },
                            unit_amount: Math.round(amount * 100), // Convert to cents
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/success`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            });

            transactionId = session.id;
            approvalUrl = session.url;

            // Save the transaction to the database
            await onlineGivingModel.createDonation(donor_name, email, amount, 'stripe', transactionId, 'Pending');
        } else {
            return res.status(400).json({ message: 'Unsupported payment platform' });
        }

        res.status(200).json({ approvalUrl, transactionId });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
};

// Fetch All Donations
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await onlineGivingModel.getAllDonations();
        res.status(200).json(donations);
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ message: 'Error fetching donations', error: error.message });
    }
};

// PayPal Webhook
exports.paypalWebhook = async (req, res) => {
    const webhookEvent = req.body;

    try {
        if (webhookEvent.event_type === 'CHECKOUT.ORDER.APPROVED') {
            const transactionId = webhookEvent.resource.id;
            await onlineGivingModel.updateTransactionStatus(transactionId, 'Completed');
            res.status(200).json({ message: 'Transaction updated successfully' });
        } else {
            console.log('Unhandled PayPal webhook event:', webhookEvent.event_type);
            res.status(400).json({ message: 'Unhandled webhook event' });
        }
    } catch (error) {
        console.error('Error handling PayPal webhook:', error);
        res.status(500).json({ message: 'Error handling webhook', error: error.message });
    }
};

// Stripe Webhook
exports.stripeWebhook = async (req, res) => {
    const signature = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            await onlineGivingModel.updateTransactionStatus(session.id, 'Completed');
            res.status(200).json({ message: 'Transaction updated successfully' });
        } else {
            console.log('Unhandled Stripe webhook event:', event.type);
            res.status(400).json({ message: 'Unhandled webhook event' });
        }
    } catch (error) {
        console.error('Error handling Stripe webhook:', error);
        res.status(500).json({ message: 'Error handling webhook', error: error.message });
    }
};

// Error Handler for Webhook Routes
exports.webhookErrorHandler = async (error, req, res, next) => {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed', error: error.message });
};
