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
      )}, null, null, null, false, 1)`;

      const addUser = await query(addUserQuery);

      let payload = { id: addUser.insertId, verifiedAttempt: 1 };
      const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "4h" });

      let mail = {
        from: `Admin <yuanhar123@gmail.com>`,
        to: `${email}`,
        subject: `Please verified your account!`,
        html: `
        <div>
        <p>Thanks for register, you need to activate your account,</p>
        <a href="${process.env.LINK_VERIFICATION}${token}">Click here</a>
        <span>to activate</span>
        </div>`,
      };

      let response = await nodemailer.sendMail(mail);

      return res.status(200).send({
        data: addUser,
        message: "Success register! Please verify your email",
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send(error);
    }
  },
  login: async (req, res) => {
    try {
      const { input, password } = req.body;

      const getUserQuery = `SELECT * FROM user WHERE email=${db.escape(
        input
      )} OR username=${db.escape(input)}`;

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

      const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "4h" });

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
      return res.status(error.status || 500).send(error);
    }
  },
  verification: async (req, res) => {
    try {
      console.log("AAA>>>", req.user);
      const id = req.user.id;

      let userDetailQuery = `SELECT * FROM user WHERE id_user=${db.escape(id)}`;
      let userDetail = await query(userDetailQuery);
      console.log("BBBB>", userDetail);

      if (userDetail.length === 0) {
        return res
          .status(400)
          .send({ success: true, message: "User tidak ditemukan" });
      }

      if (req.user.verifiedAttempt === userDetail[0].verified_attempt) {
        let userActiveQuery = `UPDATE user SET is_verified=true WHERE id_user=${db.escape(
          id
        )}`;
        let userActive = await query(userActiveQuery);
        res.status(200).send({ success: true, message: "Account is verified" });
      } else {
        res.status(400).send({
          success: true,
          message: "Token sudah tidak berlaku, silakan resend verification",
        });
      }
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  resendVerification: async (req, res) => {
    try {
      const idUser = req.user.id;

      const userQuery = `SELECT * FROM user WHERE id_user = ${idUser};`;
      const users = await query(userQuery);

      if (users.length === 0) {
        // res send user tidak ditemukan
      }

      const editVerifiedAttemptQuery = `UPDATE user SET verified_attempt= ${
        users[0].verified_attempt + 1
      }  WHERE id_user=${idUser};`;

      const editVerifiedAttempt = await query(editVerifiedAttemptQuery);

      let payload = {
        id: idUser,
        verifiedAttempt: users[0].verified_attempt + 1,
      };
      const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "4h" });

      let mail = {
        from: `Admin <yuanhar123@gmail.com>`,
        to: `${users[0].email}`,
        subject: `Please verified your account!`,
        html: `
        <div>
        <p>Thanks for register, you need to activate your account,</p>
        <a href="${process.env.LINK_VERIFICATION}${token}">Click here</a>
        <span>to activate</span>
        </div>`,
      };

      let response = await nodemailer.sendMail(mail);

      return res.status(200).send({
        message: "Success send verification link! Please verify your email",
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send(error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const getUserQuery = `SELECT * FROM user WHERE email= ${db.escape(
        email
      )};`;
      const getUser = await query(getUserQuery);

      let payload = { id: getUser[0].id_user };
      const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "4h" });

      let mail = {
        from: `Admin <yuanhar123@gmail.com>`,
        to: `${email}`,
        subject: `Reset password!`,
        html: `
        <div>
        <p>Click link below to reset your password</p>
        <a href="${process.env.LINK_RESET_PASSWORD}${token}">Reset Password</a>
        </div>`,
      };

      let response = await nodemailer.sendMail(mail);
      return res
        .status(200)
        .send({ message: "Link reset password has been sent!" });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const { password } = req.body;
      const idUser = req.user.id;

      const getUserQuery = `SELECT * FROM user WHERE id_user=${idUser}`;
      const isUserExist = await query(getUserQuery);

      if (isUserExist.length == 0) {
        return res.status(400).send({ message: "User not found" });
      }

      var validatePassRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

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

      const changePasswordQuery = `UPDATE user SET password=${db.escape(
        hashPassword
      )} WHERE id_user=${idUser};`;
      const changePassword = await query(changePasswordQuery);

      return res.status(200).send({ message: "success change your password" });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send(error);
    }
  },
};
