import bcrypt from "bcryptjs/dist/bcrypt.js";
import jwt from "jsonwebtoken";
import { db } from "../connect.js";

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE user_name = ?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    console.log("no error");
    if (data.length === 0) {
      return res.status(500).json({
        message: "user does not exist ",
      });
    }
    const checkPass = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkPass) {
      return res.status(400).json({
        message: "please enter right password",
      });
    }
    console.log("password check completed");
    const { password, ...others } = data[0];
    console.log("token has been created");
    const token = jwt.sign({ id: data[0].id }, "secrateKey");
    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json(others);
  });
};

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE   user_name=?";
  db.query(q, [req.body.username], (err, data) => {
    if (err) {
      res.status(500);
      return res.json({
        message: err,
      });
    }
    console.log(data);
    if (data.length) return res.status(409).json("user already exist");

    //hashing password
    const salt = bcrypt?.genSaltSync(10);
    const hashPassword = bcrypt?.hashSync(req.body.password, salt);
    const q = "INSERT INTO users (user_name,email,password,name) VALUES(?)";
    const values = [
      req.body.username,
      req.body.email,
      hashPassword,
      req.body.name,
    ];
    db.query(q, [values], (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json("user has been created");
    });
  });
};

export const logout = (req, res) => {
  try {
    return res
      .clearCookie("accessToken", { secure: true, sameSite: "none" })
      .status(200)
      .json("user has been logged out");
  } catch (error) {
    res.json(err);
  }
};
