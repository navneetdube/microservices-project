const router = require("express").Router();
const controller = require("./checklist.controller");
const auth = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const rbacGuard = require("../../middlewares/rbac.guard");

/**
 * @swagger
 * tags:
 *   name: Checklists
 *   description: Checklist Management APIs
 */

/**
 * @swagger
 * /checklists:
 *   post:
 *     summary: Create a new checklist (ADMIN,PROCUREMENT_MANAGER only)
 *     tags: [Checklists]
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
 *               - questions
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pre-Delivery Inspection Checklist"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - type
 *                   properties:
 *                     question:
 *                       type: string
 *                       example: "Is the product cooler present?"
 *                     type:
 *                       type: string
 *                       enum: [BOOLEAN, DROPDOWN, MULTI_CHOICE, TEXT, IMAGE]
 *                       example: "BOOLEAN"
 *                     isRequired:
 *                       type: boolean
 *                       example: true
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Yes", "No"]
 *     responses:
 *       201:
 *         description: Checklist created successfully
 *       400:
 *         description: Bad request or validation error
 *       403:
 *         description: Forbidden - Only admin can create checklists
 */
router.post("/", auth, rbacGuard("CHECKLIST", "CREATE"), controller.createChecklist);

/**
 * @swagger
 * /checklists:
 *   get:
 *     summary: Get all checklists
 *     tags: [Checklists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all checklists
 *       400:
 *         description: Bad request
 */
router.get("/", auth, rbacGuard("CHECKLIST", "READ"), controller.getAllChecklists);

/**
 * @swagger
 * /checklists/{checklistId}:
 *   get:
 *     summary: Get checklist by ID
 *     tags: [Checklists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Checklist details
 *       404:
 *         description: Checklist not found
 */
router.get("/:checklistId", auth, rbacGuard("CHECKLIST", "READ"), controller.getChecklistById);

/**
 * @swagger
 * /checklists/{checklistId}:
 *   put:
 *     summary: Update checklist (ADMIN,PROCUREMENT_MANAGER only)
 *     tags: [Checklists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [BOOLEAN, DROPDOWN, MULTI_CHOICE, TEXT, IMAGE]
 *                     isRequired:
 *                       type: boolean
 *                     options:
 *                       type: array
 *     responses:
 *       200:
 *         description: Checklist updated successfully
 *       404:
 *         description: Checklist not found
 *       403:
 *         description: Forbidden - Only admin can update checklists
 */
router.put("/:checklistId", auth, rbacGuard("CHECKLIST", "UPDATE"),controller.updateChecklist);

/**
 * @swagger
 * /checklists/{checklistId}:
 *   delete:
 *     summary: Delete checklist (Admin only)
 *     tags: [Checklists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Checklist deleted successfully
 *       404:
 *         description: Checklist not found
 *       403:
 *         description: Forbidden - Only admin can delete checklists
 */
router.delete("/:checklistId", auth, rbacGuard("CHECKLIST", "DELETE"), controller.deleteChecklist);


module.exports = router;
