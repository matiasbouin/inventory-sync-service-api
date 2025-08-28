-- CreateTable
CREATE TABLE "public"."InventoryItem" (
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("sku")
);

-- CreateTable
CREATE TABLE "public"."SyncLog" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "skuList" TEXT[],
    "synced" INTEGER NOT NULL,
    "errors" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);
