const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./product.model");


const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "PAID", "FAILED"),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }

);





module.exports = Order;
