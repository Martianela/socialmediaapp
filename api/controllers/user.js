import Jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const getUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q = `SELECT * FROM users WHERE id=?`;
    const id = req.params.userId;
    db.query(q, [id], (err, data) => {
      if (err) return res.status(500).json(err);
      const { password, ...info } = data[0];
      return res.status(200).json(info);
    });
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q = `UPDATE users SET name=?, city=? ,website=? ,profilePic=? ,coverPic=? WHERE id=?`;
    console.log(req.body);
    //console.log(q);
    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],

      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.status(200).json(data);
        else return res.status(403).json("you can update only your id");
      }
    );
  });
};
