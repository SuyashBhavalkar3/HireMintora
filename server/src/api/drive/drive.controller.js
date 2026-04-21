/**
 * @file drive.controller.js
 * @description Controller for all Hiring Drive operations:
 * creating drives, importing candidates, listing candidates, and dispatching invitations.
 * All routes in this controller require the `authenticateUser` middleware.
 */
const crypto = require("crypto");
const { prisma } = require("../../lib/prismaClient");

/**
 * Creates a new Hiring Drive for the authenticated user's organization.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.role - The role the hiring drive is for (e.g., Software Engineer).
 * @param {string} [req.body.description] - Optional description of the hiring drive.
 * @param {Object} req.user - The authenticated user object set by the auth middleware.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response confirming creation or describing an error.
 */

const createHiringDrive = async (req, res) => {
  try {
    const { role, description } = req.body;
    
    // User is authenticated, check if they belong to an organisation
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { organisation: true }
    });

    if (!user || !user.organisationId) {
      return res.status(403).json({ error: "User does not belong to any organisation" });
    }

    if (!role) {
      return res.status(400).json({ error: "Role is required to create a hiring drive" });
    }

    const drive = await prisma.hiringDrive.create({
      data: {
        role,
        description,
        organisationId: user.organisationId
      }
    });

    return res.status(201).json({
      message: "Hiring drive created successfully",
      drive
    });
  } catch (error) {
    console.error("Error in createHiringDrive:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Imports a batch of candidates into a specific hiring drive.
 * Generates a unique secure token for each candidate to be used for isolated assessment access.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The UUID of the hiring drive.
 * @param {Object} req.body - The request body.
 * @param {Array<{email: string, fullName: string}>} req.body.candidates - List of candidates to import.
 * @param {Object} req.user - The authenticated user object (must belong to the drive's organization).
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response containing processed candidates and any errors encountered.
 */
const importCandidates = async (req, res) => {
  try {
    const { id: driveId } = req.params;
    const { candidates } = req.body;

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ error: "Candidates list is required" });
    }

    // Verify drive existence and ownership
    const drive = await prisma.hiringDrive.findUnique({
      where: { id: driveId },
      include: { organisation: true }
    });

    if (!drive) {
      return res.status(404).json({ error: "Hiring drive not found" });
    }

    // Check if user belongs to the drive's organisation
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (user.organisationId !== drive.organisationId) {
      return res.status(403).json({ error: "You do not have permission to import candidates to this drive" });
    }

    const importedCandidates = [];
    const errors = [];

    for (const cand of candidates) {
      const { email, fullName } = cand;
      if (!email || !fullName) {
        errors.push({ email, error: "Email and Full Name are required" });
        continue;
      }

      try {
        // Generate a unique token for the candidate
        const token = crypto.randomBytes(32).toString("hex");

        const candidate = await prisma.driveCandidate.upsert({
          where: {
            email_hiringDriveId: {
              email,
              hiringDriveId: driveId
            }
          },
          update: {
            fullName,
            // Regenerate the token on re-import to allow access-link refresh.
            token
          },
          create: {
            email,
            fullName,
            token,
            hiringDriveId: driveId
          }
        });
        importedCandidates.push(candidate);
      } catch (err) {
        errors.push({ email, error: err.message });
      }
    }

    return res.status(200).json({
      message: `${importedCandidates.length} candidates processed`,
      count: importedCandidates.length,
      candidates: importedCandidates,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Error in importCandidates:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Retrieves all candidates associated with a specific hiring drive.
 * Ordered descending by their creation date.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The UUID of the hiring drive.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response containing the drive ID and array of candidate objects.
 */
const getDriveCandidates = async (req, res) => {
  try {
    const { id: driveId } = req.params;

    const drive = await prisma.hiringDrive.findUnique({
      where: { id: driveId }
    });

    if (!drive) {
      return res.status(404).json({ error: "Hiring drive not found" });
    }

    // Ensure the requesting user belongs to the drive's organisation
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { organisationId: true }
    });

    if (!user || user.organisationId !== drive.organisationId) {
      return res.status(403).json({ error: "You do not have permission to view candidates for this drive" });
    }

    const candidates = await prisma.driveCandidate.findMany({
      where: { hiringDriveId: driveId },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ driveId, candidates });
  } catch (error) {
    console.error("Error in getDriveCandidates:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Mocks the process of sending unique interview links to all imported candidates in a drive.
 * In a production scenario, this function should integrate with an SMTP or third-party mailing service (e.g. SendGrid)
 * to email the unique token link to each candidate. Updates the status to 'INVITED'.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} req.params - The route parameters.
 * @param {string} req.params.id - The UUID of the hiring drive.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} JSON response summarizing the number of invitations sent.
 */
const sendLinksToAll = async (req, res) => {
  try {
    const { id: driveId } = req.params;

    const candidates = await prisma.driveCandidate.findMany({
      where: { 
        hiringDriveId: driveId,
        status: "IMPORTED" // Only send to those who haven't been invited yet (optionally)
      }
    });

    if (candidates.length === 0) {
      return res.status(200).json({ message: "No candidates to invite" });
    }

    // Mock sending links
    const baseUrl = process.env.CANDIDATE_APP_URL || "http://localhost:3001";
    
    for (const cand of candidates) {
      const inviteUrl = `${baseUrl}/interview/${cand.token}`;
      console.log(`[MOCK EMAIL] To: ${cand.email}, Link: ${inviteUrl}`);
      
      // Update status to INVITED
      await prisma.driveCandidate.update({
        where: { id: cand.id },
        data: { status: "INVITED" }
      });
    }

    return res.status(200).json({
      message: `Invitations sent to ${candidates.length} candidates`,
      count: candidates.length
    });
  } catch (error) {
    console.error("Error in sendLinksToAll:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createHiringDrive,
  importCandidates,
  getDriveCandidates,
  sendLinksToAll
};
