const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Load database from db.json
let database = JSON.parse(fs.readFileSync("db.json"));

// API routes
app.get("/users", (req, res) => res.json(database.users));
app.get("/developers", (req, res) => res.json(database.developers));
app.get("/blogs", (req, res) => res.json(database.blogs));
app.get("/comments", (req, res) => res.json(database.comments));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
