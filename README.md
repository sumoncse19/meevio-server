# 🚀 Meevio Server: Backend for Secure Video Communication Platform

## 📊 Description

This is the **backend server** of the **Meevio** project, responsible for handling:

- User Authentication (Login, Registration, Token Management)
- Database operations (MongoDB CRUD operations)
- Real-time signaling for WebRTC connections using **Socket.IO**
- Managing chat data and user sessions securely

It acts as the bridge between the client app and server-side processes to ensure fast, secure, and stable communication.

---

## 🔧 Technologies Used

- **Node.js** and **Express.js** — For server-side application logic and REST APIs.
- **MongoDB** — For storing user info, messages, and room data.
- **Socket.IO** — For real-time communication (signaling and chat).
- **JWT (jsonwebtoken)** — For secure authentication and authorization.
- **dotenv** — For managing environment variables.
- **cookie-parser** — For handling cookies in authentication.
- **uuid** — For generating unique identifiers.
- **CORS** — To allow cross-origin resource sharing.

---

## 📦 Dependencies

```json
"dependencies": {
  "axios": "^1.8.4",
  "cookie-parser": "^1.4.7",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "express": "^4.21.2",
  "jsonwebtoken": "^9.0.2",
  "mongodb": "^6.14.2",
  "socket.io": "^4.8.1",
  "uuid": "^11.1.0"
}
```

---

## 🔗 Main Features

- JWT Based Authentication System
- WebSocket support for WebRTC signaling
- Secure cookie handling
- Environment-based configuration using `.env`
- Optimized CORS and Middleware setup
- Modular Controller and Route Structure

---

## 📥 How to Initialize (Server Setup)

Follow these steps to run the Meevio server locally:

### 1. Clone the Repository

```bash
git clone https://github.com/sumoncse19/meevio.git
```

### 2. Navigate to the Server Directory

```bash
cd meevio/SERVER
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create a `.env` File

Create a `.env` file in the `SERVER` folder and add the following environment variables:

```env
db_user="Original product credential here"
db_pass="Original product credential here"
jwt_Secret="Original product credential here"
HMS_TEMPLATE_ID="Original product credential here"
HMS_APP_SECRET="Original product credential here"
HMS_MANAGEMENT_TOKEN="Original product credential here"
APP_ACCESS_KEY="Original product credential here"
```

### 5. Start the Server

```bash
npm run start
```

Or if you want auto-reload during development (after installing `nodemon` globally):

```bash
nodemon index.js
```

---

## 👉 Live Links

- **📦 CLIENT Side**: [Meevio Server on GitHub](https://github.com/sumoncse19/meevio/tree/main/CLIENT)
- **🚀 Live Site**: [📞 Meevio](https://meevio.web.app/)

> Meevio Server ensures a fast, secure, and reliable backend to power your real-time communications for any use case.

---
