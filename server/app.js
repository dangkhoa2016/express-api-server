
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const moment = require("moment");
const { JwtMiddleware } = require("./middleware");

const main = require("./routes/index");
const admin_products = require("./routes/admin_products");
const admin_users = require("./routes/admin_users");
const admin_roles = require("./routes/admin_roles");
const admin_contacts = require("./routes/admin_contacts");
const admin_articles = require("./routes/admin_articles");
const admin = require("./routes/admin");

const app = express();


app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// use the cookie-parser to help with auth token,
// it must come before the JwtMiddleware
app.use(cookieParser());


//for all route
app.use((req, res, next) => {
  var is_json = req.is("json");
  if (!is_json) {
    var accept = req.headers["accept"];
    var contype = req.headers["content-type"];
    var check1 = contype && contype.indexOf("application/json") !== -1;
    var check2 = accept && accept.indexOf("application/json") !== -1;
    if (check1 || check2) is_json = true;
  }
  app.locals.url = req.originalUrl;
  req.is_json = is_json;
  next();
});


app.locals.moment = moment;

app.use("/", main);
app.use("/api/admin/roles", admin_roles);
app.use("/api/admin/products", admin_products);
app.use("/api/admin/users", admin_users);
app.use("/api/admin/contacts", admin_contacts);
app.use("/api/admin/articles", admin_articles);
app.use("/api/admin", admin);

// catch 404 Not found middleware
app.use((req, res, next) => {
  console.log("Not found", req.url);
  const err = new Error(`The page requested does not exist.`);
  res.status(404).json({ err: err.message });
});

//Global error middleware handler
app.use(function (err, req, res, next) {
  // console.log("Global error", err);
  if (req.error_code === 300)
    return res.status(300).json({ msg: 'Your session has been expired.' });

  if (err && err.status === 404) {
    err.message = `The page requested does not exist.`;
    res.status(404).json({ err: err.message });
  } else {
    if (!err.message)
      err.message = `Ooops! It looks like something went wrong on the server.`;
    res.status(err.status || 500).json({ err: err.message });
  }
});

module.exports = app;
