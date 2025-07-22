const express = require('express');
const router = express.Router();

module.exports = (scheduleCollection) => {
    router.post('/schedule-collections/', async (req, res) => {
        try {
            const scheduleResult = req.body;
            const result = await scheduleCollection.insertOne(scheduleResult);
            res.send(result);
        } catch (error) {
            console.log(error.message);
            res.send({ message: "This error from Schedule api" });
        }
    });

    router.get('/schedule-collections/:email', async (req, res) => {
        try {
            const email = req.params.email;
            const result = await scheduleCollection.find({ email: email }).sort({ Date: 1, Time: 1 }).toArray();
            res.send(result);
        } catch (err) {
            console.log(err);
            res.send({ message: "This message from schedule-collections get method" });
        }
    });

    return router;
};