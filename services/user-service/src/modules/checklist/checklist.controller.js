const service = require("./checklist.service");
const runValidation = require("../../utils/runValidation");
const validation = require("./checklist.validation");
const { sendResponse } = require("../../utils/errorResponse");

exports.createChecklist = async (req, res) => {
  try {
    const validationError = await runValidation(req, validation.createChecklist);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    const result = await service.createChecklist(req.body, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Checklist created successfully",
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

exports.getChecklistById = async (req, res) => {
  try {
    const { checklistId } = req.params;

    const result = await service.getChecklistById(checklistId, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Checklist fetched successfully",
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

exports.getAllChecklists = async (req, res) => {
  try {
    const result = await service.getAllChecklists(req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Checklists fetched successfully",
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

exports.updateChecklist = async (req, res) => {
  try {
    const validationError = await runValidation(req, validation.updateChecklist);
    if (validationError) {
      return sendResponse(res, validationError);
    }

    const { checklistId } = req.params;

    const result = await service.updateChecklist(checklistId, req.body, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Checklist updated successfully",
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

exports.deleteChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;

    const result = await service.deleteChecklist(checklistId, req.user);

    if (result?.errorCode) {
      return sendResponse(res, result);
    }

    return sendResponse(res, {
      data: result,
      message: "Checklist deleted successfully",
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

