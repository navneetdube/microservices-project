const bcrypt = require("bcryptjs");
const repo = require("./user.repository");
const ERROR_CODES = require("../../constants/errorCodes");
const sequelize = require("../../config/db");
const { ROLES } = require("../../enums");


exports.register = async (data, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    if (
      loggedInUser.role === "PROCUREMENT_MANAGER" &&
      data.role === "INSPECTION_MANAGER"
    ) {
      const exists = await repo.findByMobile(data.mobile);
      if (exists) {
        throw new Error("Inspection Manager already exists. Contact admin");
      }

      data.procurementManagerId = loggedInUser.id;
    }

    const roleId = await repo.findRoleIdByName(data.role);
    data.roleId = roleId;
    data.createdBy = loggedInUser.id;
    data.password = await bcrypt.hash(data.password, 10);

    const user = await repo.create(data, transaction);
    
    await transaction.commit();

    return user.dataValues;
  } catch (err) {
   await transaction.rollback();
   if (err.name === "SequelizeUniqueConstraintError") {
    return {
      errorCode: ERROR_CODES.CONFLICT,
      message: err.errors?.[0]?.message || "Duplicate value"
    };
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return {
      errorCode: ERROR_CODES.BAD_REQUEST,
      message: "Invalid reference data"
    };
  }

  if (err.name === "SequelizeValidationError") {
    return {
      errorCode: ERROR_CODES.VALIDATION_ERROR,
      message: err.errors.map(e => e.message).join(", ")
    };
  }

    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Internal error"
    };
  }


};

exports.assignInspectionManager = async (
  adminUser,
  inspectionManagerId,
  procurementManagerId
) => {


  const im = await repo.findInspectionManager(inspectionManagerId);
  if (!im) {
    return {
      errorCode: ERROR_CODES.NOT_FOUND,
      message: "Inspection Manager not found"
    };
  }

  if (procurementManagerId) {
    const pm = await repo.findProcurementManager(procurementManagerId);
    if (!pm) {
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Procurement Manager not found"
      };
    }
  }

  await repo.assignInspectionManager(
    inspectionManagerId,
    procurementManagerId ? procurementManagerId : adminUser.id
  );

  return { success: true };
};

exports.getInspectionManagers = async (loggedInUser) => {
    try {
//   if (
//     ![ROLES.ADMIN, ROLES.PROCUREMENT_MANAGER].includes(loggedInUser.role)
//   ) {
//     return {
//       errorCode: ERROR_CODES.FORBIDDEN,
//       message: "You are not allowed to view inspection managers"
//     };
//   }

  if (loggedInUser.role === ROLES.ADMIN) {
    return await repo.findInspectionManagers(loggedInUser.id);
  }

  return await repo.findInspectionManagersByProcurementManager(
    loggedInUser.id
  );

    } catch (err) {
    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Internal error"
    };
  }
};
