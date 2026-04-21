const crypto = require("crypto");
const { PrismaClient } = require("../../generated/prisma-client");
const prisma = new PrismaClient();

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
 * Import candidates into a hiring drive
 * Request body: { candidates: [{ email, fullName }, ...] }
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
            token // Refresh token or keep old? The user said store token id for all student mapping to mail id
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
 * Get all candidates for a specific drive
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
 * Mock send links to all candidates
 * In real scenario, this would trigger SMTP/Mail service
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
