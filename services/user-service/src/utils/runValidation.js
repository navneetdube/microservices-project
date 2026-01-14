const { validationResult } = require("express-validator");
const ERROR_CODES = require("../constants/errorCodes");

module.exports = async (req, validations) => {
  for (const validation of validations) {
    await validation.run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return {
      errorCode: ERROR_CODES.VALIDATION_ERROR,
      message: errors.array().map(e => e.msg).join(", ")
    };
  }

  return null;
};
