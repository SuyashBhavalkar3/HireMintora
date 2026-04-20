const express = require("express");
const { setupOrganisation } = require("./org.controller");
const { authenticateUser } = require("../../middlewares/auth.middleware");

const router = express.Router();

// All organisation routes are protected
router.use(authenticateUser);

/**
 * @swagger
 * /api/organisation/setup:
 *   post:
 *     summary: Set up a new organisation profile or join an existing one.
 *     tags: [Organisation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [CREATE, JOIN]
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               orgCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organisation created successfully.
 *       200:
 *         description: Joined organisation successfully.
 *       400:
 *         description: Validation error or already linked.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Organisation not found (on join).
 *       409:
 *         description: OrgCode conflict.
 */
router.post("/setup", setupOrganisation);

module.exports = router;
