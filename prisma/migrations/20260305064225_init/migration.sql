-- CreateEnum
CREATE TYPE "ContactStage" AS ENUM ('lead', 'qualifying', 'active_contact', 'active_conversation', 'client_account', 'client_past', 'inactive_contact');

-- CreateEnum
CREATE TYPE "OpportunityStage" AS ENUM ('lead', 'qualification', 'proposal', 'negotiation', 'waiting_client_feedback', 'nurture_reactivation', 'won', 'lost', 'deferred');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "stage" "ContactStage" NOT NULL DEFAULT 'lead',
    "lastContact" TIMESTAMP(3),
    "nextAction" TEXT,
    "notes" TEXT,
    "sourceFiles" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT,
    "stage" "OpportunityStage" NOT NULL DEFAULT 'lead',
    "estimatedValueLow" INTEGER,
    "estimatedValueHigh" INTEGER,
    "lastTouch" TIMESTAMP(3),
    "nextAction" TEXT,
    "owner" TEXT,
    "priority" TEXT,
    "notes" TEXT,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_token_key" ON "AdminSession"("token");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
