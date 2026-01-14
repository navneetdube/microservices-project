const { User,Role } = require("../../models");
const { ROLES } = require("../../enums");

exports.create = (data, transaction) => {
  return User.create(data, { transaction });
};

exports.findRoleIdByName = async (roleName) => {
 const role = await Role.findOne({ where: { name: roleName } });
  return role ? role.id : null;
}

exports.findById = (id) => User.findByPk(id);

exports.findInspectionManager = (id) =>
  User.findOne({
    where: { id, role: "INSPECTION_MANAGER" }
  });

exports.findProcurementManager = (id) =>
  User.findOne({
    where: { id, role: "PROCUREMENT_MANAGER" }
  });

exports.assignInspectionManager = (id, procurementManagerId) =>
  User.update(
    { createdBy: procurementManagerId },
    { where: { id } }
  );


  exports.findInspectionManagers = (id) => {
  return User.findAll({
    where: { role: ROLES.INSPECTION_MANAGER, createdBy: id },
    attributes: ["id", "name", "email", "mobile"],
    include: [
      {
        model: Role,
    as: "Role",
    attributes: ["id", "name"]
      }
    ]
  });
};

exports.findInspectionManagersByProcurementManager = (procurementManagerId) => {
  return User.findAll({
    where: {
      role: ROLES.INSPECTION_MANAGER,
      createdBy: procurementManagerId
    },
    attributes: ["id", "name", "email", "mobile"],
    include: [
      {
    model: Role,
    as: "Role",
    attributes: ["id", "name"]

      }
    ]
  });
};