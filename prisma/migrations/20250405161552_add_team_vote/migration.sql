-- CreateTable
CREATE TABLE "TeamVote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "voterFid" INTEGER NOT NULL,
    "teamName" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "demoDay" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "TeamVote_voterFid_idx" ON "TeamVote"("voterFid");

-- CreateIndex
CREATE INDEX "TeamVote_teamName_idx" ON "TeamVote"("teamName");

-- CreateIndex
CREATE INDEX "TeamVote_demoDay_idx" ON "TeamVote"("demoDay");

-- CreateIndex
CREATE UNIQUE INDEX "TeamVote_voterFid_teamName_demoDay_key" ON "TeamVote"("voterFid", "teamName", "demoDay");
