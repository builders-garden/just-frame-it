-- CreateTable
CREATE TABLE "ProgressUpdate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "teamName" TEXT NOT NULL,
    "demoLink" TEXT,
    "keyFeatures" TEXT NOT NULL,
    "technicalMilestones" TEXT NOT NULL,
    "userEngagement" TEXT NOT NULL,
    "challenges" TEXT NOT NULL,
    "nextSteps" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "authorFid" INTEGER NOT NULL,
    "authorDisplayName" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "authorAvatarUrl" TEXT
);

-- CreateIndex
CREATE INDEX "ProgressUpdate_authorFid_idx" ON "ProgressUpdate"("authorFid");

-- CreateIndex
CREATE INDEX "ProgressUpdate_teamName_idx" ON "ProgressUpdate"("teamName");
