-- CreateTable
CREATE TABLE "public"."bot_commands" (
    "id" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_commands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bot_commands_command_key" ON "public"."bot_commands"("command");
