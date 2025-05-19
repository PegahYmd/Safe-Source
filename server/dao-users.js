"use strict";
/* Data Access Object (DAO) module for accessing users */

const sqlite = require("sqlite3");
const crypto = require("crypto");

// open the database
const db = new sqlite.Database("CMS_users.db", (err) => {
  if (err) throw err;
});

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Users WHERE IdUser = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "User not found." });
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        const user = {
          id: row.IdUser,
          name: row.Name,
          level: row.Level,
          username: row.Email,
        };
        const sql2 = "SELECT * FROM Likes WHERE IdUser = ?";
        db.all(sql2, [user.id], (err, rows) => {
          if (err) {
            reject(err);
          } else if (rows === undefined) {
            resolve(false);
          } else {
            user.Likes = rows
              .filter((l) => {
                return l.IsLike === 1;
              })
              .map((l) => {
                return l.IdPage;
              });
            user.Dislikes = rows
              .filter((l) => {
                return l.IsLike === 0;
              })
              .map((l) => {
                return l.IdPage;
              });
            console.log("GETUSER");
            console.log(user);
          }
        });
        resolve(user);
      }
    });
  });
};

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Users, Likes WHERE Email = ? AND Likes.IdUser = Users.IdUser GROUP BY Users.IdUser";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        console.log(row);
        const user = {
          id: row.IdUser,
          name: row.Name,
          level: row.Level,
          username: row.Email,
        };
        const sql2 = "SELECT * FROM Likes WHERE IdUser = ?";
        db.all(sql2, [user.id], (err, rows) => {
          if (err) {
            reject(err);
          } else if (rows === undefined) {
            resolve(false);
          } else {
            user.Likes = rows
              .filter((l) => {
                return l.IsLike === 1;
              })
              .map((l) => {
                return l.IdPage;
              });
            user.Dislikes = rows
              .filter((l) => {
                return l.IsLike === 0;
              })
              .map((l) => {
                return l.IdPage;
              });
            console.log("GETUSER");
            console.log(user);
          }
        });

        const salt = row.Salt;
        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
          if (err) reject(err);

          const passwordHex = Buffer.from(row.Password, "hex");

          if (!crypto.timingSafeEqual(passwordHex, hashedPassword))
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};
