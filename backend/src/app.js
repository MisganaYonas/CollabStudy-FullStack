const http = require("http");
const { parse } = require("url");

const PORT = 5000;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = parse(req.url, true);

  const getBody = () =>
    new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => resolve(JSON.parse(body || "{}")));
    });

  if (req.method === "GET" && parsedUrl.pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Backend running" }));
  }

  const validateEmail = require("./utils/validateEmail");

if (req.method === "POST" && parsedUrl.pathname === "/api/signup") {
  const body = await getBody();
  const { name, email, password } = body;

  if (!validateEmail(email)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Invalid institutional email" }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify({
    message: "Signup successful",
    user: { name, email }
  }));
}


  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

