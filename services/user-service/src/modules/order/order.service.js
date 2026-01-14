const sequelize = require("../../config/db");
const repo = require("./order.repository");
const ERROR_CODES = require("../../constants/errorCodes");
const { ROLES } = require("../../enums");
const { User } = require("../../models");

exports.createOrder = async (data, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    // if (loggedInUser.role !== ROLES.PROCUREMENT_MANAGER) {
    //   return {
    //     errorCode: ERROR_CODES.FORBIDDEN,
    //     message: "Only procurement manager can create orders"
    //   };
    // }

    // validate client exists
    if (!data.clientId) {
      return {
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: "clientId is required"
      };
    }

    const client = await User.findByPk(data.clientId);
    if (!client) {
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Client not found"
      };
    }

    if (client.role !== ROLES.CLIENT) {
      return {
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: "Selected user does not have CLIENT role"
      };
    }

    if (client.createdBy !== loggedInUser.id) {
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "This client does not belong to your organization"
      };
    }

    data.procurementManagerId = loggedInUser.id;
    data.createdBy = loggedInUser.id;

    const order = await repo.create(data, transaction);
    await transaction.commit();

    const createdOrder = await repo.findById(order.id);
    return createdOrder.dataValues;
  } catch (err) {
    await transaction.rollback();

    if (err.name === "SequelizeValidationError") {
      return {
        errorCode: ERROR_CODES.VALIDATION_ERROR,
        message: err.errors.map(e => e.message).join(", ")
      };
    }

    if (err.name === "SequelizeForeignKeyConstraintError") {
      return {
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: "Invalid client reference"
      };
    }

    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to create order"
    };
  }
};

exports.getOrderStatus = async (orderId, loggedInUser) => {
  try {
    const order = await repo.findById(orderId);

    if (!order) {
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Order not found"
      };
    }

    // Check if user has permission to view order
    const canView = this.canViewOrder(order, loggedInUser);
    if (!canView) {
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "You don't have permission to view this order"
      };
    }

    return order.dataValues;
  } catch (err) {
    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to fetch order"
    };
  }
};

exports.getAllOrders = async (loggedInUser) => {
  try {
    const orders = await repo.findAll();

   
    const filteredOrders = orders.filter(order => 
      this.canViewOrder(order, loggedInUser)
    );

    return filteredOrders;
  } catch (err) {
    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to fetch orders"
    };
  }
};

exports.updateOrderStatus = async (orderId, { status }, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await repo.findById(orderId);

    if (!order) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Order not found"
      };
    }

   
    // const canUpdate = this.canUpdateOrderStatus(order, loggedInUser);
    // if (!canUpdate) {
    //   await transaction.rollback();
    //   return {
    //     errorCode: ERROR_CODES.FORBIDDEN,
    //     message: "You don't have permission to update this order"
    //   };
    // }

    await repo.updateById(orderId, { status, updatedBy: loggedInUser.id }, transaction);
    await transaction.commit();

    const updatedOrder = await repo.findById(orderId);
    return updatedOrder.dataValues;
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
      message: err.message || "Failed to update order status"
    };
  }
};

exports.linkChecklistToOrder = async (orderId, { checklistId }, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    // if (loggedInUser.role !== ROLES.PROCUREMENT_MANAGER) {
    //   await transaction.rollback();
    //   return {
    //     errorCode: ERROR_CODES.FORBIDDEN,
    //     message: "Only procurement manager can link checklists to orders"
    //   };
    // }

    const order = await repo.findById(orderId);
    if (!order) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Order not found"
      };
    }

    const checklist = await repo.findChecklistById(checklistId);
    if (!checklist) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Checklist not found"
      };
    }

    const existingChecklist = await repo.getOrderChecklist(orderId);
    if (existingChecklist) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.CONFLICT,
        message: "Checklist is already linked to this order"
      };
    }

    await repo.linkChecklist(orderId, checklistId, transaction);
    await transaction.commit();

    const linkedChecklist = await repo.getOrderChecklist(orderId);
    return linkedChecklist.dataValues;
  } catch (err) {
    await transaction.rollback();

    return {
      errorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: err.message || "Failed to link checklist"
    };
  }
};

exports.canViewOrder = (order, user) => {
  const { ADMIN, INSPECTION_MANAGER, PROCUREMENT_MANAGER, CLIENT } = ROLES;
  const viewerRole = user.role;

  // Admin and procurement manager can see all orders
  if ([ADMIN, PROCUREMENT_MANAGER].includes(viewerRole)) {
    return true;
  }

  // Inspection manager can see orders assigned to them
  if (viewerRole === INSPECTION_MANAGER && order.inspectionManagerId === user.id) {
    return true;
  }

  if (viewerRole === CLIENT && order.clientId === user.id) {
    return true;
  }

  return false;
};

exports.canUpdateOrderStatus = (order, user) => {
  const { ADMIN, INSPECTION_MANAGER, PROCUREMENT_MANAGER } = ROLES;
  const updaterRole = user.role;

 
  return [ADMIN, INSPECTION_MANAGER, PROCUREMENT_MANAGER].includes(updaterRole);
};

exports.updateInspectionManager = async (orderId, { inspectionManagerId }, loggedInUser) => {
  const transaction = await sequelize.transaction();

  try {
    if (loggedInUser.role !== ROLES.PROCUREMENT_MANAGER) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "Only procurement manager can assign inspection manager"
      };
    }

    const order = await repo.findById(orderId);

    if (!order) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Order not found"
      };
    }

   
    if (order.procurementManagerId !== loggedInUser.id) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.FORBIDDEN,
        message: "This order does not belong to your organization"
      };
    }

    
    const inspectionManager = await User.findByPk(inspectionManagerId);
    if (!inspectionManager) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.NOT_FOUND,
        message: "Inspection manager not found"
      };
    }

    if (inspectionManager.role !== ROLES.INSPECTION_MANAGER) {
      await transaction.rollback();
      return {
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: "selected user does not have INSPECTION_MANAGER role"
      };
    }

    await repo.updateById(orderId, { inspectionManagerId, updatedBy: loggedInUser.id }, transaction);
    await transaction.commit();

    const updatedOrder = await repo.findById(orderId);
    return updatedOrder.dataValues;
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
      message: err.message || "Failed to assign inspection manager"
    };
  }
};