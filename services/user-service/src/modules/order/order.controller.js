const service = require("./order.service");
const runValidation = require("../../utils/runValidation");
const validation = require("./order.validation");
const { sendResponse } = require("../../utils/errorResponse");

exports.createOrder = async (req, res) => {
  try {
    const validationError = await runValidation(req, validation.create);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const result = await service.createOrder(req.body, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Order created successfully",
      status: 201
    });
  } catch (err) {
    console.log("~ err:", err);
    return sendResponse(res, {
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await service.getOrderStatus(orderId, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

   return sendResponse(res,{
      data: result,
      message: "Order details fetched successfully",
      status: 200
    });
  } catch (err) {
    console.log("~ err:", err);
    return sendResponse(res, {
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const result = await service.getAllOrders(req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res,{
      data: result,
      message: "Order list fetched successfully",
      status: 201
    });
  } catch (err) {
    console.log("~ err:", err);
    return sendResponse(res, {
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const validationError = await runValidation(req, validation.updateStatus);
    if (validationError) {
      return sendResponse(res, validationError);
    }

    const { orderId } = req.params;

    const result = await service.updateOrderStatus(orderId, req.body, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Order status updated successfully",
      status: 200
    });
  } catch (err) {
    console.log("~ err:", err);
    return sendResponse(res, {
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    });
  }
};

exports.linkChecklist = async (req, res) => {
  try {
    const validationError = await runValidation(req, validation.linkChecklist);
    if (validationError) {
      return sendResponse(res, validationError);
    }

    const { orderId } = req.params;

    const result = await service.linkChecklistToOrder(orderId, req.body, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Checklist linked successfully",
      status: 201
    });
  } catch (err) {
    console.log("~ err:", err);
    return sendResponse(res, {
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    });
  }
};

exports.updateInspectionManager = async (req, res) => {
  try {
    const validationError = await runValidation(req, validation.updateInspectionManager);
    if (validationError) {
      return sendResponse(res, validationError);
    }

    const { orderId } = req.params;

    const result = await service.updateInspectionManager(orderId, req.body, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Inspection manager assigned successfully",
      status: 200
    });
  } catch (err) {
    console.log("~ err:", err);
    return sendResponse(res, {
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong"
    });
  }
};