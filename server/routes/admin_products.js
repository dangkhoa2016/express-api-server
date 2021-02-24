const express = require("express");
const router = express.Router();
const { JwtMiddleware } = require("../middleware");
const Product = require("../models").Product;
const { ProductsController } = require("../controllers");
var check = [JwtMiddleware.verify(), JwtMiddleware.hasAnyRole(["PRODUCT", "ADMIN"])];
var verify = [JwtMiddleware.verify()];


/* Show the full list of products */
router.get("/", check, ProductsController.list);


/* Shows product  */
router.get(["/:id", "/:id/view"], check, async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  res.json(product);
});

/* Posts a new product to the database */
router.post(["/", "/new"], check, async (req, res) => {
  let product;
  try {
    product = await Product.create(req.body);
    res.json(product);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // checking the error
      product = await Product.build(req.body);
      res.json({
        product,
        errors: error.errors
      });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
});

/* Updates product info in the database */
router.put(["/:id","/:id/update"], check, async (req, res) => {
  let product;
  try {
    product = await Product.findByPk(req.params.id);
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // checking the error
      product = await Product.build(req.body);
      res.json({
        product,
        errors: error.errors
      });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
});

/* Deletes a product */
async function handleDelete (req, res) {
  const product = await Product.findByPk(req.params.id);
  var id = product.id;
  await product.destroy();
  
  res.json({msg: `Product [${req.params.id}] has been deleted`});
}

router.get("/:id/delete", check, handleDelete);
router.delete("/:id", check, handleDelete);

module.exports = router;