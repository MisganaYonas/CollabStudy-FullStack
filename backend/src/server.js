const http = require("http");

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Backend is running" }));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
