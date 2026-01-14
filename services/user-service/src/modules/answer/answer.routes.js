const router = require("express").Router();
const controller = require("./answer.controller");
const auth = require("../../middlewares/auth.middleware");
const upload = require("../../middlewares/upload.middleware");
const rbacGuard = require("../../middlewares/rbac.guard");

/**
 * @swagger
 * tags:
 *   name: Answers
 *   description: Answer Management APIs (for Checklists)
 */

/**
 * @swagger
 * /answers:
 *   post:
 *     summary: Submit answers for a checklist (Inspection Manager only)
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - checklistId
 *               - answers
 *             properties:
 *               orderId:
 *                 type: integer
 *                 example: 102
 *               checklistId:
 *                 type: integer
 *                 example: 5
 *               answers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                   properties:
 *                     questionId:
 *                       type: integer
 *                       example: 1
 *                     answer:
 *                       oneOf:
 *                         - type: boolean
 *                           example: true
 *                         - type: string
 *                           example: "Eatable"
 *                         - type: array
 *                           items:
 *                             type: string
 *                           example: ["Licence present", "Air pressure good"]
 *     responses:
 *       201:
 *         description: Answers submitted successfully (Inspection Manager only)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       questionId:
 *                         type: integer
 *                       label:
 *                         type: string
 *                       type:
 *                         type: string
 *                       answer:
 *                         type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request or validation error
 *       404:
 *         description: Order or Checklist not found
 *       403:
 *         description: Forbidden - User doesn't have permission
 */
router.post("/", auth, rbacGuard("ANSWER", "CREATE"), controller.submitAnswers);


/**
 * @swagger
 * /answers/upload/image:
 *   post:
 *     summary: Upload a single image
 *     description: Upload a single image file and get a public URL for usage in checklist answers
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (jpg, png, jpeg)
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 file:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                       example: 1702989012345-123456789.jpg
 *                     path:
 *                       type: string
 *                       example: /uploads/1702989012345-123456789.jpg
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Only image files are allowed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/upload/image", auth, rbacGuard("ANSWER", "CREATE"), upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded"
    });
  }

  return res.status(201).json({
    success: true,
    message: "Image uploaded successfully",
    file: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`
    }
  });
});


/**
 * @swagger
 * /answers/orders/{orderId}/checklists/{checklistId}:
 *   get:
 *     summary: Get answers for a checklist and order (Inspection Manager or Admin only)
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: checklistId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Answers fetched successfully (Inspection Manager or Admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       questionId:
 *                         type: integer
 *                       question:
 *                         type: string
 *                       type:
 *                         type: string
 *                       answer:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *       404:
 *         description: Order or Checklist not found
 *       403:
 *         description: Forbidden - User doesn't have permission
 */
router.get("/orders/:orderId/checklists/:checklistId", auth, rbacGuard("ANSWER", "READ"), controller.getAnswersByChecklistAndOrder);

/**
 * @swagger
 * /answers/orders/{orderId}:
 *   get:
 *     summary: Get all answers for an order (Inspection Manager or Admin only)
 *     tags: [Answers]
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
 *         description: All answers for order fetched successfully (Inspection Manager or Admin)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       questionId:
 *                         type: integer
 *                       question:
 *                         type: string
 *                       type:
 *                         type: string
 *                       checklistId:
 *                         type: integer
 *                       answer:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden - User doesn't have permission
 */
router.get("/orders/:orderId", auth, rbacGuard("ANSWER", "READ"), controller.getAnswersByOrder);

/**
 * @swagger
 * /answers/{answerId}:
 *   delete:
 *     summary: Delete an answer (Inspection Manager or Admin)
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Answer deleted successfully
 *       404:
 *         description: Answer not found
 *       403:
 *         description: Forbidden - User doesn't have permission
 */
router.delete("/:answerId", auth, rbacGuard("ANSWER", "DELETE"), controller.deleteAnswer);

module.exports = router;
