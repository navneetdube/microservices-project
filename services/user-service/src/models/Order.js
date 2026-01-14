const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { ORDER_STATUS } = require("../enums/index");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: "INR"
  },
  createdBy: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  updatedBy: {
    type: DataTypes.BIGINT
  },
  status: {
    type: DataTypes.ENUM(...Object.values(ORDER_STATUS)),
    defaultValue: ORDER_STATUS.CREATED
  },
  inspectionManagerId: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: "orders",
  timestamps: true
});

Order.associate = (models) => {
  Order.belongsTo(models.User, { as: "Client", foreignKey: "clientId" });
  Order.belongsTo(models.User, { as: "ProcurementManager", foreignKey: "procurementManagerId" });
  Order.belongsTo(models.User, { as: "InspectionManager", foreignKey: "inspectionManagerId" });

  Order.hasOne(models.OrderChecklist, { foreignKey: "orderId" });
  Order.hasMany(models.ChecklistAnswer, { foreignKey: "orderId" });
};

module.exports = Order;
