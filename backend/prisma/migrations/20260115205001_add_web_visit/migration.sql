-- CreateTable
CREATE TABLE "public"."web_visit" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "web_visit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "web_visit_visitedAt_idx" ON "public"."web_visit"("visitedAt");

-- CreateIndex
CREATE INDEX "web_visit_userId_visitedAt_idx" ON "public"."web_visit"("userId", "visitedAt");

-- AddForeignKey
ALTER TABLE "public"."web_visit" ADD CONSTRAINT "web_visit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
