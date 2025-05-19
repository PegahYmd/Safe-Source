"use strict";

const express = require("express");
const dao_pages = require("./dao-pages");
const dao_users = require("./dao-users");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const { check, validationResult } = require("express-validator");
const passport = require("passport"); // auth middleware
const LocalStrategy = require("passport-local").Strategy; // username and password for login
const session = require("express-session"); // enable sessions

// init express
const app = new express();
const port = 3001;

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());
app.use(morgan("dev"));
const generalDelay = 100;

const corsOptions = {
  origin: "http://localhost:5173",
  optionSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(
  new LocalStrategy(function (username, password, done) {
    dao_users.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  dao_users
    .getUserById(id)
    .then((user) => {
      done(null, user); // this will be available in req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated" });
};

// set up the session
app.use(
  session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: "thisisasecretkey", //personalize this random string, should be a secret value
    resave: false,
    saveUninitialized: false,
  })
);

// then, init passport
app.use(passport.initialize());
app.use(passport.session());

// ROUTES

// GET all the pages
// app.get('/api/pages', (request, response) => {
//   dao_pages.listPages()
//   .then(pages => response.json(pages) )
//   .catch(() => response.status(500).end());
// });

// GET ALL THE PAGES
app.get("/api/pages/:search", async (req, res) => {
  if (req.isAuthenticated() && req.user.level === "Admin") {
    //query per admin
    console.log("Verifica completata: ADMIN");
    dao_pages
      .listAuthPages(req.params.search)
      .then((pages) => res.json(pages))
      .catch(() => res.status(500).end());
  } else if (req.isAuthenticated() && req.user.level === "User") {
    //query per User
    console.log("Verifica completata: USER");
    dao_pages
      .listAuthPages(req.params.search)
      .then((pages) => res.json(pages))
      .catch(() => res.status(500).end());
  } else {
    console.log("Verifica completata: GUEST");
    //normal user
    console.log(req.params.search);
    try {
      const result = await dao_pages.listPages(req.params.search);
      // res.json(result);
      if (result.error) res.status(404).json(result);
      else res.json(result);
    } catch (err) {
      res.status(500).end();
    }
    // dao_pages.listPages()
    //   .then({console.log(pages)
    //     pages => res.json(pages)})
    //   .catch(() => res.status(500).end());
  }
});

// GET a page given its id
app.get("/api/page/:pageId", async (req, res) => {
  try {
    const result = await dao_pages.getPageById(req.params.pageId);
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// POST aggiungere una nuova pagina ed i blocchi annessi
app.post(
  "/api/pages",
  isLoggedIn,
  [
    check("Title").notEmpty(),
    check("Blocks").custom((blocks) => {
      const hasHeader = blocks.some((item) => item.Type === "Header");
      const hasPhOrIm = blocks.some(
        (item) => item.Type === "Paragraph" || item.Type === "Image"
      );
      const result = hasHeader && hasPhOrIm;
      if (!result) {
        throw new Error(
          "The page MUST contain a header and at least one paragraph or one image"
        );
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // prepare the fields for db insert
    const page = {
      Title: req.body.Title,
      IdAuthor: req.user.id,
      DateCreation: req.body.DateCreation,
      DatePublication: req.body.DatePublication,
      Blocks: req.body.Blocks,
    };

    let pageId;

    console.log(page);
    try {
      // Return the newly created id of the question to the caller.
      // A more complex object can also be returned (e.g., the original one with the newly created id)
      pageId = await dao_pages.addPage(page);
    } catch (err) {
      console.log(err);
      return res.status(503).json({
        error: `Database error during the creation of Page ${page.Title} by ${page.IdAuthor}.`,
      });
    }

    const blockPromises = page.Blocks.map(async (block) => {
      try {
        // Inserimento dei blocchi relativi alla pagina
        const blockId = await dao_pages.addBlock(block, pageId);
        return blockId;
      } catch (err) {
        return res.status(503).json({
          error: `Database error during the creation of Block of position ${block.Position} in page ${pageId}.`,
        });
      }
    });

    try {
      const blockIds = await Promise.all(blockPromises);
      setTimeout(() => res.status(201).json(blockIds), generalDelay);
    } catch (err) {
      return res.status(503).json({ error: err.message });
    }
  }
);

// DELETE a page and all its blocks
app.delete(
  "/api/pages/:pageId",
  isLoggedIn,
  [check("pageId").isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.level === "User") {
      // the user is deleting its own page
      try {
        const resultPrivileges = await dao_pages.checkUserPrivileges(
          req.params.pageId,
          req.user.id
        );
        if (resultPrivileges != null) {
          res.status(503).json({
            error: "You do not have the privileges to update this page",
          });
        }
      } catch (err) {
        return res.status(503).json({
          error: `You are not allowed to delete the page: ${req.params.pageId}: ${err} `,
        });
      }
    }

    // blocks
    try {
      const resultBlocks = await dao_pages.deleteBlocks(req.params.pageId);
    } catch (err) {
      return res.status(503).json({
        error: `Database error during the deletion of Blocks at page ${req.params.pageId}: ${err} `,
      });
    }

    // pages
    try {
      const result = await dao_pages.deletePage(req.params.pageId);
      if (result == null) return res.status(200).json({});
      else return res.status(404).json(result);
    } catch (err) {
      return res.status(503).json({
        error: `Database error during the deletion of Page ${req.params.pageId}: ${err} `,
      });
    }
  }
);

// UPDATE page
app.put(
  "/api/pages/:pageId",
  isLoggedIn,
  [check("pageId").isInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const page = req.body;
    // you can also check here if the id passed in the URL matches with the id in req.body,
    // and decide which one must prevail, or return an error
    if (page.IdPage != req.params.pageId) {
      return res.status(422).json({ errors: "Inconsistent ID" });
    }

    if (req.user.level === "User") {
      // the user is updating its own page
      try {
        const resultPrivileges = await dao_pages.checkUserPrivileges(
          req.params.pageId,
          req.user.id
        );
        if (resultPrivileges != null) {
          res.status(503).json({
            error: "You do not have the privileges to update this page",
          });
        }
      } catch (err) {
        return res.status(503).json({
          error: `You are not allowed to delete the page: ${req.params.pageId}: ${err} `,
        });
      }
    }

    // delete all blocks related to the blocks in order to mantain integrity
    try {
      const resultBlocks = await dao_pages.deleteBlocks(req.params.pageId);
    } catch (err) {
      return res.status(503).json({
        error: `Database error during the deletion of Blocks at page ${req.params.pageId}: ${err} `,
      });
    }

    // console.log('AAA');
    // console.log(page.Blocks);
    // console.log('BBB');

    // insert the 'new' blocks
    const blockPromises = page.Blocks.map(async (block) => {
      try {
        const blockId = await dao_pages.addBlock(block, req.params.pageId);
        return blockId;
      } catch (err) {
        throw new Error(
          `Database error during the creation of Block of position ${block.Position} in page ${req.params.pageId}.`
        );
      }
    });

    try {
      const blockIds = await Promise.all(blockPromises);
    } catch (err) {
      console.log(err);
      return res.status(503).json({ error: err.message });
    }

    // update the page data
    try {
      const numPageChanges = await dao_pages.updatePage(page, page.IdAuthor);
      const returnObj = { numPageChanges: numPageChanges };
      setTimeout(() => res.json(returnObj), generalDelay);
    } catch (err) {
      console.log(err);
      res.status(503).json({
        error: `Database error during the update of page ${req.params.pageId}.`,
      });
    }
  }
);

// GET all the blocks
app.get("/api/pages/:pageId/blocks", async (req, res) => {
  try {
    const result = await dao_pages.getAllBlocks(req.params.pageId);
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// IMG
app.get("/api/images", (req, res) => {
  dao_pages
    .listImages()
    .then((images) => res.json(images))
    .catch(() => res.status(500).end());
  console.log("hello");
});

app.get("/api/images/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "images/", imageName);
  res.sendFile(imagePath);
});

// AUTHORS
app.get("/api/users", (req, res) => {
  if (req.isAuthenticated() && req.user.level === "Admin") {
    //query per admin
    console.log("Verifica completata: ADMIN");
    dao_pages
      .getUsers()
      .then((authors) => res.json(authors))
      .catch(() => res.status(500).end());
  }
});

// SITE
app.put("/api/site/:siteId", isLoggedIn, async (req, res) => {
  const concatenatedValues = Object.values(req.body).join("");

  if (req.user.level === "Admin") {
    // update the site name
    try {
      const numSiteChanges = await dao_pages.updateSite(concatenatedValues);
      const returnObj = { numSiteChanges: numSiteChanges };
      setTimeout(() => res.json(returnObj), generalDelay);
    } catch (err) {
      console.log(err);
      res.status(503).json({
        error: `Database error during the update of site ${req.params.siteId}.`,
      });
    }
  }
});

app.get("/api/sites/:siteId", async (req, res) => {
  try {
    const result = await dao_pages.getSiteById(req.params.siteId);
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

/*** Users APIs ***/

// POST /sessions
// login
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current
// logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await dao_users.getUserById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: "Unauthenticated user!" });
    }
    console.log("USER IS");
    console.log(user);
    res.status(200).json({ ...req.user, ...user });
  } else res.status(401).json({ error: "Unauthenticated user" });
});

// toverify
app.get("/api/toverify", async (req, res) => {
  if (req.isAuthenticated()) {
    dao_pages
      .getToVerify()
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else res.status(401).json({ error: "Unauthenticated user" });
});

app.get("/api/toverify/:Id", async (req, res) => {
  try {
    const result = await dao_pages.getToVerifyById(req.params.Id);
    if (result.error) res.status(404).json(result);
    else res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

app.post("/api/toverify/", async (req, res) => {
  // console.log(req);
  if (req.isAuthenticated()) {
    // console.log(req);
    dao_pages
      .addToVerify(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else res.status(401).json({ error: "Unauthenticated user" });
});

// likes
app.post("/api/likes/", async (req, res) => {
  // console.log(req);
  if (req.isAuthenticated()) {
    const user = await dao_users.getUserById(req.user.id);
    // console.log(req);
    dao_pages
      .addLike(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else res.status(401).json({ error: "Unauthenticated user" });
});

app.delete("/api/likes/", async (req, res) => {
  const { IdPage, IdUser } = req.body;
  if (req.isAuthenticated()) {
    const user = await dao_users.getUserById(IdUser);
    dao_pages
      .deleteLike({ IdPage, IdUser })
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else res.status(401).json({ error: "Unauthenticated user" });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
