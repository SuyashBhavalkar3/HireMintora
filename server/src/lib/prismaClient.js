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
