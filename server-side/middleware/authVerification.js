const jwt = require("jsonwebtoken");
const { db, query } = require("../database");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(400).send({ message: "Access Denied" });
  }

  token = token.split(" ")[1];
  if (token == "null" || !token) {
    return res.status(400).send({ message: "Access Denied" });
  }

  let verifiedUser = jwt.verify(token, process.env.JWT_KEY);
  if (!verifiedUser) {
    return res.status(400).send({ message: "Access Denied" });
  }

  req.user = verifiedUser;
  next();
};

const verifyContent = async (req, res, next) => {
  try {
    const idContent = req.params.id;
    const idUser = req.user.id;

    const getIdContentQuery = `SELECT * FROM content WHERE id_content = ${idContent};`;
    const getIdUserFromContent = await query(getIdContentQuery);
    const idUserFromContent = getIdUserFromContent[0].id_user;

    if (idUser !== idUserFromContent) {
      return res.status(400).send({ message: "Access Denied" });
    }

    next();
  } catch (error) {
    return res.status(error.status || 500).send(error);
  }
};

module.exports = { verifyToken, verifyContent };
