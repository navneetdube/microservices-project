const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/errorResponse");
const ERROR_CODES  = require('../constants/errorCodes')


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)  {
      return sendResponse(res, {
        errorCode: ERROR_CODES.UNAUTHORIZED,
        message: "Authentication token missing"
      });

    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
   return sendResponse(res, {
      errorCode: ERROR_CODES.UNAUTHORIZED,
      message: "Invalid or expired token"
    });
  }
};
