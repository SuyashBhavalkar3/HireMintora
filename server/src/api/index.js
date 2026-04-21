/**
 * @file index.js
 * @description Barrel export for all API route modules.
 * Import from this file in server.js to keep the top-level clean.
 */
const userAuthRouter = require("./auth/userAuth.routes");
const organisationRouter = require("./organisation/org.routes");
const driveRouter = require("./drive/drive.routes");

module.exports = {
  userAuthRouter,
  organisationRouter,
  driveRouter,
};
