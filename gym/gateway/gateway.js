const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3002;
const AUTH_SERVICE_URL = "http://localhost:3000";
const EXAMPLE_SERVICE_URL = "http://localhost:3001";

app.use(bodyParser.json());

// Route to authenticate and get a token
app.post("/login", async (req, res) => {
  try {
    const authResponse = await axios.post(
      `${AUTH_SERVICE_URL}/login`,
      req.body
    );
    const token = authResponse.data.token;

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
});

// Route to access the protected resource
app.get("/resource", async (req, res) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(401);

  try {
    // Forward the request to the example service
    const exampleResponse = await axios.get(`${EXAMPLE_SERVICE_URL}/resource`, {
      headers: { Authorization: token },
    });

    res.json(exampleResponse.data);
  } catch (error) {
    res.status(403).json({ error: "Authorization failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
