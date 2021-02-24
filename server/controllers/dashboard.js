"use strict";

const db = require('../models');
const { JwtMiddleware } = require("../middleware");
var isAdmin = JwtMiddleware.hasRole("ADMIN", true);
var isContactManager = JwtMiddleware.hasRole("CONTACT", true);
var isUserManager = JwtMiddleware.hasRole("USER", true);
var isArticleManager = JwtMiddleware.hasRole("ARTICLE", true);
var isProductManager = JwtMiddleware.hasRole("PRODUCT", true);

class DashboardController {
  constructor() {}

  async show(req, res) {
    var canAccessReportArticle = isAdmin(req, res) || isArticleManager(req, res);
    var canAccessReportContact = isAdmin(req, res) || isContactManager(req, res);
    var canAccessReportUser = isAdmin(req, res) || isUserManager(req, res);
    var canAccessReportProduct = isAdmin(req, res) || isProductManager(req, res);

    var articles = canAccessReportArticle ? await db.Article.count() : null;
    var users = canAccessReportUser ? await db.User.count() : null;
    var products = canAccessReportProduct ? await db.Product.count() : null;
    var contacts = canAccessReportContact ? await db.Contact.count() : null;

    res.json({ articles, users, products, contacts });
  }
}

module.exports = new DashboardController();
