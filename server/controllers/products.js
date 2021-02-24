'use strict';


const {ProductsManager} = require('../managers');
const PagingService = require('../services/paging');

class ProductsController {

  constructor() { }

  async list(req, res) {
    var { page, per_page, sort } = req.query;
    if (sort)
      sort = sort.split('|');
    const { limit, offset } = PagingService.getPagination(page, per_page);

    try {
      var data = await ProductsManager.findAndCount({}, limit, offset, sort);
      const products = PagingService.getPagingData(data, page, limit);
      return res.status(200).send(products);
    } catch (error) {
      console.log('ProductsController list', error)
      return res.status(400).send({ error: "Error get list products" })
    }
  }

  async exists(req, res) {
    const id = req.params.id;

    try {
      var count = await ProductsManager.exists_by_id(id);
      if (count > 0)
        return res.status(204).send(true);
      else
        throw new Error();
    } catch (error) {
      return res.status(404).send({ error: 'Product id not found' })
    }
  }

  async find(req, res) {
    const id = req.params.id;
    try {
      var product = await ProductsManager.findById(id);
      if (product)
        return res.status(200).send(product);
      else throw new Error();
    } catch (error) {
      return res.status(404).send({ error: `Product with id ${id} not found` })
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    const product = await ProductsManager.findById(id, ['email']);
    // console.log('delete', product)
    await product.destroy();
    return res.status(200).send({ message: `Deleted product with id ${id}` });
  }
}

module.exports = new ProductsController();