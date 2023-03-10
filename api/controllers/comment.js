import moment from "moment";
import { db } from "../connect.js";
import Jwt from "jsonwebtoken";
export const getComments = (req, res) => {
  const q =
    "SELECT c.* ,u.id AS userId ,name,profilePic FROM comments AS c JOIN users AS u ON(u.id =c.user_id) WHERE c.post_id =? ORDER BY c.createdAt DESC";
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComments = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q =
      "INSERT INTO comments (`desc`,`createdAt`,`user_id`,`post_id`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("comment has been created ");
    });
  });
};
