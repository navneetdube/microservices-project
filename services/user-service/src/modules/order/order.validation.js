const { body } = require("express-validator");
const { ORDER_STATUS } = require("../../enums");

exports.create = [
  body("clientId")
    .notEmpty()
    .withMessage("clientId is required")
    .isInt({ min: 1 })
    .withMessage("Valid clientId is required"),

  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .escape(),

  body("description")
    .optional()
    .trim()
    .escape(),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("estimatedCost")
    .notEmpty()
    .withMessage("Estimated cost is required"),
    // .isDecimal({ force_decimal: true, decimal_digits: "1,2" })
    // .withMessage("Estimated cost must be a valid decimal number"),

  body("currency")
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Currency must be valid")
];

exports.updateStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(Object.values(ORDER_STATUS))
    .withMessage("Invalid status value")
];

exports.linkChecklist = [
  body("checklistId")
    .isInt({ min: 1 })
    .withMessage("Valid checklistId is required")
];

exports.getById = [
  // Order ID validation handled via route params
];

exports.updateInspectionManager = [
  body("inspectionManagerId")
    .notEmpty()
    .withMessage("Inspection Manager ID is required")
    .isInt({ min: 1 })
    .withMessage("Valid inspectionManagerId is required")
];