-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL DEFAULT '$2a$10$XxXxXxXxXxXxXxXxXxXxXuO8p7gJ7z8Y5K5K5K5K5K5K5K5K5K5K5K',
    "balance" REAL NOT NULL DEFAULT 1000.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("balance", "createdAt", "email", "id", "name") SELECT "balance", "createdAt", "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
