const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const app = express();
app.use(cors());
app.use(express.json()); // Allows handling JSON requests

app.get("/", (req, res) => {
  res.send("Hello, Backend Server!");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
