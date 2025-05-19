import dayjs from "dayjs";
import { Page, Block, User, Site, Verify } from "./PageModel";

const SERVER_URL = "http://localhost:3001/api/";

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise.then((response) => {
      if (response.ok) {
        // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
        response
          .json()
          .then((json) => resolve(json))
          .catch((err) => reject({ error: "Cannot communicate" }));
      }
    });
  });
}

// PAGES
const getAllPages = async (urlSearch) => {
  let u = urlSearch === "" ? "-" : urlSearch;
  return getJson(
    fetch(SERVER_URL + `pages/${u}`, { credentials: "include" })
  ).then((json) => {
    return json.map((p) => {
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
  });
};

const getVerify = async () => {
  return getJson(
    fetch(SERVER_URL + `toverify`, { credentials: "include" })
  ).then((json) => {
    return json.map((p) => {
      return new Verify(p.Id, p.Link, p.Author, p.Title, p.Feedback);
    });
  });
};

async function getVerifyById(id) {
  const response = await fetch(SERVER_URL + `toverify/${id}`);
  const p = await response.json();
  if (response.ok) {
    return new Verify(p.Id, p.Link, p.Author, p.Title, p.Feedback);
  } else {
    throw p;
  }
}

async function getPageById(id) {
  const response = await fetch(SERVER_URL + `page/${id}`);
  const p = await response.json();
  if (response.ok) {
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
  } else {
    throw p;
  }
}

function addToVerify(toVerify) {
  // call POST /api/pages
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + `toverify`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.assign({}, toVerify)), //, {date: answer.date.format("YYYY-MM-DD")}
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((id) => resolve(id))
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject({ error: message });
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

function addPage(page) {
  // call POST /api/pages
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + `pages`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.assign({}, page)), //, {date: answer.date.format("YYYY-MM-DD")}
    })
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((id) => resolve(id))
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
}

// delete a page given its id
const deletePage = (id) => {
  return getJson(
    fetch(SERVER_URL + `pages/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
  );
};

const updatePage = (page) => {
  // call  PUT /api/pages/<id>
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + `pages/${page.IdPage}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.assign({}, page)),
    })
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
};

// BLOCKS
const getAllBlocks = async (id) => {
  const response = await fetch(SERVER_URL + `pages/${id}/blocks`);
  const blocks = await response.json();
  if (response.ok) {
    return blocks.map((el) => {
      return new Block(el.IdBlock, el.IdPage, el.Type, el.Content, el.Position);
    });
  } else {
    throw blocks;
  }
};

// IMAGES
const getListImages = async () => {
  return getJson(fetch(SERVER_URL + "images/")).then((json) => {
    return json;
  });
};

//login
async function logIn(credentials) {
  let response = await fetch(SERVER_URL + "sessions", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(SERVER_URL + "sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
}

async function getUserInfo() {
  const response = await fetch(SERVER_URL + "sessions/current", {
    credentials: "include",
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo; // an object with the error coming from the server
  }
}

// LIKES

const addLike = async (like) => {
  return getJson(
    fetch(SERVER_URL + `likes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.assign({}, like)),
    })
  );
};

const deleteLike = async (IdPage, IdUser) => {
  return getJson(
    fetch(SERVER_URL + `likes/`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ IdPage, IdUser }),
    })
  );
};

// AUTHORS
const getAllUsers = async () => {
  return getJson(fetch(SERVER_URL + `users`, { credentials: "include" })).then(
    (json) => {
      return json.map((a) => {
        return new User(a.IdUser, a.Name);
      });
    }
  );
};

const updateSiteTitle = async (site) => {
  // call  PUT /api/site/<id>
  return new Promise((resolve, reject) => {
    fetch(SERVER_URL + `site/1`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.assign({}, site)),
    })
      .then((response) => {
        // console.log('API ' + site);
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Cannot parse server response." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Cannot communicate with the server." });
      }); // connection errors
  });
};

async function getSiteById(id) {
  const response = await fetch(SERVER_URL + `sites/${id}`);
  const s = await response.json();
  if (response.ok) {
    return new Site(s.IdSite, s.Name);
  } else {
    throw s;
  }
}

const API = {
  getAllPages,
  getListImages,
  logIn,
  logOut,
  getUserInfo,
  getPageById,
  getAllBlocks,
  addPage,
  deletePage,
  updatePage,
  getAllUsers,
  updateSiteTitle,
  getSiteById,
  addLike,
  deleteLike,
  addToVerify,
  getVerify,
  getVerifyById,
};
export default API;
