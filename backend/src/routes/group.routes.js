const Group = require("../models/Group.model");

async function createGroup(req, res, body) {
  const { name, subject, description, maxMembers, preferredTime, members } = body;

  if (!name || !subject || !description || !maxMembers) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Missing required fields" }));
  }

  try {
    const group = new Group({
      name,
      subject,
      description,
      maxMembers,
      preferredTime,
      members,
    });
    await group.save();
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Group created", groupId: group._id }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Failed to create group" }));
  }
}

module.exports = { createGroup };
