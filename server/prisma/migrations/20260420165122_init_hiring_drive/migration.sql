-- CreateTable
CREATE TABLE "hiring_drives" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hiring_drives_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hiring_drives" ADD CONSTRAINT "hiring_drives_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
