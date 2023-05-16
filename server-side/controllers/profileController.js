const { db, query } = require("../database");

module.exports = {
  getDataUser: async (req, res) => {
    try {
      const idUser = req.user.id;

      const getUserQuery = `SELECT * FROM user WHERE id_user = ${db.escape(
        idUser
      )}`;
      const getUser = await query(getUserQuery);
      return res.status(200).send(getUser);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  editDataUser: async (req, res) => {
    try {
      const idUser = req.user.id;

      let dataUpdate = [];
      for (let prop in req.body) {
        // email tidak bisa diganti
        if (prop !== "email") {
          dataUpdate.push(`${prop} = ${db.escape(req.body[prop])}`);
        }
      }

      if (req.body.username) {
        const findUsernameQuery = `SELECT * FROM user WHERE username=${db.escape(
          req.body.username
        )}`;
        const isUsernameExist = await query(findUsernameQuery);
        if (isUsernameExist.length > 0) {
          return res.status(400).send({ message: "Username has been used" });
        }
      }

      const editUserQuery = `UPDATE user SET ${dataUpdate} WHERE id_user=${idUser}`;

      const editUser = await query(editUserQuery);

      const getUserQuery = `SELECT * FROM user WHERE id_user = ${db.escape(
        idUser
      )}`;
      const getUser = await query(getUserQuery);

      return res.status(200).send(getUser);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  uploadProfilePicture: async (req, res) => {
    try {
      const { file } = req;
      const idUser = req.user.id;
      const filepath = file ? "/" + file.filename : null;
      let response = await query(
        `UPDATE user SET profile_picture=${db.escape(
          filepath
        )} WHERE id_user=${db.escape(idUser)}`
      );
      console.log(response);
      // res.status(200).send({ filepath });
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
};
