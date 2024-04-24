-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "condition" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "imageUrls" TEXT[],
    "userId" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "rating" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION,
    "delivery" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("label")
);
