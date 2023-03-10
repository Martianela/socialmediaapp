import { db } from "../connect.js";
import Jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  const userId = req.query.userId;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q =
      userId !== "undefined"
        ? `SELECT p.*,u.id AS userId ,name,profilePic FROM posts AS p JOIN users AS u ON (p.user_id=u.id) WHERE p.user_id =?`
        : `SELECT p.*, u.id AS userId , name , profilePic  FROM posts AS p JOIN users as u ON (u.id=p.user_id) LEFT JOIN relationships As r ON (p.user_id=r.followedUserId) WHERE r.followerUserId=? OR p.user_id=? 
    ORDER BY p.createdAt DESC `;
    // console.log("userId", userId);
    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      // console.log(data);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q =
      " INSERT INTO posts (`desc`, `img`,`createdAt`,`user_id` ) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("post has been created ");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q = " DELETE FROM posts where id=? AND user_id=?`";
    db.query(q, [req.prams.postId, userInfo?.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 1)
        return res.status(200).json("post has been created ");
      else return res.status(403).json("you can only delete your post");
    });
  });
};
