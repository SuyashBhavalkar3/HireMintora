/**
 * @file userAuth.controller.js
 * @description Controller for user authentication — signup, login, and OAuth.
 *
 * Endpoints handled:
 *   - POST /api/auth/user/signup  — Manual registration (email + password).
 *   - POST /api/auth/user/login   — Manual login (credential verification).
 *   - POST /api/auth/user/oauth   — Supabase OAuth (creates/links user by supabaseUserId).
 *
 * All endpoints return a JWT on success. OAuth auto-links accounts if the email
 * matches an existing manual user (enables seamless dual-auth).
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../lib/prismaClient");
const {
  validateManualSignup,
  validateManualLogin,
  validateOAuth,
} = require("./userAuth.validators");

// ─── Config ──────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const BCRYPT_ROUNDS = 12;

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: "user",
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function excludePassword(user) {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// ─── Manual Auth ─────────────────────────────────────────────────────────────

/**
 * Handles manual user registration using email and password.
 * Performs validation, checks for existing users, and hashes the password.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - { fullName, email, password }
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} - 201 with token and user data, or 400/500 on error.
 */
async function manualSignup(req, res) {
  const errors = validateManualSignup(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { fullName, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: ["User with this email already exists."],
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        fullName,
        email: normalizedEmail,
        passwordHash,
      },
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      token,
      user: excludePassword(newUser),
    });
  } catch (error) {
    console.error("Manual signup error:", error);
    return res.status(500).json({ success: false, errors: ["Internal server error."] });
  }
}

/**
 * Handles manual user login using email and password.
 * Compares hashed password and generates a JWT.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - { email, password }
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} - 200 with token and user data, or 401/500 on error.
 */
async function manualLogin(req, res) {
  const errors = validateManualLogin(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, errors: ["Invalid credentials."] });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, errors: ["Invalid credentials."] });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: excludePassword(user),
    });
  } catch (error) {
    console.error("Manual login error:", error);
    return res.status(500).json({ success: false, errors: ["Internal server error."] });
  }
}

// ─── OAuth Auth ──────────────────────────────────────────────────────────────

/**
 * Handles OAuth-based authentication (Supabase integration).
 * Supports both signup and login. If the user exists via email but not
 * supabaseUserId, it links the accounts.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - { supabaseUserId, email, fullName, oauthProvider }
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} - 200 with token and user data, or 400/500 on error.
 */
async function oauthAuth(req, res) {
  const errors = validateOAuth(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { supabaseUserId, email, fullName, oauthProvider } = req.body;
  
  if (!supabaseUserId) {
    return res.status(400).json({ success: false, errors: ["supabaseUserId is required."] });
  }

  try {
    // Try to find by supabaseUserId first
    let user = await prisma.user.findUnique({
      where: { supabaseUserId },
    });

    // If not found by ID, try by email (to link existing manual account)
    if (!user && email) {
      const normalizedEmail = email.trim().toLowerCase();
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (user) {
        // Link the existing account to Supabase
        user = await prisma.user.update({
          where: { id: user.id },
          data: { supabaseUserId, oauthProvider },
        });
      }
    }

    // If still not found, create new (Signup via OAuth)
    if (!user) {
      if (!email || !fullName) {
        return res.status(400).json({
          success: false,
          errors: ["Email and Full Name are required for first-time OAuth signup."],
        });
      }

      user = await prisma.user.create({
        data: {
          fullName,
          email: email.trim().toLowerCase(),
          supabaseUserId,
          oauthProvider,
        },
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: excludePassword(user),
    });
  } catch (error) {
    console.error("OAuth auth error:", error);
    return res.status(500).json({ success: false, errors: ["Internal server error."] });
  }
}

module.exports = {
  manualSignup,
  manualLogin,
  oauthAuth,
};
