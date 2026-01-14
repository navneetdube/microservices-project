const { body, param } = require("express-validator");
const { ROLES } = require("../../enums");


exports.register = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),

  body("mobile")
    .optional()
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(ROLES)
    .withMessage("Invalid role")
];



exports.assignInspectionManager = [
  body("inspectionManagerId")
    .notEmpty()
    .withMessage("inspectionManagerId is required")
    .isInt({ min: 1 })
    .withMessage("Valid inspectionManagerId is required"),

  body("procurementManagerId")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null) return true; 
      if (!Number.isInteger(value) || value < 1) {
        throw new Error("Valid procurementManagerId is required");
      }
      return true;
    })
];

/**
 * LOGIN (Single API)
 * - Admin / PM / Client → email + password
 * - Inspection Manager → mobile + password
 */
exports.login = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required"),

  body("mobile")
    .optional()
    .isLength({ min: 10, max: 15 })
    .withMessage("Valid mobile number is required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  body()
    .custom((value) => {
      if (!value.email && !value.mobile) {
        throw new Error("Either email or mobile is required");
      }
      return true;
    })
];

/**
 * GET USER BY ID
 */
exports.getById = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Valid userId is required")
];
