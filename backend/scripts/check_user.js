const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "../.env" });

async function checkUser() {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/collabstudy";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db();
        const headers_email = "student.UGR-1600-16@aau.edu.et";

        // Check for the specific email seen in screenshot
        const user = await db.collection("users").findOne({ email: headers_email });

        if (user) {
            console.log("User found:");
            console.log(JSON.stringify(user, null, 2));
        } else {
            console.log("User not found with email:", headers_email);
            // List all users to see what's there
            const allUsers = await db.collection("users").find().toArray();
            console.log("All users:", JSON.stringify(allUsers, null, 2));
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

checkUser();
