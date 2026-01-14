const sequelize = require("../../config/db");
const repo = require("./checklist.repository");
const ERROR_CODES = require("../../constants/errorCodes");
const { ROLES, CHECKLIST_QUESTION_TYPE } = require("../../enums");

exports.createChecklist = async (data, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    // if (loggedInUser.role !== ROLES.ADMIN) {
    //   await transaction.rollback();
    //   return {
    //     errorCode: ERROR_CODES.FORBIDDEN,
    //     message: "Only admin can create checklists"
    //   };
    // }

    if (!data.questions || data.questions.length < 3) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: "Minimum 3 questions are required"
      };
    }

    const checklist = await repo.create({ 
      name: data.name,
      description: data.description || null
    }, transaction);

    for (const question of data.questions) {
      // Validate question type and options
      if (question.type === CHECKLIST_QUESTION_TYPE.SINGLE_SELECT || 
          question.type === CHECKLIST_QUESTION_TYPE.MULTI_SELECT) {
        if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
          await transaction.rollback();
          return {
            errorCode: ERROR_CODES.BAD_REQUEST,
            message: `Options are required for ${question.type} type questions`
          };
        }
      }

      await repo.createQuestion({
        checklistId: checklist.id,
        questionId: question.id,
        label: question.label,
        type: question.type,
        options: question.options || null,
        required: question.required || false
      }, transaction);
    }

    await transaction.commit();

    const createdChecklist = await repo.findById(checklist.id);
    return createdChecklist.dataValues;
  } catch (err) {
    await transaction.rollback();

    if (err.name === "SequelizeValidationError") {
      return {
        errorCode: ERROR_CODES.VALIDATION_ERROR,
        message: err.errors.map(e => e.message).join(", ")
      };
    }

    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to create checklist"
    };
  }
};

exports.getChecklistById = async (checklistId, loggedInUser) => {
  try {
    const checklist = await repo.findById(checklistId);

    if (!checklist) {
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Checklist not found"
      };
    }

    return checklist.dataValues;
  } catch (err) {
    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to fetch checklist"
    };
  }
};

exports.getAllChecklists = async (loggedInUser) => {
  try {
    const checklists = await repo.findAll();
    return checklists.map(c => c.dataValues);
  } catch (err) {
    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to fetch checklists"
    };
  }
};

exports.updateChecklist = async (checklistId, data, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    // if (loggedInUser.role !== ROLES.ADMIN) {
    //   await transaction.rollback();
    //   return {
    //     errorCode: ERROR_CODES.FORBIDDEN,
    //     message: "Only admin can update checklists"
    //   };
    // }

    const checklist = await repo.findById(checklistId);

    if (!checklist) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Checklist not found"
      };
    }

    if (data.name) {
      await repo.updateById(checklistId, { name: data.name }, transaction);
    }

    if (data.questions && Array.isArray(data.questions)) {
      if (data.questions.length === 0) {
        await transaction.rollback();
        return {
          errorCode: ERROR_CODES.BAD_REQUEST,
          message: "At least one question is required"
        };
      }

      await repo.deleteQuestionsByChecklistId(checklistId, transaction);

      for (const question of data.questions) {
        if (question.type === CHECKLIST_QUESTION_TYPE.DROPDOWN || 
            question.type === CHECKLIST_QUESTION_TYPE.MULTI_CHOICE) {
          if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
            await transaction.rollback();
            return {
              errorCode: ERROR_CODES.BAD_REQUEST,
              message: `Options are required for ${question.type} type questions`
            };
          }
        }

        await repo.createQuestion({
          checklistId: checklistId,
            id: question.id,
          label: question.label,
          type: question.type,
          options: question.options || null,
          isRequired: question.isRequired || false
        }, transaction);
      }
    }

    await transaction.commit();

    const updatedChecklist = await repo.findById(checklistId);
    return updatedChecklist.dataValues;
  } catch (err) {
    await transaction.rollback();

    if (err.name === "SequelizeValidationError") {
      return {
        errorCode: ERROR_CODES.VALIDATION_ERROR,
        message: err.errors.map(e => e.message).join(", ")
      };
    }

    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to update checklist"
    };
  }
};

exports.deleteChecklist = async (checklistId, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    if (loggedInUser.role !== ROLES.ADMIN) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "Only admin can delete checklists"
      };
    }

    const checklist = await repo.findById(checklistId);

    if (!checklist) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Checklist not found"
      };
    }

    await repo.deleteQuestionsByChecklistId(checklistId, transaction);

    await repo.delete(checklistId, transaction);

    await transaction.commit();

    return { id: checklistId, message: "Checklist deleted successfully" };
  } catch (err) {
    await transaction.rollback();

    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to delete checklist"
    };
  }
};
