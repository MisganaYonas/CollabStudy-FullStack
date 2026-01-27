async function aiAssist(req, res, body) {
  const { question } = body;
  const answer = `This is a mock response to: "${question}"`;

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ answer }));
}

module.exports = { aiAssist };
