/**
 * @file userAuth.routes.js
 * @description Express router for user authentication endpoints.
 * Mounts at /api/auth/user (see api/index.js).
 * Route-level Swagger/OpenAPI annotations are included inline below.
 */

const express = require("express");
const router = express.Router();
const controller = require("./userAuth.controller");

/**
 * @swagger
 * tags:
 *   name: UserAuth
 *   description: Authentication for Users (Employers / HR)
 */

/**
 * @swagger
 * /api/auth/user/signup:
 *   post:
 *     summary: Manual signup for a User
 *     tags: [UserAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, confirmPassword]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error or Email already exists
 */
router.post("/signup", controller.manualSignup);

/**
 * @swagger
 * /api/auth/user/login:
 *   post:
 *     summary: Manual login for a User
 *     tags: [UserAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", controller.manualLogin);

/**
 * @swagger
 * /api/auth/user/oauth:
 *   post:
 *     summary: Supabase OAuth authentication for a User
 *     description: Handles both signup and login via Supabase OAuth. Automatically links existing manual accounts by email.
 *     tags: [UserAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [supabaseUserId]
 *             properties:
 *               supabaseUserId: { type: string }
 *               email: { type: string }
 *               fullName: { type: string }
 *               oauthProvider: { type: string }
 *     responses:
 *       200:
 *         description: Authentication successful
 *       400:
 *         description: Missing required fields
 */
router.post("/oauth", controller.oauthAuth);

module.exports = router;
