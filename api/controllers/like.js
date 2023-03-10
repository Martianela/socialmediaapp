import { db } from "../connect.js";
import Jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT user_id  FROM likes  WHERE post_id=?  ";
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.user_id));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q = "INSERT INTO likes (`user_id`,`post_id`) VALUES (?)";
    const values = [userInfo.id, req.body.postId];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("likes has been created ");
    });
  });
};
export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q = "DELETE FROM likes WHERE user_id=? AND post_id =?";
    const values = [userInfo.id, req.query.postId];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("comment has been created ");
    });
  });
};
