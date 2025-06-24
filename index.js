const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 9090;
const users_FILE = "./users.json";

app.use(cors());
app.use(bodyParser.json());

// 🔁 Read JSON file
function readusers() {
  const data = fs.readFileSync(users_FILE, "utf-8");
  return JSON.parse(data);
}

// 💾 Write JSON file
function writeusers(data) {
  fs.writeFileSync(users_FILE, JSON.stringify(data, null, 2));
}

// 📄 GET all users
app.get("/users", (req, res) => {
  try {
    const users = readusers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to read users" });
  }
});

// ➕ Add new mission
app.post("/users", (req, res) => {
  const users = readusers();
  const newMission = {
    ...req.body,
    id: Date.now(),
  };
  users.push(newMission);
  writeusers(users);
  res.json(newMission);
});

// 🗑 Delete mission
app.delete("/users/:id", (req, res) => {
  const users = readusers();
  const filtered = users.filter((m) => m.id != req.params.id);
  writeusers(filtered);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
