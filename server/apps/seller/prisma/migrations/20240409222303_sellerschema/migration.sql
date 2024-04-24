-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "gstNumber" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "IFSC" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "Seller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_phoneNumber_key" ON "Seller"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_gstNumber_key" ON "Seller"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_accountNumber_key" ON "Seller"("accountNumber");
