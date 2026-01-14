const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Module = sequelize.define("Module", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: "modules",
  timestamps: false
});

Module.associate = (models) => {
  Module.hasMany(models.RoleModulePermission, {
    foreignKey: "moduleId"
  });
};

module.exports = Module;
