const router = require("express").Router();
const controller = require("./order.controller");
const auth = require("../../middlewares/auth.middleware");
const rbacGuard = require("../../middlewares/rbac.guard");


// {
//   "email": "navneetdubey@gmail.com",
//   "password": "Admin@123"
// }


/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order Management APIs
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order (Procurement Manager only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - title
 *               - quantity
 *               - estimatedCost
 *             properties:
 *               clientId:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Office Supplies"
 *               description:
 *                 type: string
 *                 example: "Monthly office supplies order"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               estimatedCost:
 *                 type: number
 *                 format: decimal
 *                 example: 5000.00
 *               currency:
 *                 type: string
 *                 default: "INR"
 *                 example: "INR"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request or validation error
 *       403:
 *         description: Forbidden - Only procurement manager can create orders
 */
router.post("/", auth, rbacGuard("ORDER", "CREATE"), controller.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (visible to user based on role)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   estimatedCost:
 *                     type: number
 *                   currency:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdBy:
 *                     type: integer
 *                   updatedBy:
 *                     type: integer
 *       400:
 *         description: Bad request
 */
router.get("/", auth, rbacGuard("ORDER", "READ"), controller.getAllOrders);

/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                 estimatedCost:
 *                   type: number
 *                 currency:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdBy:
 *                   type: integer
 *                 updatedBy:
 *                   type: integer
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden - User doesn't have permission to view this order
 */
router.get("/:orderId", auth, rbacGuard("ORDER", "READ"), controller.getOrderStatus);

/**
 * @swagger
 * /orders/{orderId}/status:
 *   put:
 *     summary: Update order status (Admin, Inspection Manager, Procurement Manager)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CREATED, INSPECTION_PENDING, INSPECTED, CONFIRMED]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden - User doesn't have permission to update this order
 *       400:
 *         description: Bad request or validation error
 */
router.put("/:orderId/status", auth, rbacGuard("ORDER", "UPDATE"), controller.updateOrderStatus);

/**
 * @swagger
 * /orders/{orderId}/checklist:
 *   post:
 *     summary: Link checklist to order (Procurement Manager only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checklistId
 *             properties:
 *               checklistId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Checklist linked to order successfully
 *       404:
 *         description: Order or Checklist not found
 *       403:
 *         description: Forbidden - Only procurement manager can link checklists
 *       409:
 *         description: Conflict - Checklist already linked to this order
 */
router.post("/:orderId/checklist", auth, rbacGuard("ORDER", "CREATE"), controller.linkChecklist);

/**
 * @swagger
 * /orders/{orderId}/inspection-manager:
 *   put:
 *     summary: Assign inspection manager to order (Procurement Manager only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inspectionManagerId
 *             properties:
 *               inspectionManagerId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Inspection manager assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 inspectionManagerId:
 *                   type: integer
 *                 status:
 *                   type: string
 *       404:
 *         description: Order or Inspection Manager not found
 *       403:
 *         description: Forbidden - Only procurement manager can assign inspection manager
 *       400:
 *         description: Bad request or validation error
 */
router.put("/:orderId/inspection-manager", auth, rbacGuard("ORDER", "CREATE"), controller.updateInspectionManager);

module.exports = router;