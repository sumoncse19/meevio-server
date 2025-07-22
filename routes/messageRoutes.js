const express = require('express');
const router = express.Router();

module.exports = (messagesCollection) => {
    router.get('/:roomId', async (req, res) => {
        const roomId = req.params.roomId;
        const messages = await messagesCollection.find({ room: roomId }).toArray();
        res.send(messages);
    });

    router.get("/conversations/user/:email", async (req, res) => {
        const { email } = req.params;
        const userRooms = await messagesCollection.aggregate([
            {
                $match: {
                    $or: [
                        { senderEmail: email },
                        { receiverEmail: email }
                    ]
                }
            },
            {
                $group: {
                    _id: "$room"
                }
            }
        ]).toArray();

        const roomIds = userRooms.map(r => r._id);
        const result = await messagesCollection.aggregate([
            {
                $match: {
                    room: { $in: roomIds }
                }
            },
            {
                $group: {
                    _id: "$room",
                    messages: {
                        $push: {
                            message: "$message",
                            senderName: "$senderName",
                            receiverName: "$receiverName",
                            senderEmail: "$senderEmail",
                            receiverEmail: "$receiverEmail",
                            photo: "$photo",
                            timestamp: "$timestamp"
                        }
                    },
                    lastMessageTime: { $max: "$timestamp" }
                }
            },
            {
                $project: {
                    _id: 0,
                    room: "$_id",
                    messages: 1,
                    lastMessageTime: 1
                }
            },
            {
                $sort: {
                    lastMessageTime: -1
                }
            }
        ]).toArray();

        res.json(result);
    });

    return router;
};