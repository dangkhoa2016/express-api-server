const bcrypt = require('bcrypt');
const saltRounds = 10;

async function generateHash(user) {
  if (user === null)
    return '';
  else if (!user.changed('password'))
    return user.password;
  else
    return await bcrypt.hash(user.password, saltRounds);
}

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
  }, {
      tableName: 'Users',
      hooks: {
        beforeCreate: async (user, options) => {
          user.password = await generateHash(user);
        },
        beforeUpdate: async (user, options) => {
          user.password = await generateHash(user);
        }
      },
      instanceMethods: {
        //define more
      }
    });

  User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  }

  User.prototype.logout = async function (token) {
  };


  // set up the associations so we can make queries that include
  // the related objects
  User.associate = function ({ Product, Article, Role, Contact }) {
    User.hasMany(Article);
    User.hasMany(Product);
    User.hasMany(Contact);

    User.belongsToMany(Role, {
      through: 'UserRole',
      as: 'roles',
      foreignKey: 'userId'
    });
  };

  return User;
};