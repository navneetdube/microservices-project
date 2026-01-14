const sequelize = require("../../config/db");
const repo = require("./answer.repository");
const ERROR_CODES = require("../../constants/errorCodes");
const { ROLES, CHECKLIST_QUESTION_TYPE } = require("../../enums");

const parseAnswerValue = (value, type) => {
  if (value === null || value === undefined) return value;

  // BOOLEAN
  if (type === CHECKLIST_QUESTION_TYPE.BOOLEAN) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
  }

  if (type === CHECKLIST_QUESTION_TYPE.MULTI_SELECT) {
    if (Array.isArray(value)) return value;

    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}

    return [];
  }

  return value;
};

const serializeAnswer = (value) => {
  if (value === undefined || value === null) return null;

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};




exports.submitAnswers = async (orderId, checklistId, { answers }, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await repo.findOrderById(orderId);
    if (!order) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Order not found"
      };
    }

    if (loggedInUser.role !== ROLES.INSPECTION_MANAGER) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "Only inspection manager can submit answers"
      };
    }

    if (order.inspectionManagerId !== loggedInUser.id) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "This order is not assigned to you"
      };
    }

    const orderChecklist = await repo.findOrderChecklistByOrderId(orderId);
    if (
      !orderChecklist ||
      orderChecklist.checklistSnapshot.id !== Number(checklistId)
    ) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: "Checklist is not linked to this order"
      };
    }

    const checklistQuestions = orderChecklist.checklistSnapshot.ChecklistQuestions || [];

    const answerMap = new Map(
      answers.map(a => [String(a.questionId), a.answer])
    );

    for (const question of checklistQuestions.filter(q => q.required)) {
      const answer = answerMap.get(String(question.questionId));

      if (
        answer === undefined ||
        answer === null ||
        (Array.isArray(answer) && answer.length === 0) ||
        (typeof answer === "string" && answer.trim() === "")
      ) {
        await transaction.rollback();
        return {
          errorCode: ERROR_CODES.BAD_REQUEST,
          message: `Answer required for question: "${question.label}"`
        };
      }
    }

    for (const ans of answers) {
      const question = checklistQuestions.find(
        q => q.questionId === String(ans.questionId)
      );

      if (!question) {
        await transaction.rollback();
        return {
          errorCode: ERROR_CODES.NOT_FOUND,
          message: `Question ${ans.questionId} not found in checklist`
        };
      }

      const value = parseAnswerValue(ans.answer, question.type);

      // BOOLEAN
      if (question.type === CHECKLIST_QUESTION_TYPE.BOOLEAN) {
        if (typeof value !== "boolean") {
          await transaction.rollback();
          return {
            errorCode: ERROR_CODES.BAD_REQUEST,
            message: `Question "${question.label}" requires a boolean answer (true/false)`
          };
        }
      }

      if (question.type === CHECKLIST_QUESTION_TYPE.SINGLE_SELECT) {
        if (!question.options.includes(value)) {
          await transaction.rollback();
          return {
            errorCode: ERROR_CODES.BAD_REQUEST,
            message: `Invalid option for question "${question.label}"`
          };
        }
      }

      // MULTI SELECT
      if (question.type === CHECKLIST_QUESTION_TYPE.MULTI_SELECT) {
        if (!Array.isArray(value) || value.length === 0) {
          await transaction.rollback();
          return {
            errorCode: ERROR_CODES.BAD_REQUEST,
            message: `Question "${question.label}" requires multiple options`
          };
        }

        for (const opt of value) {
          if (!question.options.includes(opt)) {
            await transaction.rollback();
            return {
              errorCode: ERROR_CODES.BAD_REQUEST,
              message: `Invalid option "${opt}" for "${question.label}"`
            };
          }
        }
      }

      if (question.type === CHECKLIST_QUESTION_TYPE.IMAGE) {
        if (!value || typeof value !== "string") {
          await transaction.rollback();
          return {
            errorCode: ERROR_CODES.BAD_REQUEST,
            message: `Image is required for question "${question.label}"`
          };
        }
      }
    }

    for (const ans of answers) {
      const question = await repo.findQuestionByQuestionId(
        ans.questionId,
        Number(checklistId)
      );

      const existingAnswer = await repo.findAnswerByQuestionAndOrder(
        question.id,
        orderId
      );

      if (existingAnswer) {
        await repo.updateAnswer(
          existingAnswer.id,
          { answer: serializeAnswer(ans.answer) },
          transaction
        );
      } else {
        await repo.createAnswer(
          {
            orderId,
            questionId: question.id,
            answer: serializeAnswer(ans.answer)

          },
          transaction
        );
      }
    }

    await transaction.commit();

    return {
      success: true,
      message: "Checklist submitted successfully"
    };

  } catch (err) {
    await transaction.rollback();
    console.error("submitAnswers error:", err);

    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to submit answers"
    };
  }
};

