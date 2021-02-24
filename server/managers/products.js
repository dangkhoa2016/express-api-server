'use strict';

const { Product, User } = require('../models');

class ProductsManager {

  constructor() {
  }

  async findAndCount(filter, limit, offset, sort) {
    return await Product.findAndCountAll({
      where: filter,
      include: [{
        model: User,
        attributes: ['full_name'],
      }], limit, offset, order: sort ? [sort] : null
    });
  }

  async findAll() {
    return await Product.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name'],
        through: { attributes: [] }
      }]
    });
  }

  async findById(id, exclude = []) {
    return await Product.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name'],
        through: { attributes: [] }
      }],
      attributes: {
        exclude: exclude || ['id']
      }
    });
  }

  async findOne(title) {
    return await Product.findOne({
      where: { title },
      include: [{
        model: User, as: 'user', attributes: ['full_name'],
        through: { attributes: [] }
      }]
    });
  }

  async save(data) {
    try {
      return await Product.build(data).save();
    } catch(error) {
      throw (error);
    }
  }

  async exists(title) {
    return await Product.count({
      where: { title }
    });
  }

  async exists_by_id(id) {
    return await Product.count({
      where: { id }
    });
  }
}

module.exports = new ProductsManager();