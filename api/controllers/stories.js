import { db } from "../connect.js";
import Jwt from "jsonwebtoken";

export const getStories = (req, res) => {
  const q =
    "SELECT s.img , u.name ,u.profilePic FROM stories AS s JOIN users AS u  ON (u.id=s.user_id)  ";
  db.query(q, [req.body.userId], (err, data) => {
    if (err) return res.status(500).json(err);
    // console.log(data);
    return res.status(200).json(data);
  });
};

export const addStories = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q =
      "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";
    const values = [userInfo.id, req.body.userId];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("followed sucessfully");
    });
  });
};
export const deleteStories = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");
  Jwt.verify(token, "secrateKey", (err, userInfo) => {
    if (err) return res.status(403).json("not a valid token");
    const q =
      "DELETE FROM relationships WHERE followedUserId=? AND followerUserId=? ";

    const values = [req.query.userId, userInfo.id];
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollow");
    });
  });
};
