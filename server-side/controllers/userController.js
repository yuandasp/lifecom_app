const { db, query } = require("../database");

module.exports = {
  getDataUser: async (req, res) => {
    try {
      const idParams = parseInt(req.params.id);

      if (req.user.id !== idParams) {
        return res.status(400).send("Unauthorized attempt");
      }

      const getUserQuery = `SELECT * FROM user WHERE id_user = ${db.escape(
        idParams
      )}`;
      const getUser = await query(getUserQuery);
      return res.status(200).send(getUser);
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
  editDataUser: async (req, res) => {
    try {
      const idParams = req.params.id;

      let dataUpdate = [];
      let checkUsername = [];
      for (let prop in req.body) {
        if (prop == "username") {
          checkUsername.push(`${req.body[prop]}`);
        }
        if (prop !== "email") {
          dataUpdate.push(`${prop} = ${db.escape(req.body[prop])}`);
        }
      }

      const findUsernameQuery = `SELECT * FROM user WHERE username=${db.escape(
        checkUsername[0]
      )}`;
      const isUsernameExist = await query(findUsernameQuery);
      if (isUsernameExist.length > 0) {
        return res.status(400).send({ message: "Username has been used" });
      }

      const editUserQuery = `UPDATE user SET ${dataUpdate} WHERE id_user=${idParams}`;

      const editUser = await query(editUserQuery);

      const getUserQuery = `SELECT * FROM user WHERE id_user = ${db.escape(
        idParams
      )}`;
      const getUser = await query(getUserQuery);
      return res.status(200).send(getUser);
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
};
