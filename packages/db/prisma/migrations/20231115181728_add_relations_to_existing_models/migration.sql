/*
  Warnings:

  - A unique constraint covering the columns `[primary_id]` on the table `app_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_id` to the `app_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_users" ADD COLUMN     "project_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "app_users_primary_id_key" ON "app_users"("primary_id");

-- AddForeignKey
ALTER TABLE "app_users" ADD CONSTRAINT "app_users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
