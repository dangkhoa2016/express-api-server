
var db = require('../server/models'); // import Sequelize

// const jwt = require('../services').JwtService;
const { JwtService } = require('../server/services');
const { UsersManager } = require('../server/managers');


(async () => {
  await db.sequelize.sync({ logging: false });
  
  // await Test();

  await Test3();
  
  // await All_UserRole();
})();

async function Test3() {
  var x = await db.User.findAndCountAll({});
  console.log(x);
}

async function All_UserRole() {
  // await db.UserRole.destroy({ where: { user_id: 5 } });
  var x = await db.UserRole.findAll();
  console.log(x);
}

async function Test() {
  var user = null;
  try {
    user = await UsersManager.findOne('user5');
  } catch (e) {
    // Deal with the fact the chain failed
    console.log(e)
  }
  await user.setRoles( [] );
  
  var roles = await user.getRoles();
  if (!roles || roles.length === 0) {
    console.log('create roles');
    await user.setRoles( [2] );

    roles = await user.getRoles();
  }
  console.log('roles', roles);
  
  
  
  var user = null;
  try {
    user = await UsersManager.findById('5');
  } catch (e) {
    // Deal with the fact the chain failed
    console.log(e)
  }
  
  console.log('user', user);
}