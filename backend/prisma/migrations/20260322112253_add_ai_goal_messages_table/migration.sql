-- CreateTable
CREATE TABLE "public"."ai_goal_messages" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_goal_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_goal_messages_day_key" ON "public"."ai_goal_messages"("day");
