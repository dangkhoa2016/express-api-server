"use strict";

module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        field: "user_id",
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        field: "role_id",
        allowNull: false,
      }
    },
    {
      timestamps: false,
      tableName: "UserRoles"
    }
  );

  UserRole.associate = function(models) {
    // associations can be defined here
  };

  return UserRole;
};
