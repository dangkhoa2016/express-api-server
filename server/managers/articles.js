'use strict';

const { Article, User } = require('../models');

class ArticlesManager {

  constructor() {
  }

  async findAndCount(filter, limit, offset, sort) {
    return await Article.findAndCountAll({
      where: filter,
      include: [{
        model: User,
        as: 'author',
        attributes: ['full_name'],
      }], limit, offset, order: sort ? [sort] : null
    });
  }

  async findAll() {
    return await Article.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['full_name'],
        through: { attributes: [] }
      }]
    });
  }

  async findById(id, exclude = []) {
    return await Article.findByPk(id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['full_name'],
        through: { attributes: [] }
      }],
      attributes: {
        exclude: exclude || ['id']
      }
    });
  }

  async findOne(full_name) {
    return await Article.findOne({
      where: { full_name },
      include: [{
        model: User, as: 'author', attributes: ['full_name'],
        through: { attributes: [] }
      }]
    });
  }

  async save(data) {
    try {
      return await Article.build(data).save();
    } catch(error) {
      throw (error);
    }
  }

  async exists(full_name) {
    return await Article.count({
      where: { full_name }
    });
  }

  async exists_by_id(id) {
    return await Article.count({
      where: { id }
    });
  }
}

module.exports = new ArticlesManager();