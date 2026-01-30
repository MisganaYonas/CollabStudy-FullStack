const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

let db = null;

async function connectDB() {
  try {
    if (!db) {
      await client.connect();
      db = client.db();
      console.log("MongoDB connected successfully");
    }
    return db;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

let dbInstance = null;

async function initDB() {
  if (!dbInstance) {
    dbInstance = await connectDB();
  }
  return dbInstance;
}

module.exports = { connectDB, getDB, initDB };

