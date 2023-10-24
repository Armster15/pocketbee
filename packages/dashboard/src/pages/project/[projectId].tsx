import { useRouter } from "next/router";
import { Layout } from "$/components/Layout";
import { api } from "$/utils/api";
import { Button } from "$/components/Button";

export default function ProjectPage() {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;

  const { data: project } = api.projects.get.useQuery(
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

  return (
    <Layout>
      <pre>{JSON.stringify(project, undefined, 4)}</pre>
      <Button onClick={deleteProject}>Delete Project</Button>
    </Layout>
  );
}
