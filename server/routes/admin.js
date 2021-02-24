"use strict";

const express = require("express");
const router = express.Router();

const { JwtMiddleware } = require("../middleware");
const { DashboardController } = require("../controllers");

router
  .route(["/", "/dashboard"])
  .get(
    [JwtMiddleware.verify()],
    DashboardController.show
  );

module.exports = router;
