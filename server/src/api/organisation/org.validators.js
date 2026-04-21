/**
 * @file org.validators.js
 * @description Input validation helpers for the Organisation setup endpoint.
 */

/**
 * Validates a custom org code provided by the user when creating an organisation.
 * Rules: min 8 chars, uppercase only, must contain at least 1 digit and 1 special char.
 *
 * @param {string} code - The org code string to validate.
 * @returns {string|null} - An error message string, or null if valid.
 */
function validateOrgCodeCustom(code) {
  if (code.length < 8) return "Must be at least 8 characters long.";
  if (/[a-z]/.test(code)) return "Lowercase letters are not allowed (only capital letters).";
  if (!/[A-Z]/.test(code)) return "Must contain at least one capital letter.";
  if (!/[0-9]/.test(code)) return "Must contain at least one digit.";
  if (!/[^A-Za-z0-9\s]/.test(code)) return "Must contain at least one special character.";
  return null;
}


/**
 * Validates the request body for the organisation setup endpoint.
 * Supports two actions:
 *  - 'CREATE': requires name, category, and optional orgCode (validated if provided).
 *  - 'JOIN':   requires orgCode.
 *
 * @param {Object} data - The request body.
 * @param {string} data.action - 'CREATE' or 'JOIN'.
 * @param {string} [data.name] - Organisation display name (required for CREATE).
 * @param {string} [data.category] - Business category (required for CREATE).
 * @param {string} [data.orgCode] - Join code (required for JOIN, optional for CREATE).
 * @returns {string[]} - Array of validation error messages. Empty if valid.
 */
function validateOrganisationSetup(data) {
  const errors = [];
  const { action, name, category, orgCode } = data;

  if (!action || !["CREATE", "JOIN"].includes(action)) {
    errors.push("Invalid or missing 'action'. Must be 'CREATE' or 'JOIN'.");
    return errors;
  }

  if (action === "CREATE") {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.push("Organisation 'name' is required when creating an organisation.");
    }
    if (!category || typeof category !== "string" || category.trim().length === 0) {
      errors.push("Organisation 'category' is required when creating an organisation.");
    }
    if (orgCode) {
      const codeError = validateOrgCodeCustom(orgCode);
      if (codeError) {
        errors.push(`Invalid orgCode: ${codeError}`);
      }
    }
  }

  if (action === "JOIN") {
    if (!orgCode || typeof orgCode !== "string" || orgCode.trim().length === 0) {
      errors.push("An 'orgCode' is required to join an existing organisation.");
    }
  }

  return errors;
}

module.exports = {
  validateOrganisationSetup,
  validateOrgCodeCustom
};
