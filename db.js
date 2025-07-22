const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(
  `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.mvhtan2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  {
    serverApi: ServerApiVersion.v1,
  }
);

let usersCollection, messagesCollection, scheduleCollection, paymentCollection;

async function connectMongo() {
  await client.connect();
  const db = client.db("Meevio");
  usersCollection = db.collection("users");
  messagesCollection = db.collection("messages");
  scheduleCollection = db.collection("schedule");
  paymentCollection = db.collection("payments");
  console.log("MongoDB connected");
}

module.exports = {
  connectMongo,
  get usersCollection() {
    return usersCollection;
  },
  get messagesCollection() {
    return messagesCollection;
  },
  get scheduleCollection() {
    return scheduleCollection;
  },
  get paymentCollection() {
    return paymentCollection;
  },
};
