const express = require("express");
const router = express.Router();
const { JwtMiddleware } = require("../middleware");
const Article = require("../models").Article;
const { ArticlesController } = require("../controllers");
var check = [JwtMiddleware.verify(), JwtMiddleware.hasAnyRole(["ARTICLE", "ADMIN"])];

/* Show the full list of articles */
router.get("/", check, ArticlesController.list);


/* Shows article  */
router.get(["/:id", "/:id/view"], check, async (req, res) => {
  const article = await Article.findByPk(req.params.id);
  res.json(article);
});

/* Posts a new article to the database */
router.post(["/", "/new"], check, async (req, res) => {
  let article;
  try {
    article = await Article.create(req.body);
    res.json(article);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // checking the error
      article = await Article.build(req.body);
      res.json({
        article,
        errors: error.errors
      });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
});

/* Updates article info in the database */
router.put(["/:id","/:id/update"], check, async (req, res) => {
  let article;
  try {
    article = await Article.findByPk(req.params.id);
    await article.update(req.body);
    res.json(article);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // checking the error
      article = await Article.build(req.body);
      res.json({
        article,
        errors: error.errors
      });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
});

/* Deletes a article */
async function handleDelete (req, res) {
  const article = await Article.findByPk(req.params.id);
  await article.destroy();
  
  res.json({msg: `Article [${req.params.id}] has been deleted`});
}

router.get("/:id/delete", check, handleDelete);
router.delete("/:id", check, handleDelete);

module.exports = router;
