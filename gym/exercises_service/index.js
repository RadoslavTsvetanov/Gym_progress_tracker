const express = require("express");
const bodyParser = require("body-parser");
const { DB } = require("./exercises_repo"); // Replace with the correct path

const app = express();
const db = new DB();

app.use(bodyParser.json());

// Initialize database connection

// Routes using the DB class methods
app.get("/", (req, res) => {
  res.json();
});

app.post("/exercises/add_program", async (req, res) => {
  const { username, program } = req.body;
  try {
    const new_program = await db.add_program_to_user(username, program);
    res.json({
      success: "Exercises created successfully",
      new_program,
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating exercises" });
  }
});

app.get("/exercises/get_program", async (req, res) => {
  const username = req.query.username;
  try {
    const exercises = await db.get_user_exercises(username);
    res.json({ exercises });
  } catch (error) {
    res.status(500).json({ error: "Error fetching exercises" });
  }
});

app.post("/exercises/add_new_workout", async (req, res) => {
  const { username, workout } = req.body;
  try {
    const newWorkout = await db.add_user_workout(workout, username);
    res.json({ success: "Workout added successfully", newWorkout });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding workout" });
  }
});

app.get("/exercises/get_progression", async (req, res) => {
  const { username } = req.query;
  try {
    const progression = await db.get_user_growth(username);
    res.json({ progression });
  } catch (error) {
    res.status(500).json({ error: "Error fetching progression" });
  }
});
app.post("/exercises/create_user", async (req, res) => {
  const { username, program } = req.body;

  try {
    const newUser = await db.create_user(username, program);
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error });
  }
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
