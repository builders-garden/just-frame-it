-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectDescription" TEXT NOT NULL,
    "whyAttend" TEXT NOT NULL,
    "previousWork" TEXT,
    "githubUrl" TEXT NOT NULL,
    "canAttendRome" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "teamMember1Fid" INTEGER NOT NULL,
    "teamMember1DisplayName" TEXT NOT NULL,
    "teamMember1Username" TEXT NOT NULL,
    "teamMember1AvatarUrl" TEXT,
    "teamMember2Fid" INTEGER,
    "teamMember2DisplayName" TEXT,
    "teamMember2Username" TEXT,
    "teamMember2AvatarUrl" TEXT,
    "teamMember3Fid" INTEGER,
    "teamMember3DisplayName" TEXT,
    "teamMember3Username" TEXT,
    "teamMember3AvatarUrl" TEXT
);

-- CreateIndex
CREATE INDEX "Application_teamMember1Fid_idx" ON "Application"("teamMember1Fid");
