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

module.exports = {
  createHiringDrive
};
