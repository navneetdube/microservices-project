const express = require("express");
const router = express.Router();
const controller = require("./user.controller");
const auth = require("../../middlewares/auth.middleware");
const rbacGuard = require("../../middlewares/rbac.guard");


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 */

router.post(
  "/register",
  auth,
  rbacGuard("USER", "CREATE"),
  controller.register
);

/**
 * @swagger
 * /users/assign-inspection-manager:
 *   post:
 *     summary: Assign or unassign inspection manager (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                 example: 12
 *               procurementManagerId:
 *                 type: integer
 *                 nullable: true
 *                 example: 5
 *           examples:
 *             assign:
 *               summary: Assign Inspection Manager to Procurement Manager
 *               value:
 *                 inspectionManagerId: 12
 *                 procurementManagerId: 5
 *             unassign:
 *               summary: Unassign Inspection Manager (works under Admin)
 *               value:
 *                 inspectionManagerId: 12
 *                 procurementManagerId: null
 *     responses:
 *       200:
 *         description: Inspection manager assignment updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */

router.post(
  "/assign-inspection-manager",
  auth,
  rbacGuard("USER", "CREATE"),
  controller.assignInspectionManager
);


/**
 * @swagger
 * /users/inspection-managers:
 *   get:
 *     summary: Get inspection managers (scoped by role)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inspection managers
 *       403:
 *         description: Forbidden
 */
router.get(
  "/inspection-managers",
  auth,
    rbacGuard("USER", "READ"),
  controller.getInspectionManagers
);

module.exports = router;
