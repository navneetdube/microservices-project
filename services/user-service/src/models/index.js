const User = require("./User");
const Order = require("./Order");
const Checklist = require("./Checklist");
const ChecklistQuestion = require("./ChecklistQuestion");
const OrderChecklist = require("./OrderChecklist");
const ChecklistAnswer = require("./ChecklistAnswer");
const Role = require("./Role");     
const Module = require("./Module");
const RoleModulePermission = require("./RoleModulePermission");

const models = {
  User,
  Order,
  Checklist,
  ChecklistQuestion,
  OrderChecklist,
  ChecklistAnswer,
  Role,
  Module,
  RoleModulePermission
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
