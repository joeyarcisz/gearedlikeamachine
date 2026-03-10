-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "crewMemberId" TEXT;

-- CreateTable
CREATE TABLE "CrewMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "dayRate" INTEGER,
    "kitFee" INTEGER,
    "notes" TEXT,
    "city" TEXT,
    "state" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "imdb" TEXT,
    "w9OnFile" BOOLEAN NOT NULL DEFAULT false,
    "ndaOnFile" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "lastBooked" TIMESTAMP(3),
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrewMember_email_key" ON "CrewMember"("email");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_crewMemberId_fkey" FOREIGN KEY ("crewMemberId") REFERENCES "CrewMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
