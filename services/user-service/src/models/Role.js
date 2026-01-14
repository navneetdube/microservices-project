const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Role = sequelize.define("Role", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: "roles",
  timestamps: false
});

Role.associate = (models) => {
    Role.hasMany(models.User, {
  foreignKey: "roleId"
});

  Role.hasMany(models.RoleModulePermission, {
    foreignKey: "roleId"
  });

};

module.exports = Role;
