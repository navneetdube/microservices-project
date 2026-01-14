const { Checklist, ChecklistQuestion, ChecklistAnswer, Order, OrderChecklist } = require("../../models");

exports.create = (data, transaction) => {
  return Checklist.create({
    name: data.name,
    description: data.description || null
  }, { transaction });
};

exports.findById = (id) => {
  return Checklist.findByPk(id, {
    include: [
      {
        association: "ChecklistQuestions",
        model: ChecklistQuestion,
        attributes: ["id", "questionId", "label", "type", "options", "required"]
      }
    ]
  });
};

exports.findAll = () => {
  return Checklist.findAll({
    include: [
      {
        association: "ChecklistQuestions",
        model: ChecklistQuestion,
        attributes: ["id", "questionId", "label", "type", "options", "required"]
      }
    ]
  });
};

exports.updateById = (id, data, transaction) => {
  const updateData = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.version !== undefined) updateData.version = data.version;

  return Checklist.update(updateData, {
    where: { id },
    transaction,
    returning: true
  });
};

exports.delete = (id, transaction) => {
  return Checklist.destroy({
    where: { id },
    transaction
  });
};

exports.createQuestion = (data, transaction) => {
  return ChecklistQuestion.create({
    checklistId: data.checklistId,
    questionId: data.questionId,
    label: data.label,
    type: data.type,
    options: data.options || null,
    required: data.required || false
  }, { transaction });
};

exports.findQuestionById = (id) => {
  return ChecklistQuestion.findByPk(id);
};

exports.updateQuestion = (id, data, transaction) => {
  const updateData = {};
  
  if (data.label !== undefined) updateData.label = data.label;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.options !== undefined) updateData.options = data.options;
  if (data.required !== undefined) updateData.required = data.required;

  return ChecklistQuestion.update(updateData, {
    where: { id },
    transaction,
    returning: true
  });
};

exports.deleteQuestion = (id, transaction) => {
  return ChecklistQuestion.destroy({
    where: { id },
    transaction
  });
};

exports.deleteQuestionsByChecklistId = (checklistId, transaction) => {
  return ChecklistQuestion.destroy({
    where: { checklistId },
    transaction
  });
};

exports.createAnswer = (data, transaction) => {
  return ChecklistAnswer.create({
    orderId: data.orderId,
    questionId: data.questionId,
    answer: data.answer || null,
    imageUrl: data.imageUrl || null
  }, { transaction });
};

exports.findAnswersByOrderId = (orderId) => {
  return ChecklistAnswer.findAll({
    where: { orderId },
    include: [
      {
        model: ChecklistQuestion,
        attributes: ["id", "question", "type", "options", "isRequired"]
      }
    ]
  });
};

exports.findAnswersByChecklistId = (checklistId, orderId) => {
  return ChecklistAnswer.findAll({
    include: [
      {
        model: ChecklistQuestion,
        where: { checklistId },
        attributes: ["id", "question", "type", "options", "isRequired"]
      }
    ],
    where: { orderId }
  });
};

exports.deleteAnswersByOrderId = (orderId, transaction) => {
  return ChecklistAnswer.destroy({
    where: { orderId },
    transaction
  });
};
exports.updateAnswer = (id, data, transaction) => {
  const updateData = {};
  
  if (data.answer !== undefined) updateData.answer = data.answer;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;

  return ChecklistAnswer.update(updateData, {
    where: { id },
    transaction,
    returning: true
  });
};

exports.findAnswerByQuestionAndOrder = (questionId, orderId) => {
  return ChecklistAnswer.findOne({
    where: { questionId, orderId },
    include: [
      {
        model: ChecklistQuestion,
        attributes: ["id", "question", "type", "options", "isRequired"]
      }
    ]
  });
};

exports.findOrderById = (orderId) => {
  return Order.findByPk(orderId);
};

exports.findOrderChecklistByOrderId = (orderId) => {
  return OrderChecklist.findOne({
    where: { orderId }
  });
};