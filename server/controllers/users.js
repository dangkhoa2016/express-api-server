'use strict';


const {UsersManager} = require('../managers');
const PagingService = require('../services/paging');

class UsersController {

  constructor() { }

  async list(req, res) {
    var { page, per_page, sort } = req.query;
    if (sort)
      sort = sort.split('|');
    const { limit, offset } = PagingService.getPagination(page, per_page);

    try {
      var data = await UsersManager.findAndCount({}, limit, offset, sort);
      const users = PagingService.getPagingData(data, page, limit);
      return res.status(200).send(users);
    } catch (error) {
      console.log('UsersController list', error)
      return res.status(400).send({ error: "Error get list users" })
    }
  }

  async list_all(req, res) {
    try {
      var data = await UsersManager.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log('UsersManager list', error);
      return res.status(400).send({ error: "Error get list users" })
    }
  }

  async create(req, res) {
    let user = req.body;

    try {
      if (!user.full_name)
        user.full_name = user.email;
      user = await UsersManager.save(user);
      var id = user.dataValues.id;
      if (user) {
        var roles = req.body.roles || [];
        roles = roles.filter(x => x !== null);
        await user.setRoles(roles);
        user = await UsersManager.findById(id);
        return res.status(201).send(user);
      }
      else
        throw new Error();
    } catch (error) {
      console.log('Error create', error);
      return res.status(400).send({ error: "Error creating new user" })
    }
  }

  async exists(req, res) {
    const id = req.params.id;

    try {
      var count = await UsersManager.exists_by_id(id);
      if (count > 0)
        return res.status(204).send(true);
      else
        throw new Error();
    } catch (error) {
      return res.status(404).send({ error: 'User id not found' })
    }
  }

  async find(req, res) {
    const id = req.params.id;
    try {
      var user = await UsersManager.findById(id);
      if (user)
        return res.status(200).send(user);
      else throw new Error();
    } catch (error) {
      return res.status(404).send({ error: `User with id ${id} not found` })
    }
  }

  async update(req, res) {
    let user;
    try {
      user = await UsersManager.findById(req.params.id);
      if (user) {
        var roles = req.body.roles || [];
        roles = roles.filter(x => x !== null);
        delete req.body.roles;
        await user.update(req.body);
        await user.setRoles(roles);
        user = await UsersManager.findById(req.params.id);
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // checking the error
        res.json({
          user: req.body,
          errors: error.errors
        });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    const user = await UsersManager.findById(id, ['email']);
    // console.log('delete', user)
    await user.destroy();
    return res.status(200).send({ message: `Deleted user with id ${id}` });
  }
}

module.exports = new UsersController();