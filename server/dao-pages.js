/* Data Access Object (DAO) module for accessing Pages and Blocks*/
const sqlite = require("sqlite3");
const dayjs = require("dayjs");
const { Page, Block, User, Verify } = require("./PageModel");

// open the database
const db = new sqlite.Database("CMS_users.db", (err) => {
  if (err) throw err;
});

/** PAGES **/
// get all the pages
exports.listPages = (con) => {
  return new Promise((resolve, reject) => {
    //get today date
    let conditionSql = "";
    let orderSql = "";
    if (con != "-" && con != "&0&") {
      const resultArray = con.split("&");
      conditionSql +=
        resultArray[0] != ""
          ? " AND Pages.Title  LIKE " + "'%" + resultArray[0] + "%'"
          : "";
      conditionSql +=
        resultArray[1] != "" && resultArray[1] !== "0"
          ? " AND Categories.IdCategory=" + resultArray[1]
          : "";
      conditionSql +=
        resultArray[2] != ""
          ? " AND Pages.DatePublication=" + "'" + resultArray[2] + "'"
          : "";
      orderSql = resultArray.length > 3 ? "LikesSum," : "";
    }
    const today = dayjs().format("YYYY-MM-DD");
    const sql =
      "SELECT Pages.*, Users.*,Categories.Name as category, IFNULL(SUM(Likes.IsLike), 0) AS LikesSum FROM Pages, Categories JOIN Users ON Pages.IdAuthor = Users.IdUser LEFT JOIN Likes ON Pages.IdPage = Likes.IdPage WHERE Pages.IdAuthor = Users.IdUser AND Pages.category=Categories.IdCategory AND (DatePublication <= DATE(?) AND DatePublication NOT NULL)" +
      conditionSql +
      " GROUP BY Pages.IdPage ORDER BY " +
      orderSql +
      " DatePublication ASC";
    db.all(sql, [today], (err, rows) => {
      if (err) {
        reject(err);
      }
      if (rows === undefined || !Array.isArray(rows)) {
        reject(rows);
        return;
      }
      const pages = rows.map((p) => {
        return new Page(
          p.IdPage,
          p.Title,
          p.IdAuthor,
          p.DateCreation,
          p.DatePublication,
          p.Name,
          p.LikesSum,
          p.category
        );
      });
      resolve(pages);
    });
  });
};

exports.listAuthPages = (con) => {
  return new Promise((resolve, reject) => {
    let conditionSql = "";
    let orderSql = "";
    if (con != "-" && con != "&0&") {
      const resultArray = con.split("&");
      conditionSql +=
        resultArray[0] != ""
          ? " AND Pages.Title  LIKE " + "'%" + resultArray[0] + "%'"
          : "";
      conditionSql +=
        resultArray[1] != "" && resultArray[1] !== "0"
          ? " AND Categories.IdCategory=" + resultArray[1]
          : "";
      conditionSql +=
        resultArray[2] != ""
          ? " AND Pages.DatePublication=" + "'" + resultArray[2] + "'"
          : "";
      orderSql = resultArray.length > 3 ? "LikesSum," : "";
    }
    const sql =
      "SELECT Pages.*, Users.*,Categories.Name as category, IFNULL(SUM(Likes.IsLike), 0) AS LikesSum FROM Pages, Categories JOIN Users ON Pages.IdAuthor = Users.IdUser LEFT JOIN Likes ON Pages.IdPage = Likes.IdPage WHERE Pages.IdAuthor = Users.IdUser AND Pages.category=Categories.IdCategory " +
      conditionSql +
      " GROUP BY Pages.IdPage ORDER BY " +
      orderSql +
      " Pages.DatePublication ASC;";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      const pages = rows.map((p) => {
        return new Page(
          p.IdPage,
          p.Title,
          p.IdAuthor,
          p.DateCreation,
          p.DatePublication,
          p.Name,
          p.LikesSum,
          p.category
        );
      });
      console.log(pages);
      resolve(pages);
    });
  });
};

// get a page given its id
exports.getPageById = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT Pages.IdPage, Pages.Title, Pages.IdAuthor, Pages.DateCreation, Pages.DatePublication, Users.Name as Name, Categories.Name as category, Likes.LikesSum FROM Pages, Categories, Users, (SELECT count(*) as LikesSum FROM Likes WHERE Likes.IdPage = ? AND Likes.IsLike = 1) as Likes WHERE Pages.category = Categories.IdCategory AND Pages.IdAuthor = Users.IdUser AND Pages.IdPage = ?";
    db.get(sql, [id, id], (err, row) => {
      if (err) return reject(err);
      if (row == undefined) resolve({ error: "Page not found." });
      else {
        const page = Object.assign({}, row);
        resolve(page);
      }
    });
  });
};

