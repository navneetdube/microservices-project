const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Checklist = sequelize.define("Checklist", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: "checklists",
  timestamps: true
});

Checklist.associate = (models) => {
  Checklist.hasMany(models.ChecklistQuestion, { 
    foreignKey: "checklistId"
  });
};

module.exports = Checklist;
