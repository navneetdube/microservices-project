const router = require("express").Router();
const controller = require("./auth.controller");
const auth = require("../../middlewares/auth.middleware");
const rbacGuard = require("../../middlewares/rbac.guard");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user with role-based authentication
 *     description: |
 *       - INSPECTION_MANAGER: Must login with mobile number only
 *       - ADMIN, PROCUREMENT_MANAGER, CLIENT: Must login with email only
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: Required for ADMIN, PROCUREMENT_MANAGER, CLIENT
 *               mobile:
 *                 type: string
 *                 example: "+919876543210"
 *                 description: Required for INSPECTION_MANAGER only
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, PROCUREMENT_MANAGER, INSPECTION_MANAGER, CLIENT]
 *                 example: "PROCUREMENT_MANAGER"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials or validation error
 *       401:
 *         description: Unauthorized
 */

router.post("/login", controller.login);



module.exports = router;
