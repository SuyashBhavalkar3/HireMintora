const userAuthRouter = require("./auth/userAuth.routes");
const organisationRouter = require("./organisation/org.routes");
const driveRouter = require("./drive/drive.routes");

module.exports = {
  userAuthRouter,
  organisationRouter,
  driveRouter,
};
