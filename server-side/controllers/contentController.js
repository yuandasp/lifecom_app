const { db, query } = require("../database");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  createContent: async (req, res) => {
    try {
      const idUser = req.user.id;
      const { file } = req;
      const filepath = file ? "/" + file.filename : null;
      const { caption } = req.body;
      const date = Math.floor(new Date().getTime() / 1000);
      const uuid = uuidv4();

      const addContentQuery = `INSERT INTO content VALUES (null, ${db.escape(
        filepath
      )}, ${db.escape(caption)}, ${db.escape(date)}, ${db.escape(
        idUser
      )}, ${db.escape(uuid)})`;

      const newContent = await query(addContentQuery);

      const getContentQuery = `SELECT * FROM content WHERE id_user=${idUser}`;
      const getContent = await query(getContentQuery);

      return res.status(200).send(getContent);
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).send(error);
    }
  },
  editContent: async (req, res) => {
    try {
      const idParams = req.params.id;
      const idUser = req.user.id;

      let captionUpdate = [];
      for (let prop in req.body) {
        if (prop == "caption") {
          captionUpdate.push(`${prop} = ${db.escape(req.body[prop])}`);
        }
      }

      const editCaptionQuery = `UPDATE content SET ${captionUpdate} WHERE id_content=${idParams}`;

      const editCaption = await query(editCaptionQuery);

      const getContentQuery = `SELECT * FROM content WHERE id_user = ${db.escape(
        idUser
      )}`;
      const getContent = await query(getContentQuery);

      return res.status(200).send(getContent);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  deleteContent: async (req, res) => {
    try {
      const idUser = req.user.id;
      const idParams = req.params.id;

      const deleteContentQuery = `DELETE FROM content WHERE id_content =${db.escape(
        idParams
      )}`;
      const deleteContent = await query(deleteContentQuery);

      const getContentQuery = `SELECT * FROM content WHERE id_user = ${idUser}`;
      const getContent = await query(getContentQuery);

      return res.status(200).send(getContent);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  getAllContent: async (req, res) => {
    try {
      const getAllContentQuery = `with cte_likes as (
        select id_content, count(*) as total_likes
        from user_content
        group by id_content
        )
      select c.id_content, 
        c.media,
        c.uuid,
        c.caption,
        u.username,
        u.fullname,
        u.profile_picture,
        coalesce(l.total_likes, 0) as likes
      from content c
      left join cte_likes l
      on c.id_content = l.id_content
      left join user u
      on c.id_user = u.id_user;`;
      const getAllContent = await query(getAllContentQuery);

      return res.status(200).send(getAllContent);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  getContentDetail: async (req, res) => {
    try {
      const idParams = req.params.uuid;

      const getDetailContentQuery = `with cte_likes as (
        select id_content, count(*) as total_likes
        from user_content
        group by id_content
      )
      select c.id_content, 
        c.media,
        c.caption,
        u.id_user,
        u.username,
        u.fullname,
        u.profile_picture,
        u.bio,
        coalesce(l.total_likes, 0) as likes
      from content c
      left join cte_likes l
      on c.id_content = l.id_content
      left join user u
      on c.id_user = u.id_user
      where c.uuid = ${db.escape(idParams)};`;
      const getDetailContent = await query(getDetailContentQuery);

      return res.status(200).send(getDetailContent);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  likesFeature: async (req, res) => {
    try {
      const idContent = req.params.id;
      const idUser = req.user.id;

      const checkAlreadyLikeQuery = `SELECT * FROM user_content WHERE id_user=${idUser} AND id_content=${idContent};`;
      const checkAlreadyLike = await query(checkAlreadyLikeQuery);

      if (checkAlreadyLike.length > 0) {
        const deleteLikesQuery = `DELETE FROM user_content WHERE id_content=${idContent} AND id_user=${idUser};`;
        const deleteLikes = await query(deleteLikesQuery);
      } else {
        const addLikesQuery = `INSERT INTO user_content VALUES (null, ${idContent}, ${idUser});`;
        const addLikes = await query(addLikesQuery);
      }

      const getAllContentQuery = `with cte_likes as (
        select id_content, count(*) as total_likes
        from user_content
        group by id_content
        )
      select c.id_content, 
        c.media,
        c.caption,
        u.username,
        u.fullname,
        u.profile_picture,
        coalesce(l.total_likes, 0) as likes
      from content c
      left join cte_likes l
      on c.id_content = l.id_content
      left join user u
      on c.id_user = u.id_user;`;
      const getAllContent = await query(getAllContentQuery);

      return res.status(200).send(getAllContent);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  getLikes: async (req, res) => {
    try {
      const idContent = req.params.id;

      const countLikesQuery = `SELECT * FROM user_content WHERE id_content=${idContent}`;
      const countLikes = await query(countLikesQuery);

      return res.status(200).send(countLikes);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
  getAllContentByIdUser: async (req, res) => {
    try {
      const idUser = req.user.id;
      const getAllContentByIdQuery = `SELECT * FROM content WHERE id_user=${idUser};`;
      const getAllContentById = await query(getAllContentByIdQuery);

      return res.status(200).send(getAllContentById);
    } catch (error) {
      return res.status(error.status || 500).send(error);
    }
  },
};
