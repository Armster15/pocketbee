/*
  Warnings:

  - You are about to drop the `app_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "app_users" DROP CONSTRAINT "app_users_project_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_app_user_id_fkey";

-- DropTable
DROP TABLE "app_users";
