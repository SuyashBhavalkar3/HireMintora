// ─── Helpers ────────────────────────────────────────────────────────────────

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isNonEmptyString(val) {
  return typeof val === "string" && val.trim().length > 0;
}

// ─── Manual Signup ───────────────────────────────────────────────────────────
// Required: fullName, email, password, confirmPassword

function validateManualSignup(body) {
  const errors = [];

  if (!isNonEmptyString(body.fullName)) {
    errors.push("fullName is required.");
  }

  if (!isValidEmail(body.email)) {
    errors.push("A valid email address is required.");
  }

  if (!isNonEmptyString(body.password) || body.password.length < 8) {
    errors.push("password must be at least 8 characters.");
  }

  if (body.password !== body.confirmPassword) {
    errors.push("password and confirmPassword do not match.");
  }

  return errors;
}

// ─── Manual Login ────────────────────────────────────────────────────────────
// Required: email, password

function validateManualLogin(body) {
  const errors = [];

  if (!isValidEmail(body.email)) {
    errors.push("A valid email address is required.");
  }

  if (!isNonEmptyString(body.password)) {
    errors.push("password is required.");
  }

  return errors;
}

// ─── OAuth Signup / Login ────────────────────────────────────────────────────
// Required: supabaseUserId

function validateOAuth(body) {
  const errors = [];

  if (!isNonEmptyString(body.supabaseUserId)) {
    errors.push("supabaseUserId is required.");
  }

  return errors;
}

module.exports = {
  validateManualSignup,
  validateManualLogin,
  validateOAuth,
};
