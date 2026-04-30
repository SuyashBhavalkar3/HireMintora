/**
 * @file server.js
 * @description Entry point for the HireMintora Express server.
 *
 * Boot order:
 *  1. Load environment variables.
 *  2. Register global process error handlers (prevent silent crashes).
 *  3. Configure Express middleware (CORS, JSON, static files).
 *  4. Mount REST API routers.
 *  5. Attach WebSocket server for real-time AI interviews.
 *  6. Start HTTP listener.
 *
 * NOTE: Database migrations must be run externally (`npx prisma migrate deploy`)
 * before starting the server. Running migrations inside the server process
 * blocks the event loop and is unsafe in multi-instance deployments.
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const fs = require("fs");

// Add global error handlers to prevent crashes from unhandled events in third-party libs (like sarvamai)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

const { createInterviewWebSocketServer } = require("./websocket");
const { swaggerUi, specs } = require("./swagger");
const { userAuthRouter, organisationRouter, driveRouter } = require("./api");
const candidateRouter = require("./api/drive/candidate.routes");

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
// In production, set CORS_ORIGINS env var to a comma-separated list of allowed
// origins, e.g. "https://app.hiremintora.com,https://interview.hiremintora.com"
// In development it falls back to permissive "*".
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : null;

app.use(
  cors({
    origin: allowedOrigins
      ? (origin, cb) => {
          // Allow requests with no origin (server-to-server, curl)
          if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
          } else {
            cb(new Error(`CORS: origin ${origin} is not allowed`));
          }
        }
      : "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth/user", userAuthRouter);
app.use("/api/organisation", organisationRouter);
app.use("/api/drive", driveRouter);
app.use("/api/candidate", candidateRouter);

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
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

// ─── 404 Catch-All for API Routes ─────────────────────────────────────────────
// Must be placed after all routes so it only catches unmatched /api/* paths.
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, errors: ["API endpoint not found."] });
});

// ─── HTTP & WebSocket Server ───────────────────────────────────────────────────
const httpServer = http.createServer(app);

createInterviewWebSocketServer(httpServer, {
  path: "/ws/interview",
});

const PORT = Number(process.env.PORT || 3000);

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] Swagger docs → http://localhost:${PORT}/api-docs`);
  console.log(`[server] WebSocket    → ws://localhost:${PORT}/ws/interview`);
});
