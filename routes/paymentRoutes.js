const express = require('express');
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRECT_KEY);

module.exports = (paymentCollection) => {
    router.post('/create-payment-intent', async (req, res) => {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: req.body.amount * 100,
                currency: req.body.currency || 'usd',
                automatic_payment_methods: {
                    enabled: true
                }
            });
            res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.post('/payment-success', async (req, res) => {
        try {
            const info = req.body;
            const result = await paymentCollection.insertOne(info);
            res.send(result);
        } catch (error) {
            res.status(404).send({ message: error.message });
        }
    });

    router.get('/all-payments', async (req, res) => {
        try {
            const result = await paymentCollection.find().toArray();
            res.send(result);
        } catch (error) {
            res.send({ message: error.message });
        }
    });

    return router;
};
