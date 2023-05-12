const { db, query } = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../helpers/nodemailer");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const getUserQuery = `SELECT * FROM user WHERE email=${db.escape(
        email
      )} OR username=${db.escape(username)}`;
      const isUserExist = await query(getUserQuery);

      if (isUserExist.length > 0 && isUserExist[0].email === email) {
        return res.status(400).send({ message: "Email has been used" });
      } else if (
        isUserExist.length > 0 &&
        isUserExist[0].username === username
      ) {
        return res.status(400).send({ message: "Username has been used" });
      }

      var validateEmailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      var validatePassRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

      if (!email.match(validateEmailRegex)) {
        return res.status(400).send({ message: "Invalid format email!" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .send({ message: "Password too short, minimal 8 characters" });
      }

      if (!password.match(validatePassRegex)) {
        return res.status(400).send({
          message:
            "Password must contain lowercase, uppercase, number, and symbol",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const addUserQuery = `INSERT INTO user VALUES (null, ${db.escape(
        username
      )}, ${db.escape(email)}, ${db.escape(
        hashPassword
      )}, null, null, null, false)`;

      const addUser = await query(addUserQuery);

      let payload = { id: addUser.insertId, verifiedAttempt: 1 };
      const token = jwt.sign(payload, "joe", { expiresIn: "4h" });

      let mail = {
        from: `Admin <yuanhar123@gmail.com>`,
        to: `${email}`,
        subject: `Please verified your account!`,
        html: `
        <div>
        <p>Thanks for register, you need to activate your account,</p>
        <a href="http://localhost:2000/verification/${token}">Click here</a>
        <span>to activate</span>
        </div>`,
      };

      let response = await nodemailer.sendMail(mail);

      return res.status(200).send({
        data: addUser,
        message: "Success register! Please verify your email",
      });
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
  login: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      console.log(req.body);

      const getUserQuery = `SELECT * FROM user WHERE email=${db.escape(
        email
      )} OR username=${db.escape(username)}`;

      const isUserExist = await query(getUserQuery);
      if (isUserExist.length === 0) {
        return res
          .status(400)
          .send({ message: "Email/username or password is invalid" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        isUserExist[0].password
      );
      if (!isPasswordValid) {
        return res
          .status(400)
          .send({ message: "Email/username or password is invalid" });
      }

      let payload = {
        id: isUserExist[0].id_user,
      };

      const token = jwt.sign(payload, "joe", { expiresIn: "4h" });

      return res.status(200).send({
        message: "Login success",
        token,
        data: {
          id_user: isUserExist[0].id_user,
          username: isUserExist[0].username,
          email: isUserExist[0].email,
        },
      });
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
  verification: async (req, res) => {
    try {
      console.log("AAA>>>", req.user);
      const id = req.user.id;

      let userDetailQuery = `SELECT * FROM user WHERE id_user=${db.escape(id)}`;
      let userDetail = await query(userDetailQuery);
      console.log("BBBB>", userDetail);

      if (userDetail.length > 0) {
        if (req.user.verifiedAttempt === userDetail[0].verified_attempt) {
          // let userActiveQuery = `UPDATE user SET is_verified=true WHERE id_user=${db.escape(
          //   id
          // )}`;
          // let userActive = await query(userActiveQuery);
          res
            .status(200)
            .send({ success: true, message: "Account is verified" });
        } else {
          res.status(400).send({
            success: true,
            message: "Token sudah tidak berlaku, silakan resend verification",
          });
        }
      } else {
        res
          .status(400)
          .send({ success: true, message: "User tidak ditemukan" });
      }
    } catch (error) {
      return res.staus(error.status || 400).send(error);
    }
  },
  resetPassword: async (req, res) => {
    try {
    } catch (error) {
      return res.staus(error.status || 400).send(error);
    }
  },
};
