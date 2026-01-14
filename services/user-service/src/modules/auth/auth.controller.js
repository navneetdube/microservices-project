const service = require("./auth.service");
const runValidation = require("../../utils/runValidation")
const validation = require("./auth.validation");
const { sendResponse } = require("../../utils/errorResponse");
const ERROR_CODES = require("../../constants/errorCodes");


exports.login = async (req, res) => {
  try {

    const validationError = await runValidation(req, validation.login);

  if (validationError) {
    return sendResponse(res, validationError);
  }
    const result = await service.login(req.body);
    return sendResponse(res, {
      data: result,
      message: "Login successful",
      status: 200
    });
  } catch (err) {
    return sendResponse(res, {
      errorCode: ERROR_CODES.UNAUTHORIZED,
      message: err.message || "Login failed"
    });
  }
};


