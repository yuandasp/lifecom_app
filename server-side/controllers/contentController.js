const { db, query } = require("../database");

module.exports = {
  createContent: async (req, res) => {
    try {
      const { media, caption, created_date, number_of_likes, id_user } =
        req.body;

      const addContentQuery = `INSERT INTO content VALUES (null, ${db.escape(
        media
      )}, ${db.escape(caption)}, ${db.escape(created_date)}, ${db.escape(
        number_of_likes
      )}, ${db.escape(id_user)})`;

      const newContent = await query(addContentQuery);

      const getContentQuery = `SELECT * FROM content WHERE id_user=${id_user}`;
      const getContent = await query(getContentQuery);

      return res.status(200).send(getContent);
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
  editContent: async (req, res) => {
    try {
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
  deleteContent: async (req, res) => {
    try {
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
  getAllContent: async (req, res) => {
    try {
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
  getContentDetail: async (req, res) => {
    try {
    } catch (error) {
      return res.status(error.status || 400).send(error);
    }
  },
};
