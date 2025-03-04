/*
  Warnings:

  - Added the required column `signature` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "applicationId" TEXT NOT NULL,
    "voterFid" INTEGER NOT NULL,
    "experience" INTEGER NOT NULL,
    "idea" INTEGER NOT NULL,
    "virality" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    CONSTRAINT "Vote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("applicationId", "createdAt", "experience", "id", "idea", "updatedAt", "virality", "voterFid") SELECT "applicationId", "createdAt", "experience", "id", "idea", "updatedAt", "virality", "voterFid" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE INDEX "Vote_voterFid_idx" ON "Vote"("voterFid");
CREATE INDEX "Vote_applicationId_idx" ON "Vote"("applicationId");
CREATE UNIQUE INDEX "Vote_applicationId_voterFid_key" ON "Vote"("applicationId", "voterFid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
