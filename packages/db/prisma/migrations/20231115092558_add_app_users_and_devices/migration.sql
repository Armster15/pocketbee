-- CreateEnum
CREATE TYPE "device_type" AS ENUM ('phone', 'tablet', 'computer', 'watch', 'spatial', 'other');

-- CreateTable
CREATE TABLE "app_users" (
    "db_id" UUID NOT NULL,
    "primary_id" TEXT NOT NULL,

    CONSTRAINT "app_users_pkey" PRIMARY KEY ("db_id")
);

-- CreateTable
CREATE TABLE "devices" (
    "app_user_id" UUID NOT NULL,
    "id" UUID NOT NULL,
    "os_name" TEXT NOT NULL,
    "os_version" TEXT NOT NULL,
    "app_version" TEXT NOT NULL,
    "app_build_no" TEXT NOT NULL,
    "device_model" TEXT NOT NULL,
    "device_type" "device_type" NOT NULL,
    "screen_height" INTEGER NOT NULL,
    "screen_width" INTEGER NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_app_user_id_fkey" FOREIGN KEY ("app_user_id") REFERENCES "app_users"("db_id") ON DELETE CASCADE ON UPDATE NO ACTION;
