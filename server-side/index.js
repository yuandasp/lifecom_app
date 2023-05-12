const express = require("express");
require("dotenv").config();
const PORT = 2000;
const app = express();
const cors = require("cors");
const { authRoutes, userRoutes, contentRoutes } = require("./routes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/c", contentRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
