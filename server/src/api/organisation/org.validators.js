function validateOrgCodeCustom(code) {
  if (code.length < 8) return "Must be at least 8 characters long.";
  if (/[a-z]/.test(code)) return "Lowercase letters are not allowed (only capital letters).";
  if (!/[A-Z]/.test(code)) return "Must contain at least one capital letter.";
  if (!/[0-9]/.test(code)) return "Must contain at least one digit.";
  if (!/[^A-Za-z0-9\s]/.test(code)) return "Must contain at least one special character.";
  return null;
}

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
