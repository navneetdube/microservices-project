const { Order, OrderChecklist, Checklist } = require("../../models");

exports.create = (data, transaction) => {
  return Order.create({
    title: data.title,
    description: data.description,
    quantity: data.quantity,
    estimatedCost: data.estimatedCost,
    currency: data.currency,
    createdBy: data.createdBy,
    clientId: data.clientId,
    procurementManagerId: data.procurementManagerId
  }, { transaction });
};

exports.findById = (id) => {
  return Order.findByPk(id, {
    include: [
      { association: "Client", attributes: ["id", "name", "email", "mobile", "role"] },
      { association: "ProcurementManager", attributes: ["id", "name", "email", "mobile", "role"] },
      { association: "InspectionManager", attributes: ["id", "name", "email", "mobile", "role"] }
    ]
  });
};

exports.findAll = () => {
  return Order.findAll();
};

exports.updateById = (id, data, transaction) => {
  const updateData = {};
  
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.quantity !== undefined) updateData.quantity = data.quantity;
  if (data.estimatedCost !== undefined) updateData.estimatedCost = data.estimatedCost;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;
  if (data.inspectionManagerId !== undefined) updateData.inspectionManagerId = data.inspectionManagerId;

  return Order.update(updateData, {
    where: { id },
    transaction,
    returning: true
  });
};

exports.findChecklistById = (checklistId) => {
  return Checklist.findByPk(checklistId);
};

exports.linkChecklist = (orderId, checklistId, transaction) => {
  return Checklist.findByPk(checklistId, {
    include: {
      model: require("../../models").ChecklistQuestion,
      attributes: ["id", "questionId", "label", "type", "options", "required"]
    }
  }).then(checklist => {
    if (!checklist) return null;
    
    return OrderChecklist.create({
      orderId,
      checklistSnapshot: checklist.toJSON()
    }, { transaction });
  });
};

exports.getOrderChecklist = (orderId) => {
  return OrderChecklist.findOne({
    where: { orderId }
  });
};