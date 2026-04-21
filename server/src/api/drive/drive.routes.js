const express = require("express");
const { 
  createHiringDrive, 
  importCandidates, 
  getDriveCandidates, 
  sendLinksToAll 
} = require("./drive.controller");
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

/**
 * @swagger
 * /api/drive/{id}/candidates/import:
 *   post:
 *     summary: Import candidates into a hiring drive
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               candidates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     fullName:
 *                       type: string
 *     responses:
 *       200:
 *         description: Candidates processed successfully.
 *       400:
 *         description: Invalid input or missing candidates list.
 *       403:
 *         description: Permission denied.
 *       404:
 *         description: Hiring drive not found.
 *       500:
 *         description: Internal server error.
 */
router.post("/:id/candidates/import", importCandidates);

/**
 * @swagger
 * /api/drive/{id}/candidates:
 *   get:
 *     summary: Get all candidates for a specific drive
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of candidates for the drive.
 *       404:
 *         description: Hiring drive not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id/candidates", getDriveCandidates);

/**
 * @swagger
 * /api/drive/{id}/candidates/send-links:
 *   post:
 *     summary: Mock send unique token links to all candidates
 *     tags: [Drive]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitations sent successfully.
 *       500:
 *         description: Internal server error.
 */
router.post("/:id/candidates/send-links", sendLinksToAll);

module.exports = router;
