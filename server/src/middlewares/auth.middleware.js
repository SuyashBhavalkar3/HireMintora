/**
 * @file auth.middleware.js
 * @description JWT Bearer token authentication middleware.
 *
 * Extracts the token from the `Authorization: Bearer <token>` header,
 * verifies it against JWT_SECRET, then performs a database lookup to
 * confirm the user exists and is active. Attaches the user to `req.user`.
 *
 * PERFORMANCE NOTE: The current implementation executes a DB query on every
 * authenticated request. For high-traffic production deployments, consider
 * replacing the DB lookup with a Redis cache keyed by user ID, invalidated
 * on user update/deletion.
 */

const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";

/**
 * Authentication Middleware
 *
 * Verifies the Bearer JWT token in the Authorization header.
 * If valid, it fetches the corresponding user from the database to check
 * their active status and attach fresh org data to `req.user`.
 *
 * PERFORMANCE NOTE (Scale):
 * This middleware executes one DB query per authenticated request.
 * At higher traffic, replace the `prisma.user.findUnique` call with a
 * Redis cache keyed by `decoded.id` (TTL ~60 s) to avoid repeated round-trips.
 * Invalidate the cache entry on account deactivation or org change.
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, errors: ["Missing or invalid authentication token."] });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch the minimal user fields needed for downstream controllers.
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        isActive: true,
        organisationId: true,
        organisationRole: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, errors: ["Authentication failed. User no longer exists."] });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ success: false, errors: ["Account is inactive."] });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, errors: ["Token has expired."] });
    }
    return res
      .status(401)
      .json({ success: false, errors: ["Invalid token."] });
  }
}

module.exports = { authenticateUser };
