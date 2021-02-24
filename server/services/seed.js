const { UsersManager } = require("../managers");
require("dotenv").config({ path: "./dev.env" });
const { Role, User, Product } = require("../models");

class SeedService {
  constructor() {}

  async create_data() {
    if (await this.has_data()) return;

    var is_ok = await this.create_roles();
    if (is_ok) {
      await this.create_admin();
      await this.create_users();
      await this.create_products();

      console.log("Done seed...");
    } else console.log("Something went wrong...");
  }

  async create_users() {
    var json = require("../../database/seed.users.json");
    var users = json.length ? json : [json];
    var promises = users.map(async user => {
      user = await UsersManager.save(user);
      return user.setRoles(user.roles || [2]);
    });

    await Promise.all(promises);
  }

  async create_roles() {
    try {
      //master role
      await Role.admin_role();
      var roles = await Role.findAll();
      var json = require("../../database/seed.roles.json");
      await Role.bulkCreate(json);
      return true;
    } catch (err) {
      // console.log('create_roles', err);
      if (err.name === "SequelizeUniqueConstraintError") return true;
    }

    return false;
  }

  async create_products() {
    var json = require("../../database/seed.products.json");
    await Product.bulkCreate(json);
  }

  async create_admin() {
    var user = await UsersManager.save({
      email: process.env.admin_email || "admin@app.test.repl",
      full_name: "Master Admin",
      user_name: "admin",
      status: 'active',
      password: process.env.admin_pass || "admin"
    });

    var roles = user.roles;
    if (!roles || roles.length === 0) roles = await user.getRoles();

    if (!roles || roles.length === 0) {
      var role = null;
      try {
        role = await Role.admin_role();
      } catch (e) {
        // Deal with the fact the chain failed
        console.log('create_admin', e);
      }

      var a = await user.addRoles([role]);
      // console.log('a', a);
      roles = await user.getRoles();
    }

    //console.log('roles', roles);
  }

  async has_data() {
    var user = null;
    try {
      user = await UsersManager.findOne("admin");
    } catch (e) {
      // Deal with the fact the chain failed
      console.log('has_data', e);
      return false;
    }

    //console.log("has_data ?", user);
    return user !== null;
  }
}

module.exports = new SeedService();
