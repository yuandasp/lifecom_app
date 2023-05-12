const { db, query } = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      console.log(req.body);
    } catch (error) {
      return res.status(error.status || 400).send("error");
    }
  },
  login: async (req, res) => {
    try {
      console.log(req.body);
    } catch (error) {
      return res.status(error.status || 400).send("error");
    }
  },
};
