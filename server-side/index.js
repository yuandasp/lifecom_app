const express = require("express");
require("dotenv").config();
const PORT = 2000;
const app = express();
const cors = require("cors");
const { authRoutes } = require("./routes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
