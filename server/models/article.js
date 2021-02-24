'use strict';

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
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
    content: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please provide a value for the article content",
        },
      },
    },
    thumb: DataTypes.STRING,
    status: DataTypes.STRING,
    view_count: DataTypes.INTEGER,
    like_count: DataTypes.INTEGER
  }, {
      tableName: 'Articles'
    });


  // set up the associations so we can make queries that include
  // the related objects
  Article.associate = function ({ User }) {
    Article.belongsTo(User, {
      as: 'author'
    });
  };

  return Article;
};