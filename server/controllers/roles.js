'use strict';

const {RolesManager} = require('../managers');
const PagingService = require('../services/paging');

class RolesController {

  constructor() { }

  async list(req, res) {
    var { page, per_page, sort } = req.query;
    if (sort)
      sort = sort.split('|');
    const { limit, offset } = PagingService.getPagination(page, per_page);

    try {
      var data = await RolesManager.findAndCount({}, limit, offset, sort);
      const roles = PagingService.getPagingData(data, page, limit);
      return res.status(200).send(roles);
    } catch (error) {
      console.log('RolesController list', error);
      return res.status(400).send({ error: "Error get list roles" })
    }
  }

  async list_all(req, res) {
    try {
      var data = await RolesManager.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log('RolesController list', error);
      return res.status(400).send({ error: "Error get list roles" })
    }
  }

  async create(req, res) {
    let role = req.body;

    try {
      role = await RolesManager.save(role);
      role = await RolesManager.findById(role.dataValues.id);
      if (role)
        return res.status(201).send(role);
      else
        throw new Error();
    } catch (error) {
      console.log('Error create', error);
      return res.status(400).send({ error: "Error creating new role" })
    }
  }

  async exists(req, res) {
    const id = req.params.id;

    try {
      var count = await RolesManager.exists_by_id(id);
      if (count > 0)
        return res.status(204).send();
      else
        throw new Error();
    } catch (error) {
      return res.status(404).send({ error: 'Role id not found' })
    }
  }

  async find(req, res) {
    const id = req.params.id;
    try {
      var role = await RolesManager.findById(id);
      role = await RolesManager.findById(role.dataValues.id);
      if (role)
        return res.status(200).send(role);
      else throw new Error();
    } catch (error) {
      return res.status(404).send({ error: `Role with id ${id} not found` })
    }
  }

  async replace(req, res) {
    const id = req.params.id;
    return res.status(200).send({ message: `Replaced role with id ${id}` });
  }

  async update(req, res) {
    const id = req.params.id;
    return res.status(200).send({ message: `Updated role with id ${id}` });
  }

  async delete(req, res) {
    const id = req.params.id;

    const role = await RolesManager.findById(id, ['email']);
    // console.log('delete', role)
    await role.destroy();
    return res.status(200).send({ message: `Deleted role with id ${id}` });
  }
}

module.exports = new RolesController();