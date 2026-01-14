const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Order = require("./order.model");


const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER, // stored in rupees
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);



module.exports = Product;