// add a new page
exports.addPage = (page) => {
  return new Promise((resolve, reject) => {
    const today = dayjs().format("YYYY-MM-DD");
    const sql =
      "INSERT INTO Pages(Title, IdAuthor, DateCreation, DatePublication) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [page.Title, page.IdAuthor, today, page.DatePublication],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// delete a new page
exports.deletePage = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Pages WHERE IdPage=?";
    db.run(sql, [pageId], function (err) {
      if (err) {
        return reject(err);
      }
      if (this.changes !== 1) resolve({ error: "No Page deleted." });
      else resolve(null);
    });
  });
};

// update an existing page
exports.updatePage = (page, userId) => {
  //console.log('updatePage: '+JSON.stringify(page));
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Pages SET Title=?, IdAuthor=?, DatePublication=? WHERE IdPage = ?";
    // It is NECESSARY to check that the answer belongs to the userId
    db.run(
      sql,
      [page.Title, userId, page.DatePublication, page.IdPage],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes);
      }
    );
  });
};

/** BLOCKS **/

// get all the Blocks of a given page
exports.getAllBlocks = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Blocks WHERE IdPage = ? ORDER BY Position ASC";
    db.all(sql, [pageId], (err, rows) => {
      if (err) {
        return reject(err);
      }
      if (rows.length === undefined) resolve({ error: "Blocks not found." });
      else {
        const blocks = rows.map(
          (b) => new Block(b.IdBlock, b.IdPage, b.Type, b.Content, b.Position)
        );
        resolve(blocks);
      }
    });
  });
};

// add Like or dislike
exports.addLike = (like) => {
  console.log(like);
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO Likes(IdPage, IdUser, IsLike) VALUES (?, ?, ?)";
    db.run(sql, [like.IdPage, like.IdUser, like.IsLike], function (err) {
      if (err) {
        console.log(err);
        reject({ error: "A problem happened while adding the like." });
      } else resolve(this.lastID);
    });
  });
};
exports.deleteLike = ({ IdPage, IdUser }) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Likes WHERE IdUser=? AND IdPage=?";
    db.run(sql, [IdUser, IdPage], function (err) {
      if (err) {
        return reject(err);
      }
      console.log(IdPage, IdUser, this.changes);
      if (this.changes !== 1) resolve({ error: "No Like deleted." });
      else resolve(null);
    });
  });
};

// to verify
exports.getToVerify = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM ToVerify";
    db.all(sql, (err, rows) => {
      if (err) {
        return reject(err);
      }
      if (rows.length === 0) {
        resolve({ error: "Verify resources not found." });
      } else {
        const tover = rows.map(
          (b) => new Verify(b.Id, b.Link, b.Author, b.Title, b.Feedback)
        );
        resolve(tover);
      }
    });
  });
};

exports.getToVerifyById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM ToVerify WHERE Id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      if (row == undefined) resolve({ error: "Verify not found." });
      else {
        console.log(row);
        const page = Object.assign({}, row);
        resolve(page);
      }
    });
  });
};

// add a new verify
exports.addToVerify = ({ link, author, title, feedback }) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO ToVerify(Link, Author, Title, Feedback) VALUES (?, ?, ?, ?)";
    db.run(sql, [link, author, title, feedback], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

// add a new Block
exports.addBlock = (block, IdPage) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Blocks(IdPage, Type, Content, Position) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [IdPage, block.Type, block.Content, block.Position],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

// delete all blocks
exports.deleteBlocks = (pageId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Blocks WHERE IdPage=?";
    db.run(sql, [pageId], function (err) {
      if (err) {
        return reject(err);
      }
      if (this.changes < 1) resolve({ error: "No Blocks deleted." });
      else resolve(null);
    });
  });
};

/** IMAGES **/
exports.listImages = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT Name FROM Images";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      const names = rows.map((i) => {
        return i.Name;
      });
      resolve(names);
    });
  });
};

// USERS
exports.checkUserPrivileges = (pageId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Pages WHERE IdPage=? and IdAuthor=?";
    db.all(sql, [pageId, userId], (err, rows) => {
      if (err) {
        return reject(err);
      } else if (rows.length === 1) {
        resolve();
      } else {
        // page with that id was not found -> no privileges
        resolve({ error: "This user do not have enough privileges." });
      }
    });
  });
};

// AUTHORS
exports.getUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Users";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      const names = rows.map((a) => {
        return new User(a.IdUser, a.Name);
      });
      resolve(names);
    });
  });
};

// GET a site given its id
exports.getSiteById = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Site WHERE IdSite = ?";
    db.get(sql, [1], (err, row) => {
      if (err) return reject(err);
      if (row == undefined) resolve({ error: "Page not found." });
      else {
        const page = Object.assign({}, row);
        resolve(page);
      }
    });
  });
};

// UPDATE the site
exports.updateSite = (siteName) => {
  //console.log('updatePage: '+JSON.stringify(page));
  return new Promise((resolve, reject) => {
    const sql = "UPDATE Site SET Name=? WHERE IdSite = ?";
    // It is NECESSARY to check that the answer belongs to the userId
    db.run(sql, [siteName, 1], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.changes);
    });
  });
};