exports.getAnswers = async (orderId, checklistId, loggedInUser) => {
  try {
    const order = await repo.findOrderById(orderId);
    if (!order) {
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Order not found"
      };
    }

    // if (loggedInUser.role === ROLES.INSPECTION_MANAGER) {
    //   if (order.inspectionManagerId !== loggedInUser.id) {
    //     return {
    //       errorCode: ERROR_CODES.FORBIDDEN,
    //       message: "This order is not assigned to you"
    //     };
    //   }
    // } else if (loggedInUser.role !== ROLES.ADMIN) {
    //   return {
    //     errorCode: ERROR_CODES.FORBIDDEN,
    //     message: "You don't have permission to view answers"
    //   };
    // }

    const answers = await repo.findAnswersByOrderAndChecklist(orderId, checklistId);
    
    return answers.map(a => ({
      id: a.id,
      questionId: a.questionId,
     label: a.ChecklistQuestion.label,
  type: a.ChecklistQuestion.type,
  options: a.ChecklistQuestion.options,
  required: a.ChecklistQuestion.required,
      answer: a.answer,
      imageUrl: a.imageUrl,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt
    }));
  } catch (err) {
    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to fetch answers"
    };
  }
};

exports.getAnswersByOrder = async (orderId, loggedInUser) => {
  try {
    const order = await repo.findOrderById(orderId);
    if (!order) {
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Order not found"
      };
    }

    if (loggedInUser.role === ROLES.INSPECTION_MANAGER) {
      if (order.inspectionManagerId !== loggedInUser.id) {
        return {
          errorCode: ERROR_CODES.FORBIDDEN,
          message: "This order is not assigned to you"
        };
      }
    } else if (loggedInUser.role !== ROLES.ADMIN) {
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "You don't have permission to view answers"
      };
    }

    const answers = await repo.findAnswersByOrder(orderId);
    
    return answers.map(a => ({
      id: a.id,
      questionId: a.questionId,
      label: a.ChecklistQuestion.label,
      type: a.ChecklistQuestion.type,
      checklistId: a.ChecklistQuestion.checklistId,
      answer: a.answer,
      imageUrl: a.imageUrl,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt
    }));
  } catch (err) {
    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to fetch answers"
    };
  }
};

exports.deleteAnswer = async (answerId, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    const answer = await repo.findAnswerById(answerId);
    
    if (!answer) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Answer not found"
      };
    }

    const order = await repo.findOrderById(answer.orderId);
    
    if (loggedInUser.role === ROLES.INSPECTION_MANAGER) {
      if (order.inspectionManagerId !== loggedInUser.id) {
        await transaction.rollback();
        return {
          errorCode: ERROR_CODES.FORBIDDEN,
          message: "This order is not assigned to you"
        };
      }
    } else if (loggedInUser.role !== ROLES.ADMIN) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "You don't have permission to delete answers"
      };
    }

    await repo.deleteAnswer(answerId, transaction);
    await transaction.commit();

    return { id: answerId, message: "Answer deleted successfully" };
  } catch (err) {
    await transaction.rollback();

    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to delete answer"
    };
  }
};
