const service = require("./answer.service");
const runValidation = require("../../utils/runValidation");
const validation = require("./answer.validation");
const { sendResponse } = require("../../utils/errorResponse");

exports.submitAnswers = async (req, res) => {
  try {
    const validationError = await runValidation(req, validation.submitAnswers);
    if (validationError) {
      return sendResponse(res, validationError);
    }

    const { orderId, checklistId } = req.body;

    const result = await service.submitAnswers(orderId, checklistId, req.body, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Answers submitted successfully",
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

exports.getAnswersByChecklistAndOrder = async (req, res) => {
  try {
    const { orderId, checklistId } = req.params;

    const result = await service.getAnswers(orderId, checklistId, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Answers fetched successfully",
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

exports.getAnswersByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await service.getAnswersByOrder(orderId, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "All answers for order fetched successfully",
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

exports.deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    const result = await service.deleteAnswer(answerId, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Answer deleted successfully",
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
