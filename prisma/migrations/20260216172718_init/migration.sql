-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "league" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "oddsHome" REAL NOT NULL,
    "oddsDraw" REAL NOT NULL,
    "oddsAway" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "selection" TEXT NOT NULL,
    "odds" REAL NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bet_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Bet_userId_idx" ON "Bet"("userId");

-- CreateIndex
CREATE INDEX "Bet_eventId_idx" ON "Bet"("eventId");
