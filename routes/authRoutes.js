const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/jwt', (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    res
        .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: 'cookie created' });
});

router.get('/jwt', (req, res) => {
    res.send("jwt /jwt working");
});

router.post('/jwtlogout', (req, res) => {
    res
        .clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        .send({ success: 'cookie cleared' });
});

router.get('/logout', (req, res) => {
    res.send("jwt /logout working");
});

module.exports = router;