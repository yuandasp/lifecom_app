const express = require("express");
require("dotenv").config();
const PORT = 2000;
const app = express();
const cors = require("cors");
const { authRoutes, profileRoutes, contentRoutes } = require("./routes");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/content", contentRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
