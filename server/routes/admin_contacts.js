const express = require("express");
const router = express.Router();
const { JwtMiddleware } = require("../middleware");
const Contact = require("../models").Contact;
const { ContactsController } = require("../controllers");
var check = [JwtMiddleware.verify(), JwtMiddleware.hasAnyRole(["CONTACT", "ADMIN"])];

/* Show the full list of contacts */
router.get("/", check, ContactsController.list);


/* Shows contact  */
router.get(["/:id", "/:id/view"], check, async (req, res) => {
  const contact = await Contact.findByPk(req.params.id);
  res.json(contact);
});

/* Posts a new contact to the database */
router.post(["/", "/new"], check, async (req, res) => {
  let contact;
  try {
    contact = await Contact.create(req.body);
    res.json(contact);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // checking the error
      contact = await Contact.build(req.body);
      res.json({
        contact,
        errors: error.errors
      });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
});

/* Updates contact info in the database */
router.put(["/:id","/:id/update"], check, async (req, res) => {
  let contact;
  try {
    contact = await Contact.findByPk(req.params.id);
    await contact.update(req.body);
    res.json(contact);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // checking the error
      contact = await Contact.build(req.body);
      res.json({
        contact,
        errors: error.errors
      });
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
});

/* Deletes a contact */
async function handleDelete (req, res) {
  const contact = await Contact.findByPk(req.params.id);
  await contact.destroy();
  
  res.json({msg: `Contact [${req.params.id}] has been deleted`});
}

router.get("/:id/delete", check, handleDelete);
router.delete("/:id", check, handleDelete);

module.exports = router;