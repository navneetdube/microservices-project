const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { ACTIONS } = require("../constants/actions");

const RoleModulePermission = sequelize.define("RoleModulePermission", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  actions: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: "role_module_permissions",
  timestamps: false
});

RoleModulePermission.associate = (models) => {
  RoleModulePermission.belongsTo(models.Role, {
    foreignKey: "roleId"
  });

  RoleModulePermission.belongsTo(models.Module, {
    foreignKey: "moduleId"
  });
};

module.exports = RoleModulePermission;
