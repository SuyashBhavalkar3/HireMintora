-- Rename primary tables first
ALTER TABLE "organisations" RENAME TO "users";
ALTER TABLE "companies" RENAME TO "organisations";

-- Rename foreign key constraints and columns in users table
ALTER TABLE "users" RENAME COLUMN "companyId" TO "organisationId";
ALTER TABLE "users" RENAME COLUMN "companyRole" TO "organisationRole";

-- Postgres automatically names foreign keys based on the table name and column, 
-- we should rename it to match Prisma's expectation.
ALTER TABLE "users" RENAME CONSTRAINT "organisations_companyId_fkey" TO "users_organisationId_fkey";

-- Rename Indexes to match Prisma conventions
ALTER INDEX "organisations_pkey" RENAME TO "users_pkey";
ALTER INDEX "organisations_email_key" RENAME TO "users_email_key";
ALTER INDEX "organisations_supabaseUserId_key" RENAME TO "users_supabaseUserId_key";

ALTER INDEX "companies_pkey" RENAME TO "organisations_pkey";
ALTER INDEX "companies_orgCode_key" RENAME TO "organisations_orgCode_key";
