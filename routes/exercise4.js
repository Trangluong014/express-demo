const express = require("express");
const { token } = require("morgan");
// const { response } = require("../app");
const router = express.Router();

const sendResponse = (status, data, message, res, next) => {
  const result = { data, message };
  return res.status(status).send(result);
};

const db = [];

/* GET home page. */
router.get("/", function (req, res, next) {
  return sendResponse(200, {}, "home", res, next);
});

function isAuthenticated(req, res, next) {
  try {
    const { accesstoken } = req.headers;
    if (!accesstoken || accesstoken !== "123") {
      const error = new Error("Not authenticated. Please Login");
      error.statusCode = 401;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

function validateQuery(req, res, next) {
  try {
    allowQuery = ["category", "city", "title", "q", "page"];
    query = Object.keys(req.query);
    query.forEach((item) => {
      if (allowQuery.indexOf(item) === -1) {
        const error = new Error(`${item} Query not allow`);
        error.statusCode = 400;
        throw error;
      }
    });
    next();
  } catch (error) {
    next(error);
  }
}

// number 1-11
router.get("/news", validateQuery, function (req, res, next) {
  const query = req.query;
  const params = req.params;
  let message = "Successfully get all news";
  if (query.title && query.city && query.category) {
    message = `Successfully get all news that have a string of all queries and theirs dynamicValue `;
  } else if (query.title) {
    message = `Successfully get all news that have tittle ${
      query.title
    }  or ${query.title.toUpperCase()}.`;
  } else if (query.page) {
    message = `Successfully get page ${query.page} news`;
  } else if (query.q) {
    message = `Successfully get all news related to query ${query.q}.`;
  } else if (query.city) {
    message = `Successfully get all news related to city ${query.city}.`;
  } else if (query.category) {
    message = `Successfully get all news that have category according to ${query.category}.`;
  }

  return sendResponse(200, {}, message, res, next);
});

// number 12
router.get("/news/:id", function (req, res, next) {
  const { id } = req.params;
  let message = `Successfully get detail of 1 single new with the id is ${id}`;
  return sendResponse(200, {}, message, res, next);
});

//number 15
router.delete("/news/:id", function (req, res, next) {
  const { id } = req.params;
  let message = `Successfully find the news with ${id} , and delete`;
  return sendResponse(200, {}, message, res, next);
});

//number 13
const bodyPost = function (req, res, next) {
  const body = req.body;
  let message = `Successfully create a news about ${body.title} in ${body.city} and related to ${body.category}`;

  return sendResponse(200, { body }, message, res, next);
};
router.post("/news", isAuthenticated, bodyPost);

//number 14
router.put("/news/:id", isAuthenticated, function (req, res, next) {
  const body = req.body;
  const { id } = req.params;
  let message = `Successfully find the news with ${id} , and update the content with ${body.title} in ${body.city} and related to ${body.category}`;
  return sendResponse(200, { body }, message, res, next);
});

//extra-rocket
router.get("/login", function (req, res, next) {
  const body = req.body;
  const userName = [];
  const password = [];
  const userDb = [
    { name: "tuan", password: "3ef" },
    { name: "notTuan", password: "31f" },
    { name: "moreTuan", password: "4ef" },
    { name: "mostTuan", password: "9ef" },
  ];
  userDb.forEach((obj) => {
    userName.push(obj.name);
    password.push(obj.password);
  });
  if (!userName.includes(body.username)) {
    const error = new Error(`Username: ${body.username} has not been register`);
    error.statusCode = 400;
    throw error;
  } else if (!password.includes(body.password)) {
    const error = new Error(`Password is not correct`);
    error.statusCode = 403;
    throw error;
  }
  const token = "123";
  const message = "Sucessfully login";
  const result = { accesstoken: "123" };
  return sendResponse(200, result, message, res, next);
});
module.exports = router;
