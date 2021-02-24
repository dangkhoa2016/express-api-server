'use strict';

module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    full_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for the article title',
        },
      },
    },
    summary: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please provide a value for the article summary",
        },
      },
    },
    photos: DataTypes.STRING,//json
    status: DataTypes.STRING,
  }, {
      tableName: 'Contacts'
  });

  Contact.associate = function ({ User }) {
    Contact.belongsTo(User, {
      as: 'processor'
    });
  };

  return Contact;
};