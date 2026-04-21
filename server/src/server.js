/**
 * @file server.js
 * @description Entry point for the HireMintora Express server.
 * Initializes middleware (CORS, JSON parsing), API routes (Auth, Org, Drive),
 * Swagger documentation, and the WebSocket server for real-time interview simulations.
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const { createInterviewWebSocketServer } = require("./websocket");
const { swaggerUi, specs } = require("./swagger");
const { userAuthRouter, organisationRouter, driveRouter } = require("./api");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth/user", userAuthRouter);
app.use("/api/organisation", organisationRouter);
app.use("/api/drive", driveRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Serve AsyncAPI specification
app.get("/asyncapi.yaml", (req, res) => {
  const asyncApiPath = path.join(__dirname, "..", "asyncapi.yaml");
  if (fs.existsSync(asyncApiPath)) {
    res.setHeader("Content-Type", "application/yaml");
    res.sendFile(asyncApiPath);
  } else {
    res.status(404).json({ error: "AsyncAPI specification not found" });
  }
});

// Serve combined API documentation page
app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "api-docs.html"));
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 */
app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

// Function to ensure database tables are created
async function ensureDatabaseTables() {
  try {
    console.log("Ensuring database tables are created...");
    // Run prisma migrate deploy to apply any pending migrations
    execSync("npx prisma migrate deploy", { stdio: "inherit", cwd: path.join(__dirname, "..") });
    console.log("Database tables are ready.");
  } catch (error) {
    console.error("Error ensuring database tables:", error);
    // Don't exit the process, just log the error
    // In production, you might want to handle this differently
  }
}

const httpServer = http.createServer(app);

createInterviewWebSocketServer(httpServer, {
  path: "/ws/interview",
});

const PORT = Number(process.env.PORT || 3000);

// Ensure database tables exist before starting the server
ensureDatabaseTables().then(() => {
  httpServer.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});
