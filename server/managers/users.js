'use strict';

const { User, Role } = require('../models');

class UsersManager {

  constructor() {
  }

  async findAndCount(filter, limit, offset, sort) {
    return await User.findAndCountAll({
      where: filter,
      /*
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role'], required: true,
        through: { attributes: [] }
      }],
      */
      attributes: {
        exclude: ['password']
      }, limit, offset, order: sort ? [sort] : null
    });
  }

  async findAll() {
    return await User.findAll({
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role'], required: true,
        through: { attributes: [] }
      }],
      attributes: {
        exclude: ['password']
      }
    });
  }

  async findById(id, exclude = null) {
    console.log('exclude', exclude);
    return await User.findByPk(id, {
      include: [{
        model: Role, as: 'roles',
        attributes: ['role', 'id'],
        through: { attributes: [] }
      }],
      attributes: {
        exclude: exclude || ['password']
      }
    });
  }

  async findOne(user_name) {
    return await User.findOne({
      where: { user_name },
      include: [{ required: true,
        model: Role, as: 'roles', attributes: ['role'],
        through: { attributes: [] }
      }]
    });
  }

  async save(data) {
    try {
      return await User.build(data).save();
    } catch(error) {
      throw (error);
    }
  }

  async exists(user_name) {
    return await User.count({
      where: { user_name}
    });
  }

  async exists_by_id(id) {
    return await Role.count({
      where: { id }
    });
  }

  async authenticate(user_name, password) {
    var user = await this.findOne(user_name);
    if (!user)
      throw new Error('User not found');
    if (user.status !== 'active')
      throw new Error('User not active.');
    var is_valid = await user.validPassword(password);
    if (is_valid)
      return user;
    else
      throw new Error('Invalid password');
  }
}

module.exports = new UsersManager();