const router = require("express").Router();
const controller = require("./payment.controller");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe Payment APIs
 */

/**
 * @swagger
 * /payments/create:
 *   post:
 *     summary: Create Stripe PaymentIntent
 *     description: >
 *       Creates a Stripe PaymentIntent for a product.
 *       The amount is calculated on the server to prevent tampering.
 *     tags: [Payments]
 *     security:
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: PaymentIntent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientSecret:
 *                       type: string
 *                       example: pi_3Nabcxyz_secret_****
 *                     orderId:
 *                       type: integer
 *                       example: 45
 *                 message:
 *                   type: string
 *                   example: Payment intent created successfully
 *       400:
 *         description: Invalid product or request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create",
  controller.createPayment
);

/**
 * @swagger
 * /payments/orders/{orderId}:
 *   get:
 *     summary: Get payment/order status
 *     description: Fetch payment and order details by order ID
 *     tags: [Payments]
 *     security:
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 45
 *     responses:
 *       200:
 *         description: Order fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     amount:
 *                       type: integer
 *                       description: Amount in rupees
 *                     status:
 *                       type: string
 *                       enum: [PENDING, PAID, FAILED]
 *                     paymentIntentId:
 *                       type: string
 *                       nullable: true
 *                     Product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         price:
 *                           type: integer
 *                 message:
 *                   type: string
 *                   example: Order fetched successfully
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/orders/:orderId",
  controller.getOrderStatus
);

module.exports = router;
