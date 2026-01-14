const ERROR_CODES = require("../constants/errorCodes");

const statusMap = {
  
  SUCCESS: 200,
  CREATED: 201,

  
  [ERROR_CODES.BAD_REQUEST]: 400,
  [ERROR_CODES.VALIDATION_ERROR]: 400,
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.CONFLICT]: 409,

  
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 500
};

exports.sendResponse = (res, payload = {}) => {
  if (payload.errorCode) {
    const status = statusMap[payload.errorCode] || 400;

    return res.status(status).json({
      success: false,
      errorCode: payload.errorCode,
      message: payload.message
    });
  }

  const status = payload.status || statusMap.SUCCESS;

  return res.status(status).json({
    success: true,
    message: payload.message,
    data: payload.data
  });
};
