require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { connectMongo } = require("./db");
const { initSocket } = require("./socket");
const nodemailer = require("nodemailer");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://meevio-1425e.web.app",
      "https://meevio-vfak.onrender.com",
    ],
    credentials: true,
  })
);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://meevio-1425e.web.app",
      "https://meevio-vfak.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);

// Start app after DB connection
async function run() {
  try {
    await connectMongo();

    // Import collections after connection
    const {
      usersCollection,
      messagesCollection,
      scheduleCollection,
      paymentCollection,
    } = require("./db");

    // Root route
    app.get("/", (req, res) => res.send("MEEVIO SERVER RUNNING"));

    // Routes
    app.use("/auth", require("./routes/authRoutes"));
    app.use("/", require("./routes/userRoutes")(usersCollection));
    app.use("/", require("./routes/messageRoutes")(messagesCollection));
    app.use("/", require("./routes/scheduleRoutes")(scheduleCollection));
    app.use("/", require("./routes/paymentRoutes")(paymentCollection));
    app.use("/api", require("./routes/tokenRoutes"));

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "meevio55@gmail.com", // Your Gmail or business email
        pass: "emyxfmrxgycbctyx",
      },
    });

    app.post("/send-email", async (req, res) => {
      const { email, subject, message } = req.body;
      try {
        await transporter.sendMail({
          from: "meevio55@gmail.com",
          to: email,
          subject,
          text: message,
        });
        res.status(200).send("Email sent successfully!");
      } catch (error) {
        console.error(error);
        res.status(500).send("Failed to send email.");
      }
    });

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

run();
