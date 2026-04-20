const express = require("express");
const { createHiringDrive } = require("./drive.controller");
const { authenticateUser } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(authenticateUser);

/**
 * @swagger
 * /api/drive:
 *   post:
 *     summary: Create a new hiring drive for the organization
 *     tags: [Drive]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hiring drive created successfully.
 *       400:
 *         description: Role is required.
 *       403:
 *         description: User does not belong to any organisation.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createHiringDrive);

module.exports = router;
