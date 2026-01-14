const { ChecklistAnswer, ChecklistQuestion, Checklist, Order } = require("../../models");

exports.createAnswer = (data, transaction) => {
  return ChecklistAnswer.create({
    orderId: data.orderId,
    questionId: data.questionId,
    answer: data.answer || null,
    imageUrl: data.imageUrl || null
  }, { transaction });
};

exports.findAnswerById = (id) => {
  return ChecklistAnswer.findByPk(id, {
    include: [
      {
        model: ChecklistQuestion,
        attributes: ["id", "questionId", "label", "type", "options", "required", "checklistId"]
      }
    ]
  });
};

exports.findAnswersByOrderAndChecklist = (orderId, checklistId) => {
  return ChecklistAnswer.findAll({
    where: { orderId },
    include: [
      {
        model: ChecklistQuestion,
        attributes: ["id", "questionId", "label", "type", "options", "required"],
        where: { checklistId }
      }
    ]
  });
};

exports.findAnswersByOrder = (orderId) => {
  return ChecklistAnswer.findAll({
    where: { orderId },
    include: [
      {
        model: ChecklistQuestion,
        attributes: ["id", "questionId", "label", "type", "options", "required", "checklistId"]
      }
    ]
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
        attributes: ["id", "questionId", "label", "type", "options", "required", "checklistId"]
      }
    ]
  });
};

exports.deleteAnswersByOrder = (orderId, transaction) => {
  return ChecklistAnswer.destroy({
    where: { orderId },
    transaction
  });
};

exports.deleteAnswer = (id, transaction) => {
  return ChecklistAnswer.destroy({
    where: { id },
    transaction
  });
};

exports.findChecklistById = (id) => {
  return Checklist.findByPk(id, {
    include: [
      {
        association: "ChecklistQuestions",
        attributes: ["id", "questionId", "label", "type", "options", "required"]
      }
    ]
  });
};

exports.findQuestionById = (id) => {
  return ChecklistQuestion.findByPk(id, {
    attributes: ["id", "questionId", "label", "type", "options", "required", "checklistId"]
  });
};

exports.findQuestionByQuestionId = (questionId, checklistId) => {
  return ChecklistQuestion.findOne({
    where: { questionId, checklistId },
    attributes: ["id", "questionId", "label", "type", "options", "required", "checklistId"]
  });
};

exports.findOrderById = (id) => {
  return Order.findByPk(id);
};

exports.findOrderChecklistByOrderId = (orderId) => {
  const OrderChecklist = require("../../models").OrderChecklist;
  return OrderChecklist.findOne({ where: { orderId } });
};
