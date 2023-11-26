const mongoose = require("mongoose");
const db_name = "GYM";

const uri = `mongodb+srv://KURO:KURO@task-manager.8d8g6sk.mongodb.net/${db_name}?retryWrites=true&w=majority`;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

class DB {
  constructor() {}

  async check_for_user(username, password) {
    try {
      const user = await User.findOne({ username, password });

      return !!user; // Return true if the user is found, otherwise false
    } catch (error) {
      console.error("Error checking for user:", error);
      return false;
    }
  }

  async create_user(username, password) {
    try {
      console.log(username, password);
      const existingUser = await User.findOne({ username });
      console.log(existingUser);
      if (existingUser) {
        return { success: false, message: "Username already exists" };
      }

      const newUser = new User({ username, password });
      await newUser.save();

      return { success: true, message: "User created successfully" };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, message: "Error creating user" };
    }
  }
}

module.exports = {
  DB,
};
