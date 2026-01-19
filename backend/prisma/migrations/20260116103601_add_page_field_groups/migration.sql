-- CreateTable
CREATE TABLE "public"."pages" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."page_field_groups" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_field_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."page_fields" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "pageGroupId" TEXT,
    "name" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "public"."pages"("slug");

-- CreateIndex
CREATE INDEX "page_field_groups_pageId_idx" ON "public"."page_field_groups"("pageId");

-- CreateIndex
CREATE INDEX "page_fields_pageId_idx" ON "public"."page_fields"("pageId");

-- CreateIndex
CREATE INDEX "page_fields_pageGroupId_idx" ON "public"."page_fields"("pageGroupId");

-- AddForeignKey
ALTER TABLE "public"."page_field_groups" ADD CONSTRAINT "page_field_groups_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."page_fields" ADD CONSTRAINT "page_fields_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "public"."pages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."page_fields" ADD CONSTRAINT "page_fields_pageGroupId_fkey" FOREIGN KEY ("pageGroupId") REFERENCES "public"."page_field_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
