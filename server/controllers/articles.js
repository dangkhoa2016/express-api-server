'use strict';


const {ArticlesManager} = require('../managers');
const PagingService = require('../services/paging');

class ArticlesController {

  constructor() { }

  async list(req, res) {
    var { page, per_page, sort } = req.query;
    if (sort)
      sort = sort.split('|');
    const { limit, offset } = PagingService.getPagination(page, per_page);

    try {
      var data = await ArticlesManager.findAndCount({}, limit, offset, sort);
      const articles = PagingService.getPagingData(data, page, limit);
      return res.status(200).send(articles);
    } catch (error) {
      console.log('ArticlesController list', error)
      return res.status(400).send({ error: "Error get list articles" })
    }
  }

  async exists(req, res) {
    const id = req.params.id;

    try {
      var count = await ArticlesManager.exists_by_id(id);
      if (count > 0)
        return res.status(204).send(true);
      else
        throw new Error();
    } catch (error) {
      return res.status(404).send({ error: 'Article id not found' })
    }
  }

  async find(req, res) {
    const id = req.params.id;
    try {
      var article = await ArticlesManager.findById(id);
      if (article)
        return res.status(200).send(article);
      else throw new Error();
    } catch (error) {
      return res.status(404).send({ error: `Article with id ${id} not found` })
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    const article = await ArticlesManager.findById(id, ['email']);
    // console.log('delete', article)
    await article.destroy();
    return res.status(200).send({ message: `Deleted article with id ${id}` });
  }
}

module.exports = new ArticlesController();