'use strict';


const {ContactsManager} = require('../managers');
const PagingService = require('../services/paging');

class ContactsController {

  constructor() { }

  async list(req, res) {
    var { page, per_page, sort } = req.query;
    if (sort)
      sort = sort.split('|');
    const { limit, offset } = PagingService.getPagination(page, per_page);

    try {
      var data = await ContactsManager.findAndCount({}, limit, offset, sort);
      const contacts = PagingService.getPagingData(data, page, limit);
      return res.status(200).send(contacts);
    } catch (error) {
      console.log('ContactsController list', error)
      return res.status(400).send({ error: "Error get list contacts" })
    }
  }

  async exists(req, res) {
    const id = req.params.id;

    try {
      var count = await ContactsManager.exists_by_id(id);
      if (count > 0)
        return res.status(204).send(true);
      else
        throw new Error();
    } catch (error) {
      return res.status(404).send({ error: 'Contact id not found' })
    }
  }

  async find(req, res) {
    const id = req.params.id;
    try {
      var contact = await ContactsManager.findById(id);
      if (contact)
        return res.status(200).send(contact);
      else throw new Error();
    } catch (error) {
      return res.status(404).send({ error: `Contact with id ${id} not found` })
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    const contact = await ContactsManager.findById(id, ['email']);
    // console.log('delete', contact)
    await contact.destroy();
    return res.status(200).send({ message: `Deleted contact with id ${id}` });
  }
}

module.exports = new ContactsController();