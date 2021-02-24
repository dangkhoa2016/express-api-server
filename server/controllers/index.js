'use strict';

const UsersController = require('./users');
const DashboardController = require('./dashboard');
const RolesController = require('./roles');
const ArticlesController = require('./articles');
const ContactsController = require('./contacts');
const ProductsController = require('./products');

module.exports = {
  UsersController,
  RolesController,
  ArticlesController,
  ContactsController,
  ProductsController,
  DashboardController
};