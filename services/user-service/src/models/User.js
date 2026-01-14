const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { ROLES } = require("../enums/index");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  mobile: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM(...Object.values(ROLES)),
    allowNull: false
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: "users",
  timestamps: true
});

User.associate = (models) => {
  User.hasMany(models.Order, { as: "ClientOrders", foreignKey: "clientId" });
  User.hasMany(models.Order, { as: "ProcurementOrders", foreignKey: "procurementManagerId" });
  User.hasMany(models.Order, { as: "InspectionOrders", foreignKey: "inspectionManagerId" });
  User.belongsTo(models.Role, { as: "Role", foreignKey: "roleId" });
};

module.exports = User;