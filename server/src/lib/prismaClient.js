/**
 * @file prismaClient.js
 * @description Singleton Prisma client instance shared across the entire server.
 *
 * Uses the global object (`global.__prisma`) to ensure only one PrismaClient
 * and connection pool exists per Node.js process, even when module caching
 * is invalidated (e.g., hot-reload in development).
 *
 * Logging:
 * - Development: logs queries, warnings, and errors.
 * - Production: logs only warnings and errors.
 *
 * IMPORTANT: Never instantiate PrismaClient elsewhere in the codebase.
 * Always import from this file: `const { prisma } = require('../lib/prismaClient');`
 */

const { PrismaClient } = require("../generated/prisma-client");

// Singleton pattern — one client per process.
// In development, module-level require() caching handles this.
// In production (or clustered env), this ensures we never open
// more than one connection pool per worker process.
let prisma;

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });
}

prisma = global.__prisma;

module.exports = { prisma };
