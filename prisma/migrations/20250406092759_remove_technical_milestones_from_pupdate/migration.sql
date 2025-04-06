/*
  Warnings:

  - You are about to drop the column `technicalMilestones` on the `ProgressUpdate` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProgressUpdate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "teamName" TEXT NOT NULL,
    "demoLink" TEXT,
    "keyFeatures" TEXT NOT NULL,
    "userEngagement" TEXT NOT NULL,
    "challenges" TEXT NOT NULL,
    "nextSteps" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "authorFid" INTEGER NOT NULL,
    "authorDisplayName" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "authorAvatarUrl" TEXT
);
INSERT INTO "new_ProgressUpdate" ("additionalNotes", "authorAvatarUrl", "authorDisplayName", "authorFid", "authorUsername", "challenges", "createdAt", "demoLink", "id", "keyFeatures", "nextSteps", "teamName", "updatedAt", "userEngagement") SELECT "additionalNotes", "authorAvatarUrl", "authorDisplayName", "authorFid", "authorUsername", "challenges", "createdAt", "demoLink", "id", "keyFeatures", "nextSteps", "teamName", "updatedAt", "userEngagement" FROM "ProgressUpdate";
DROP TABLE "ProgressUpdate";
ALTER TABLE "new_ProgressUpdate" RENAME TO "ProgressUpdate";
CREATE INDEX "ProgressUpdate_authorFid_idx" ON "ProgressUpdate"("authorFid");
CREATE INDEX "ProgressUpdate_teamName_idx" ON "ProgressUpdate"("teamName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
