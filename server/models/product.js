'use strict';

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for the product name',
        },
      },
    },
    summary: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please provide a value for the product summary",
        },
      },
    },
    content: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please provide a value for the product content",
        },
      },
    },
    photos: DataTypes.STRING,//json
    stock: DataTypes.INTEGER,
    order_count: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    view_count: DataTypes.INTEGER,
    like_count: DataTypes.INTEGER,
    thumb: DataTypes.STRING,
  }, {
      tableName: 'Products'
    });


  // set up the associations so we can make queries that include
  // the related objects
  Product.associate = function({ User }) {
    Product.belongsTo(User);
  };

  return Product;
};