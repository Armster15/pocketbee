-- CreateTable
CREATE TABLE "projects" (
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "token" UUID NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_events" (
    "app_user_id" TEXT NOT NULL,
    "id" UUID NOT NULL,
    "start_time" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMPTZ(6),
    "project_id" UUID NOT NULL,

    CONSTRAINT "session_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_id_key" ON "projects"("id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_token_key" ON "projects"("token");

-- CreateIndex
CREATE INDEX "session_events_start_time_idx" ON "session_events"("start_time" DESC);

-- AddForeignKey
ALTER TABLE "session_events" ADD CONSTRAINT "session_events_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
