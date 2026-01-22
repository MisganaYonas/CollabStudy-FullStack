const User = require("../models/User.model");
const { hashPassword, comparePassword } = require("../utils/hash");

const signup = async (req, res, body) => {
  const { email, username, password } = body;

  if (!email.endsWith("@vrl.edu")) {
    res.writeHead(400);
    return res.end(JSON.stringify({ error: "Institutional email required" }));
  }

  const hashed = await hashPassword(password);
  const user = new User({ email, username, password: hashed });
  await user.save();

  res.end(JSON.stringify({ message: "Signup successful" }));
};

module.exports = { signup };
