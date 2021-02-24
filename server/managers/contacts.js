'use strict';

const { Contact, User } = require('../models');

class ContactsManager {

  constructor() {
  }

  async findAndCount(filter, limit, offset, sort) {
    return await Contact.findAndCountAll({
      where: filter,
      include: [{
        model: User,
        as: 'processor',
        attributes: ['full_name'],
        //through: { attributes: [] }
      }], limit, offset, order: sort ? [sort] : null
    });
  }

  async findAll() {
    return await Contact.findAll({
      include: [{
        model: User,
        as: 'processor',
        attributes: ['full_name'],
        //through: { attributes: [] }
      }]
    });
  }

  async findById(id, exclude = []) {
    return await Contact.findByPk(id, {
      include: [{
        model: User,
        as: 'processor',
        attributes: ['full_name'],
        //through: { attributes: [] }
      }],
      attributes: {
        exclude: exclude || ['id']
      }
    });
  }

  async findOne(full_name) {
    return await Contact.findOne({
      where: { full_name },
      include: [{
        model: User,
        as: 'processor',
        attributes: ['full_name'],
        //through: { attributes: [] }
      }]
    });
  }

  async save(data) {
    try {
      return await Contact.build(data).save();
    } catch(error) {
      throw (error);
    }
  }

  async exists(full_name) {
    return await Contact.count({
      where: { full_name }
    });
  }

  async exists_by_id(id) {
    return await Contact.count({
      where: { id }
    });
  }
}

module.exports = new ContactsManager();