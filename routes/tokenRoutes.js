// routes/tokenRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { roomCodeToIdMap } = require('../socket');
const router = express.Router();

// 100ms token generation route
router.get('/token', async (req, res) => {
  try {
    const { roomId } = req.query;
    if (!roomId) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    const actualRoomId = roomCodeToIdMap[roomId] || roomId;

    const tokenId = uuidv4();
    const payload = {
      access_key: process.env.APP_ACCESS_KEY,
      room_id: actualRoomId,
      user_id: `user-${Math.random().toString(36).substring(7)}`,
      role: "host",
      jwtid: tokenId,
    };

    const token = jwt.sign(payload, process.env.HMS_APP_SECRET, {
      expiresIn: "24h",
      algorithm: "HS256",
      jwtid: tokenId,
    }); 
    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

module.exports = router;
