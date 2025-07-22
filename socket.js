const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const roomUsers = {};
const roomCodeToIdMap = {};

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("Connected ID:", socket.id);

    socket.on("createRoom", async (userData) => {
      try {
        const roomResponse = await axios.post(
          "https://api.100ms.live/v2/rooms",
          {
            name: `room-${socket.id}-${Date.now()}`,
            description: "Dynamic room for Meevio",
            template_id: process.env.HMS_TEMPLATE_ID,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HMS_MANAGEMENT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const roomId = roomResponse.data.id;

        const roomCodeResponse = await axios.post(
          `https://api.100ms.live/v2/room-codes/room/${roomId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${process.env.HMS_MANAGEMENT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const roomCode = roomCodeResponse.data.data.find(
          (code) => code.enabled
        )?.code;
        roomCodeToIdMap[roomCode] = roomId;

        socket.join(roomCode);
        roomUsers[roomCode] = [{ socketId: socket.id, ...userData }];
        const { name, timestamp } = userData;
        socket.emit("RoomCreated", roomCode, name, timestamp);
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit("RoomCreationError", "Failed to create room");
      }
    });

    socket.on("scheduleMaker", async (userData) => {
      try {
        const roomResponse = await axios.post(
          "https://api.100ms.live/v2/rooms",
          {
            name: `room-${socket.id}-${Date.now()}`,
            description: "Dynamic room for Meevio",
            template_id: process.env.HMS_TEMPLATE_ID,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.HMS_MANAGEMENT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const roomId = roomResponse.data.id;

        const roomCodeResponse = await axios.post(
          `https://api.100ms.live/v2/room-codes/room/${roomId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${process.env.HMS_MANAGEMENT_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const roomCode = roomCodeResponse.data.data.find(
          (code) => code.enabled
        )?.code;
        const { name, timestamp } = userData;
        socket.emit("scheduled", roomCode, name, timestamp);
      } catch (error) {
        console.error("Error creating room:", error);
        socket.emit("RoomCreationError", "Failed to create room");
      }
    });

    socket.on("JoinRoom", ({ roomId, userData }) => {
      const actualRoomId = roomCodeToIdMap[roomId];
      if (!actualRoomId)
        return socket.emit("RoomJoinError", "Invalid room code");

      socket.join(roomId);
      if (!roomUsers[roomId]) roomUsers[roomId] = [];
      roomUsers[roomId].push({ socketId: socket.id, ...userData });

      socket.emit("RoomJoined", roomId);
      io.to(roomId).emit("updatedRoomUser", roomUsers[roomId]);
    });

    socket.on("getRoomUsers", (roomId) => {
      socket.emit("updatedRoomUser", roomUsers[roomId] || []);
    });

    socket.on(
      "sentMessage",
      async ({
        room,
        message,
        senderName,
        senderEmail,
        photo,
        receiverName,
      }) => {
        const messageData = {
          room,
          message,
          photo,
          senderName,
          senderEmail,
          receiverName,
          timestamp: new Date(),
        };
        io.to(room).emit("receiveMessage", {
          sender: socket.id,
          senderName,
          photo,
          message,
        });

        const { messagesCollection } = require("./db");
        await messagesCollection.insertOne(messageData);
      }
    );

    socket.on("disconnect", () => {
      for (const roomId in roomUsers) {
        roomUsers[roomId] = roomUsers[roomId].filter(
          (user) => user.socketId !== socket.id
        );
        if (roomUsers[roomId].length === 0) {
          delete roomUsers[roomId];
          delete roomCodeToIdMap[roomId];
        }
        io.to(roomId).emit("updatedRoomUser", roomUsers[roomId]);
      }
    });
  });
}

module.exports = {
  initSocket,
  roomCodeToIdMap,
};
