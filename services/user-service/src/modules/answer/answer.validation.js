const { body } = require("express-validator");
const { CHECKLIST_QUESTION_TYPE } = require("../../enums");

exports.submitAnswers = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isInt({ min: 1 })
    .withMessage("Valid orderId is required"),

  body("checklistId")
    .notEmpty()
    .withMessage("Checklist ID is required")
    .isInt({ min: 1 })
    .withMessage("Valid checklistId is required"),

  body("answers")
    .isArray({ min: 1 })
    .withMessage("At least one answer is required"),

  body("answers.*.questionId")
    .notEmpty()
    .withMessage("Question ID is required")
    .isString()
    .withMessage("Valid questionId is required"),

  body("answers.*.answer")
    .optional()
    .trim()
    .escape(),

  body("answers.*.imageUrl")
    .optional()
    .trim()
];

exports.submitSingleAnswer = [
  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isInt({ min: 1 })
    .withMessage("Valid orderId is required"),

  body("questionId")
    .notEmpty()
    .withMessage("Question ID is required")
    .isString()
    .withMessage("Valid questionId is required"),

  body("answer")
    .optional()
    .trim()
    .escape()
];

exports.getAnswers = [
  // Order ID and Checklist ID validation handled via route params
];
