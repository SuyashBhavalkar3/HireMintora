const jwt = require("jsonwebtoken");
const { prisma } = require("../lib/prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";

/**
 * Authentication Middleware
 * 
 * Verifies the Bearer JWT token in the Authorization header.
 * If valid, it fetches the corresponding user from the database, 
 * ensures the account is active, and attaches the user object to `req.user`.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Promise<void>} - Responds with 401/403 if unauthorized, otherwise calls next().
 */
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, errors: ["Missing or invalid authentication token."] });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if the user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, isActive: true, organisationId: true, organisationRole: true }
    });

    if (!user) {
      return res.status(401).json({ success: false, errors: ["Authentication failed. User no longer exists."] });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, errors: ["Account is inactive."] });
    }

    // Attach user data to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, errors: ["Token has expired."] });
    }
    return res.status(401).json({ success: false, errors: ["Invalid token."] });
  }
}

module.exports = { authenticateUser };
