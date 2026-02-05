const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/errorResponse");
const ERROR_CODES  = require('../constants/errorCodes')


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("🚀 ~ token:", token)
    if (!token)  {
      return sendResponse(res, {
        errorCode: ERROR_CODES.UNAUTHORIZED,
        message: "Authentication token missing"
      });

    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    console.log("🚀 ~ decoded:", decoded)
    req.user = decoded;
    next();
  } catch (err) {
   console.log("🚀 ~ err:", err.message)
   return sendResponse(res, {
      errorCode: ERROR_CODES.UNAUTHORIZED,
      message: "Invalid or expired token"
    });
  }
};
