'use strict';

const { Role, User } = require('../models');

class RolesManager {

  constructor() {
  }

  async findAndCount(filter, limit, offset, sort) {
    return await Role.findAndCountAll({
      where: filter,
      include: [{
        model: User,
        as: 'users',
        attributes: ['user_name'],
        through: { attributes: [] }
      }], limit, offset, order: sort ? [sort] : null
    });
  }

  async findAll() {
    return await Role.findAll({
      include: [{
        model: User,
        as: 'users',
        attributes: ['user_name'],
        through: { attributes: [] }
      }]
    });
  }

  async findById(id, exclude = []) {
    return await Role.findByPk(id, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['user_name'],
        through: { attributes: [] }
      }],
      attributes: {
        exclude: exclude || ['id']
      }
    });
  }

  async findOne(role_name) {
    return await Role.findOne({
      where: { role: role_name },
      include: [{
        model: User, as: 'users', attributes: ['user_name'],
        through: { attributes: [] }
      }]
    });
  }

  async save(data) {
    try {
      return await Role.build(data).save();
    } catch(error) {
      throw (error);
    }
  }

  async exists(role_name) {
    return await Role.count({
      where: { role: role_name }
    });
  }

  async exists_by_id(id) {
    return await Role.count({
      where: { id }
    });
  }

}

module.exports = new RolesManager();