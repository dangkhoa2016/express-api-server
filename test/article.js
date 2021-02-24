
var db = require('../server/models'); // import Sequelize
const {ArticlesManager} = require('../server/managers');

(async () => {
  await db.sequelize.sync({ logging: false });

  var x = null;
  try {
    x = await ArticlesManager.findAndCount();
  } catch (e) {
    // Deal with the fact the chain failed
    console.log(e)
  }

  console.log(x);
})();
