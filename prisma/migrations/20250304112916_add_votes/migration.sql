-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "applicationId" TEXT NOT NULL,
    "voterFid" INTEGER NOT NULL,
    "experience" INTEGER NOT NULL,
    "idea" INTEGER NOT NULL,
    "virality" INTEGER NOT NULL,
    CONSTRAINT "Vote_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Vote_voterFid_idx" ON "Vote"("voterFid");

-- CreateIndex
CREATE INDEX "Vote_applicationId_idx" ON "Vote"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_applicationId_voterFid_key" ON "Vote"("applicationId", "voterFid");
