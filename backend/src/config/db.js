// src/config/db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

let db = null; // the DB instance

/**
 * Connect to MongoDB
 * Returns the DB instance
 */
async function connectDB() {
  if (db) return db; // return if already connected

  try {
    await client.connect();
    db = client.db();
    console.log("MongoDB connected successfully");
    return db;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

/**
 * Get the DB instance if already connected
 */
function getDB() {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

/**
 * Initialize DB connection once
 */
let dbInstance = null;
async function initDB() {
  if (!dbInstance) {
    dbInstance = await connectDB();
  }
  return dbInstance;
}

module.exports = {
  connectDB,
  getDB,
  initDB
};
