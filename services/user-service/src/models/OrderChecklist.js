const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrderChecklist = sequelize.define("OrderChecklist", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  checklistSnapshot: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: "order_checklists",
  timestamps: true
});

OrderChecklist.associate = (models) => {
  OrderChecklist.belongsTo(models.Order, { foreignKey: "orderId" });
};

module.exports = OrderChecklist;
