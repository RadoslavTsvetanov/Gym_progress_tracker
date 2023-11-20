const express = require("express");
const { DB } = require("./notify_repo");

const app = express();
const port = 3008;
const db = new DB();

app.use(express.json()); // Middleware to parse JSON requests

app.get("/notifications/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const notifications = await db.get_all_notifications_by_username(username);
    res.json({ notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error retrieving notifications" });
  }
});

app.post("/change_email_notifications", async (req, res) => {
  const { username, state } = req.body;

  try {
    const updatedUser = await db.change_user_email_notifications_state(
      username,
      state
    );
    res.json({
      message: "User email notifications state updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/subscribe_notifications", async (req, res) => {
  const { username, email, get_email_notifications } = req.body;

  try {
    const newUser = await db.subscribe_user_to_notifications(
      username,
      email,
      get_email_notifications
    );
    res.json({ message: "User subscribed to notifications", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error subscribing user to notifications" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
