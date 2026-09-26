-- AlterTable
ALTER TABLE "Voluntario" ADD COLUMN     "notifEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifPush" BOOLEAN NOT NULL DEFAULT true;
