"use strict";

const express = require("express");
const router = express.Router();

const { UsersController } = require("../controllers");
const { JwtMiddleware } = require("../middleware");
var check = [JwtMiddleware.verify(), JwtMiddleware.hasAnyRole(["USER","ADMIN"])];
var verify = [JwtMiddleware.verify()];

router
  .route("/")
  .get(check, UsersController.list)
  .post(check, UsersController.create);

router
  .route("/all")
  .get(verify, UsersController.list_all);

router
  .route("/:id")
  .head(check, UsersController.exists)
  .get(check, UsersController.find)
  .put(check, UsersController.update)
  .patch(check, UsersController.update)
  .delete(check, UsersController.delete);

module.exports = router;
