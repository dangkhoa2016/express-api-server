const express = require("express");
const bcrypt = require("bcrypt");

async function wait(sec) {
  return new Promise(resolve => {
    setTimeout(resolve, sec * 1000);
  });
}

const router = express.Router();
const { JwtMiddleware } = require("../middleware");

const { JwtService } = require("../services");
// const JwtService = require('../services/jwt.service');

// grab the User model from the models folder, the sequelize
// index.js file takes care of the exporting for us and the
// syntax below is called destructuring, its an es6 feature
const { User, Role } = require("../models");
const { UsersManager } = require("../managers");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({msg: 'Hello !'});
});

router.get("/contact", async (req, res, next) => {
  await wait(5);
  res.send("Contact page");
});

/* Me Route - get the currently logged in user
========================================================= */
router.get("/api/me", [JwtMiddleware.verify()], async (req, res) => {
  if (req.credential) {
    return res.send(req.credential);
  }
  
  res.status(404).send({ errors: [{ message: "missing auth token" }] });
});


/* Register Route
========================================================= */
router.post("/api/admin-register", async (req, res) => {
  const { email, user_name, full_name, password } = req.body;
  // if the user_name / password is missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!email || !password) {
    return res.status(400).send("Request missing user_name or password param");
  }

  if (!user_name) user_name = email;
  if (!full_name) full_name = email;

  try {
    let user = await User.create({ email, user_name, full_name, password });
    if (!user) throw new Error("Can not create user");
    //add basic role
    var role = await Role.user_role();
    await user.addRoles([role]);
    let data = await get_token(user);

    res.cookie("auth_token", data.token, {
      maxAge: 2 * 60 * 60 * 1000, // 2 hours,
      // You can't access these tokens in the client's javascript
      httpOnly: true
    });

    // send back the new user and auth token to the
    // client { user, authToken }
    return res.json({id: user.id, roles: user.roles, user_name: user.user_name, token: data.token});
  } catch (err) {
    return res.status(400).send(err);
  }
});

/* Login Route
========================================================= */
router.post("/api/admin-login", async (req, res) => {
  const { user_name, password } = req.body;

  // if the user_name / password is missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!user_name || !password) {
    return res.status(400).send("Request missing user_name or password param");
  }

  try {
    var user = await UsersManager.authenticate(user_name, password);
    if (!user) throw new Error("User not found");
    user = user.dataValues || {};
    let data = await get_token(user);

    user.token = data.token;
    delete user.password;

    res.cookie("auth_token", data.token, {
      maxAge: 2 * 60 * 60 * 1000, // 2 hours,
      // You can't access these tokens in the client's javascript
      httpOnly: true
    });

    return res.json({id: user.id, roles: user.roles, user_name: user.user_name, token: data.token});
  } catch (err) {
    // console.log("Error", err.message);
    return res.status(400).send("Invalid user_name or password");
  }
});

/* Logout Route
========================================================= */
router.get("/api/admin-logout", async (req, res) => {
  const bearer = req.header("Authorization") || "";
  var token = bearer.split(" ")[1];
  if (!token) token = req.cookies.auth_token;
  JwtService.logout(token);
  res.cookie("auth_token", "", { expires: new Date(0) });
  res.clearCookie("auth_token");
  // return res.status(204).send();

  // if the user missing, the user is not logged in, hence we
  // use status code 400 indicating a bad request was made
  // and send back a message
  res.json({msg: 'You Have Successfully Logged Out Of Your Account'});
  // return res.status(400).send({ errors: [{ message: "Not authenticated" }] });
});

async function get_token(user) {
  if (!user) throw new Error("User not found");

  if (typeof user === "string") {
    user = await UsersManager.findOne(user);
    if (!user) throw new Error("User not found");
  } else if (typeof user === "number") {
    user = await UsersManager.findById(user);
    if (!user) throw new Error("User not found");
  }

  var roles = user.roles;
  if (!roles || roles.length === 0) roles = await user.getRoles();

  var data = roles.map((role, index) => {
    return role.dataValues;
  });
  // console.log('get_token roles', data);
  let payload = { user: {user_name: user.user_name, email: user.email, full_name: user.full_name}, roles: data };
  return { token: JwtService.sign(payload) };
}

// export the router so we can pass the routes to our server
module.exports = router;
