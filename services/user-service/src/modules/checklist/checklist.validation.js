const { body } = require("express-validator");
const { CHECKLIST_QUESTION_TYPE } = require("../../enums");

exports.createChecklist = [
  body("name")
    .notEmpty()
    .withMessage("Checklist name is required")
    .trim()
    .escape(),

  body("description")
    .optional()
    .trim()
    .escape(),

  body("questions")
    .isArray({ min: 3 })
    .withMessage("Minimum 3 questions are required"),

  body("questions.*.id")
    .notEmpty()
    .withMessage("Question ID (q1, q2, etc.) is required")
    .trim()
    .escape(),

  body("questions.*.label")
    .notEmpty()
    .withMessage("Question label is required")
    .trim()
    .escape(),

  body("questions.*.type")
    .notEmpty()
    .withMessage("Question type is required")
    .isIn(Object.values(CHECKLIST_QUESTION_TYPE))
    .withMessage("Invalid question type"),

  body("questions.*.required")
    .optional()
    .isBoolean()
    .withMessage("required must be a boolean"),

  body("questions.*.options")
    .optional()
    .isArray()
    .withMessage("Options must be an array")
];

exports.updateChecklist = [
  body("name")
    .optional()
    .trim()
    .escape(),

  body("description")
    .optional()
    .trim()
    .escape(),

  body("questions")
    .optional()
    .isArray({ min: 3 })
    .withMessage("Minimum 3 questions are required"),

  body("questions.*.id")
    .if((value, { req }) => req.body.questions)
    .notEmpty()
    .withMessage("Question ID is required")
    .trim()
    .escape(),

  body("questions.*.label")
    .if((value, { req }) => req.body.questions)
    .notEmpty()
    .withMessage("Question label is required")
    .trim()
    .escape(),

  body("questions.*.type")
    .if((value, { req }) => req.body.questions)
    .notEmpty()
    .withMessage("Question type is required")
    .isIn(Object.values(CHECKLIST_QUESTION_TYPE))
    .withMessage("Invalid question type"),

  body("questions.*.required")
    .if((value, { req }) => req.body.questions)
    .optional()
    .isBoolean()
    .withMessage("required must be a boolean"),

  body("questions.*.options")
    .if((value, { req }) => req.body.questions)
    .optional()
    .isArray()
    .withMessage("Options must be an array")
];

exports.submitChecklist = [
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
    .isInt({ min: 1 })
    .withMessage("Valid questionId is required"),

  body("answers.*.answer")
    .optional()
];

exports.submitChecklistWithFile = [
  body("questionId")
    .notEmpty()
    .withMessage("Question ID is required")
    .isInt({ min: 1 })
    .withMessage("Valid questionId is required"),

  body("answer")
    .optional()
    .trim()
    .escape()
];