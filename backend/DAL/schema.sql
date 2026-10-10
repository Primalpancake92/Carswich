-- Carswich database schema (SQLite)
--
-- Reference only: this is the SQL Entity Framework generates from DAL/AppDbContext.cs.
-- Don't edit this to change the database. Change the models / AppDbContext, then run:
--   dotnet ef migrations add <Name>
--   dotnet ef database update
-- To regenerate this file: dotnet ef migrations script -o DAL/schema.sql


-- Buyers and Dealers share one table.
-- UserType says which class a row is; columns only one type uses are NULL for the other.
CREATE TABLE "Users" (
    "UserId"         INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "FullName"       TEXT    NOT NULL,
    "Email"          TEXT    NOT NULL,
    "Password"       TEXT    NOT NULL,
    "PhoneNumber"    TEXT    NOT NULL,
    "Address"        TEXT    NOT NULL,
    "UserType"       TEXT    NOT NULL,   -- 'Buyer' or 'Dealer'
    "Balance"        REAL    NULL,       -- Buyer and Dealer
    "DealershipName" TEXT    NULL        -- Dealer only
);

-- Each car points at the dealer that listed it (DealerId).
-- A dealer's "list of cars" is: SELECT * FROM Cars WHERE DealerId = ?
CREATE TABLE "Cars" (
    "CarId"       INTEGER NOT NULL CONSTRAINT "PK_Cars" PRIMARY KEY AUTOINCREMENT,
    "DealerId"    INTEGER NULL,
    "Make"        TEXT    NOT NULL,
    "Model"       TEXT    NOT NULL,
    "Year"        INTEGER NOT NULL,
    "Mileage"     INTEGER NOT NULL,
    "Colour"      TEXT    NOT NULL,
    "Price"       REAL    NOT NULL,
    "Description" TEXT    NOT NULL,
    "Quantity"    INTEGER NOT NULL,
    "IsSold"      INTEGER NOT NULL,      -- 0 = false, 1 = true
    CONSTRAINT "FK_Cars_Users_DealerId" FOREIGN KEY ("DealerId")
        REFERENCES "Users" ("UserId") ON DELETE CASCADE
);

CREATE INDEX "IX_Cars_DealerId" ON "Cars" ("DealerId");

-- No two accounts can share an email
CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
