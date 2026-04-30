/**
 * @module CandidateRoutes
 * @description Public endpoints for candidate-facing features (no auth required).
 */
const express = require("express");
const { validateToken } = require("./drive.controller");

const router = express.Router();

/**
 * @swagger
 * /api/candidate/validate-token:
 *   get:
 *     summary: Validate an interview token and check if candidate exists
 *     tags: [Candidate]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token is valid.
 *       404:
 *         description: Candidate not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/validate-token", validateToken);

module.exports = router;
