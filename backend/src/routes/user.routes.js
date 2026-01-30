// src/routes/user.routes.js
const UserController = require("../controllers/user.controller");

let userController = null;

function getController(db) {
  if (!db) {
    throw new Error("Database instance not provided to user routes");
  }

  if (!userController) {
    userController = new UserController(db);
  }

  return userController;
}

async function deleteAccount(req, res, db) {
  try {
    return await getController(db).deleteAccount(req, res);
  } catch (err) {
    console.error("Delete account error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to delete account" }));
  }
}

async function forgetPassword(req, res, db) {
  try {
    return await getController(db).forgetPassword(req, res);
  } catch (err) {
    console.error("Forget password error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to request password reset" }));
  }
}

module.exports = {
  deleteAccount,
  forgetPassword
};
