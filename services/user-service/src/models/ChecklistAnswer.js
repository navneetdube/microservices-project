const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ChecklistAnswer = sequelize.define("ChecklistAnswer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "checklist_answers",
  timestamps: true
});


ChecklistAnswer.associate = (models) => {
  ChecklistAnswer.belongsTo(models.Order, { foreignKey: "orderId" });
  ChecklistAnswer.belongsTo(models.ChecklistQuestion, { 
    foreignKey: "questionId"
  });
};

module.exports = ChecklistAnswer;
