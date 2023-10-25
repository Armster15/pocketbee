import { useEffect } from "react";
import { useRouter } from "next/router";
import { edenTreaty } from "@elysiajs/eden";
import { Layout } from "$/components/Layout";
import { api } from "$/utils/api";
import { Button } from "$/components/Button";
import { env } from "$/env.mjs";
import type { App as IngestionApi } from "@what-the-buzz/ingestion-api";

const ingestionApi = edenTreaty<IngestionApi>(
  env.NEXT_PUBLIC_INGESTION_API_URL,
);

export default function ProjectPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;

  const { data: project, refetch: refetchProject } = api.projects.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );
  const deleteProjectMutation = api.projects.delete.useMutation();
  const { refetch: refetchProjects } = api.projects.getAll.useQuery();

  async function deleteProject() {
    if (!projectId) return;

    await deleteProjectMutation.mutateAsync({ projectId });
    await refetchProjects();
    router.push("/");
  }

  useEffect(() => {
    if (!projectId) return;

    const ws = ingestionApi.ws.subscribe({
      $query: { projectId },
    });

    ws.on("message", () => {
      refetchProject();
    });
  }, [projectId]);

  return (
    <Layout>
      <pre>{JSON.stringify(project, undefined, 4)}</pre>
      <Button onClick={deleteProject}>Delete Project</Button>
    </Layout>
  );
}
