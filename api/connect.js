import mysql from "mysql2";
export const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Jnv@2207",
    database: "social",
  },
  () => {
    try {
      console.log("conected to db");
    } catch (error) {
      console.log(error.message);
    }
  }
);
