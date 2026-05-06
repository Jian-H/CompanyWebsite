-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,
    "homeTitle" TEXT NOT NULL,
    "homeSubtitle" TEXT NOT NULL,
    "primaryActionLabel" TEXT NOT NULL,
    "primaryActionHref" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

