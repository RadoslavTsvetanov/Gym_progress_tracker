const express = require("express");
const { DB } = require("./path/to/your/DB");

const app = express();
const port = 3008;

const db = new DB();

app.get("/notifications/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const notifications = await db.get_all_notifications_by_username(username);
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving notifications" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
