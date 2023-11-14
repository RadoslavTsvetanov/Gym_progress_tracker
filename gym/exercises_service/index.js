const express = require("express");
const app = express();

// Endpoint to retrieve exercises
app.get("/", (req, res) => {
  res.json();
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Run the server
const PORT = 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
