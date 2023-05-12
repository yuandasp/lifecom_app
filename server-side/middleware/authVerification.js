const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log(req.user);
  let token = req.headers.authorization;

  if (!token) {
    return res.status(400).send("Access Denied");
  }

  token = token.split(" ")[1];
  if (token == "null" || !token) {
    return res.status(400).send("Access Denied");
  }

  let verifiedUser = jwt.verify(token, "joe");
  if (!verifiedUser) {
    return res.status(400).send("Access Denied");
  }

  req.user = verifiedUser;
  next();
};

module.exports = { verifyToken };
