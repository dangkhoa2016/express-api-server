"use strict";

const express = require("express");
const router = express.Router();

const { RolesController } = require("../controllers");
const { JwtMiddleware } = require("../middleware");
var check = [JwtMiddleware.verify(), JwtMiddleware.hasRole("ADMIN")];
var verify = [JwtMiddleware.verify()];

router
  .route("/")
  .get(check, RolesController.list)
  .post(check, RolesController.create);

router
  .route("/all")
  .get(verify, RolesController.list_all);

router
  .route("/:id")
  .head(check, RolesController.exists)
  .get(check, RolesController.find)
  .put(check, RolesController.replace)
  .patch(check, RolesController.update)
  .delete(check, RolesController.delete);

module.exports = router;
