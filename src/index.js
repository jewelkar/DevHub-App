const express = require("express");
const cors = require("cors");

const app = express(); // Initialize Express app

const PORT = process.env.PORT || 3001; // Define port

app.use(cors());
app.use(express.json()); // Allows handling JSON requests

app.get("/", (req, res) => {
  res.send("Hello, Backend Server!");
});

// Start server only once
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
