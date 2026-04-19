-- CreateEnum
CREATE TYPE "PurchaseSource" AS ENUM ('ONLINE', 'WALKIN');

-- DropForeignKey
ALTER TABLE "TicketPurchase" DROP CONSTRAINT "TicketPurchase_paymentMethodId_fkey";

-- AlterTable
ALTER TABLE "TicketPurchase" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "source" "PurchaseSource" NOT NULL DEFAULT 'ONLINE',
ALTER COLUMN "paymentMethodId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "TicketPurchase_source_idx" ON "TicketPurchase"("source");

-- AddForeignKey
ALTER TABLE "TicketPurchase" ADD CONSTRAINT "TicketPurchase_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
