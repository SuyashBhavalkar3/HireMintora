-- CreateTable
CREATE TABLE "drive_candidates" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IMPORTED',
    "hiringDriveId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drive_candidates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drive_candidates_token_key" ON "drive_candidates"("token");

-- CreateIndex
CREATE UNIQUE INDEX "drive_candidates_email_hiringDriveId_key" ON "drive_candidates"("email", "hiringDriveId");

-- AddForeignKey
ALTER TABLE "drive_candidates" ADD CONSTRAINT "drive_candidates_hiringDriveId_fkey" FOREIGN KEY ("hiringDriveId") REFERENCES "hiring_drives"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
