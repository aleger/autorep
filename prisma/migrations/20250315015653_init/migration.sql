-- CreateTable
CREATE TABLE "CongressForm" (
    "bioguide_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "form_configuration" JSONB,

    CONSTRAINT "CongressForm_pkey" PRIMARY KEY ("bioguide_id")
);
