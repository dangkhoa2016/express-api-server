var db = require("../server/models"); // import Sequelize

const { SeedService } = require("../server/services");
const fs = require("fs");

(async () => {
  try {
    fs.unlinkSync("./database/express-app.db");
    //file removed
  } catch (err) {
    console.error(err);
  }

  await db.sequelize.sync({ logging: false });

  await SeedService.create_data();
})();
