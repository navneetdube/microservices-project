// const ERROR_CODES  = require('../constants/errorCodes')
// const { sendResponse } = require("../utils/errorResponse");


// const ROLE_MATRIX = {
//   ADMIN: ["PROCUREMENT_MANAGER", "INSPECTION_MANAGER", "CLIENT"],
//   PROCUREMENT_MANAGER: ["INSPECTION_MANAGER", "CLIENT"]
// };

// exports.createUser = (req, res, next) => {
//   try {
//     const creatorRole = req.user?.role; // from JWT token getting role
//     const targetRole = req.body?.role;  // from request body  taking creating user profile role

//     if (!creatorRole || !targetRole) {
//       return sendResponse(res, {
//         errorCode: ERROR_CODES.BAD_REQUEST,
//         message: "Creator role or target role missing"
//       });
//     }

//     const allowedTargets = ROLE_MATRIX[creatorRole];

//     if (!allowedTargets || !allowedTargets.includes(targetRole)) {
//       return sendResponse(res, {
//         errorCode: ERROR_CODES.FORBIDDEN,
//         message: `${creatorRole} is not allowed to create ${targetRole}`
//       });
//     }

//     next();
//   } catch (err) {
//     return sendResponse(res, {
//       errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
//       message: "Authorization check failed"
//     });
//   }
// };



const ERROR_CODES = require("../constants/errorCodes");
const { sendResponse } = require("../utils/errorResponse");
const { RoleModulePermission, Module } = require("../models");

/**
 * RBAC middleware
 * @param {string} moduleCode - ex: USER, ORDER, CHECKLIST
 * @param {string} action - ex: CREATE, READ, UPDATE, DELETE
 */
const rbacGuard = (moduleCode, action) => {
  return async (req, res, next) => {
    try {
      const roleId = req.user?.roleId; 
      if (!roleId) {
        return sendResponse(res, {
          errorCode: ERROR_CODES.UNAUTHORIZED,
          message: "Unauthorized"
        });
      }

      const permission = await RoleModulePermission.findOne({
        where: { roleId },
        include: [
          {
            model: Module,
            where: { code: moduleCode },
            attributes: ["code"]
          }
        ]
      });

      if (!permission) {
        return sendResponse(res, {
          errorCode: ERROR_CODES.FORBIDDEN,
          message: "Access denied"
        });
      }

      if (!permission.actions.includes(action)) {
        return sendResponse(res, {
          errorCode: ERROR_CODES.FORBIDDEN,
          message: `You do not have ${action} permission for ${moduleCode}`
        });
      }

      next();
    } catch (error) {
      console.error("RBAC error:", error);
      return sendResponse(res, {
        errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Authorization failed"
      });
    }
  };
};

module.exports = rbacGuard;
