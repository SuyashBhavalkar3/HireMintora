const crypto = require("crypto");
const { prisma } = require("../../lib/prismaClient");
const { validateOrganisationSetup } = require("./org.validators");

/**
 * Generates a random alphanumeric code of length 8.
 * Ensures at least one digit and one special character for complexity.
 * 
 * @returns {string} - The generated code.
 */
function generateValidOrgCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specials = "!@#$%^&*";

  let codeArr = [];
  // Ensure at least 1 digit and 1 special char
  codeArr.push(digits[crypto.randomInt(0, digits.length)]);
  codeArr.push(specials[crypto.randomInt(0, specials.length)]);
  
  // Fill the rest with uppercase letters to a length of 8
  for (let i = 0; i < 6; i++) {
    codeArr.push(letters[crypto.randomInt(0, letters.length)]);
  }

  // Shuffle the array array using Fisher-Yates
  for (let i = codeArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [codeArr[i], codeArr[j]] = [codeArr[j], codeArr[i]];
  }

  return codeArr.join("");
}

/**
 * Attempts to generate a unique organization code.
 * Retries up to 10 times to avoid collisions.
 * 
 * @throws {Error} - If a unique code cannot be generated after 10 attempts.
 * @returns {Promise<string>} - A unique organization code.
 */
async function generateUniqueOrgCode() {
  let isUnique = false;
  let code = "";
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    code = generateValidOrgCode();
    const existing = await prisma.organisation.findUnique({
      where: { orgCode: code }
    });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) throw new Error("Failed to generate a unique org code.");
  return code;
}

/**
 * Handles organization setup: either CREATE a new one or JOIN an existing one.
 * If CREATE: Generates an orgCode, creates the Organisation, and sets user as OWNER.
 * If JOIN: Validates orgCode, links user to Organisation, and sets user as MEMBER.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - { action: 'CREATE'|'JOIN', name, description, category, orgCode }
 * @param {Object} req.user - The authenticated user object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} - 201/200 on success, or 400/404/409/500 on error.
 */
async function setupOrganisation(req, res) {
  const userId = req.user.id;
  
  // Check if they already belong to an organisation
  if (req.user.organisationId) {
    return res.status(400).json({
      success: false,
      errors: ["Your account is already linked to an organisation."]
    });
  }

  const errors = validateOrganisationSetup(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const { action, name, description, category, orgCode: providedOrgCode } = req.body;

  try {
    if (action === "CREATE") {
      // 1. Determine or Generate Org Code
      let finalOrgCode = providedOrgCode;
      if (!finalOrgCode) {
        finalOrgCode = await generateUniqueOrgCode();
      } else {
        // Unlikely, but verify uniqueness if provided
        const existing = await prisma.organisation.findUnique({ where: { orgCode: finalOrgCode } });
        if (existing) {
          return res.status(409).json({ success: false, errors: ["The provided orgCode is already in use."] });
        }
      }

      // 2. Create the Organisation and update the User (atomic unit)
      const newOrganisation = await prisma.$transaction(async (tx) => {
        const org = await tx.organisation.create({
          data: {
            name,
            description: description || null,
            category,
            orgCode: finalOrgCode
          }
        });

        await tx.user.update({
          where: { id: userId },
          data: {
            organisationId: org.id,
            organisationRole: "OWNER"
          }
        });

        return org;
      });

      return res.status(201).json({
        success: true,
        message: "Organisation created successfully.",
        organisation: newOrganisation,
        role: "OWNER"
      });

    } else if (action === "JOIN") {
      // 1. Find Organisation by provided code
      const org = await prisma.organisation.findUnique({
        where: { orgCode: providedOrgCode }
      });

      if (!org) {
        return res.status(404).json({ success: false, errors: ["Organisation with the provided orgCode not found."] });
      }

      // 2. Update User to link to the Organisation
      await prisma.user.update({
        where: { id: userId },
        data: {
          organisationId: org.id,
          organisationRole: "MEMBER"
        }
      });

      return res.status(200).json({
        success: true,
        message: "Joined organisation successfully.",
        organisation: org,
        role: "MEMBER"
      });
    }

  } catch (error) {
    console.error("Organisation setup error:", error);
    return res.status(500).json({ success: false, errors: ["Internal server error."] });
  }
}

/**
 * Retrieves the organization profile for the authenticated user.
 */
async function getOrganisation(req, res) {
  const orgId = req.user.organisationId;
  if (!orgId) {
    return res.status(404).json({
      success: false,
      errors: ["Your account is not linked to an organisation."]
    });
  }

  try {
    const org = await prisma.organisation.findUnique({
      where: { id: orgId },
      include: {
        _count: {
          select: { drives: true }
        }
      }
    });

    if (!org) {
      return res.status(404).json({
        success: false,
        errors: ["Organisation profile not found."]
      });
    }

    return res.status(200).json({
      success: true,
      organisation: org
    });
  } catch (error) {
    console.error("Get organisation error:", error);
    return res.status(500).json({ success: false, errors: ["Internal server error."] });
  }
}

module.exports = {
  setupOrganisation,
  getOrganisation
};
