const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { CHECKLIST_QUESTION_TYPE } = require("../enums/index");

const ChecklistQuestion = sequelize.define("ChecklistQuestion", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  label: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM(...Object.values(CHECKLIST_QUESTION_TYPE)),
    allowNull: false
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "checklist_questions",
  timestamps: true
});


ChecklistQuestion.associate = (models) => {
  ChecklistQuestion.belongsTo(models.Checklist, { foreignKey: "checklistId" });
  ChecklistQuestion.hasMany(models.ChecklistAnswer, { foreignKey: "questionId" });
};

module.exports = ChecklistQuestion;
