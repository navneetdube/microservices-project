const service = require("./user.service");
const { sendResponse } = require("../../utils/errorResponse");
const ERROR_CODES = require("../../constants/errorCodes");
const runValidation = require("../../utils/runValidation")
const validation = require("./user.validation");


exports.register = async (req, res) => {
  try {
    const validationError = await runValidation(req, validation.register);
  if (validationError) {
    return sendResponse(res, validationError); 
  }
    const result = await service.register(req.body, req.user);

    
      if (result?.errorCode) {
      return sendResponse(res, result); 
    }

    return sendResponse(res, {
      data: result,
      message:"Successfully created",
      status: 201
    });

  } catch (err) {
    console.log(" ~ err:", err)
     return sendResponse(res, {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Something went wrong"
    });
  }
};

exports.assignInspectionManager = async (req, res) => {
    try {
    const validationError = await runValidation(req, validation.assignInspectionManager);
  if (validationError) {
    return sendResponse(res, validationError); 
  }

  const { inspectionManagerId, procurementManagerId } = req.body;

  const result = await service.assignInspectionManager(
    req.user,
    inspectionManagerId,
    procurementManagerId
  );

  if (result?.errorCode) {
    return sendResponse(res, result);
  }

  return sendResponse(res, {
    message: procurementManagerId
      ? "Inspection Manager assigned successfully"
      : "Inspection Manager unassigned successfully"
  });

  } catch (err) {
     return sendResponse(res, {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Something went wrong"
    });
  }
};

exports.getInspectionManagers = async (req, res) => {
  try {
    const result = await service.getInspectionManagers(req.user);

    if (result.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      status: 200,
      data: result
    });
  } catch (err) {
    return sendResponse(res, {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Failed to fetch inspection managers"
    });
  }
};
