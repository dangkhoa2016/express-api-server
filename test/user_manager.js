
var db = require('../server/models'); // import Sequelize
const { UsersManager } = require('../server/managers');

const { User, Role } = require('../server/models');

(async () => {
  await db.sequelize.sync({ logging: false });

  var x = await User.findAndCountAll({
      where: {},
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role'],
        through: { attributes: [] }
      }],
      attributes: {
        exclude: ['id', 'password']
      }, limit: 3, offset: 0
    });
    console.log(x)
})();
