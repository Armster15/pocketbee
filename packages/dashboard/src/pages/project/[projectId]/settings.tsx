import { useRouter } from "next/router";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { RootLayout } from "$/components/RootLayout";
import { ProjectLayout } from "$/components/ProjectLayout";
import { api } from "$/utils/api";
import { Button } from "$/components/Button";
import type { FormProps } from "react-html-props";

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;

  const {
    data: project,
    refetch: refetchProject,
    isLoading,
    isError,
  } = api.projects.get.useQuery(
    { projectId: projectId! },
    { enabled: !!projectId },
  );
  const renameProjectMutation = api.projects.rename.useMutation();
  const deleteProjectMutation = api.projects.delete.useMutation();
  const { refetch: refetchAllProjects } = api.projects.getAll.useQuery();

  const handleRenameProject: FormProps["onSubmit"] = async (ev) => {
    ev.preventDefault();
    const formData = new FormData(ev.target as HTMLFormElement);
    const name = formData.get("name") as string;

    if (!name || !projectId) return;

    await renameProjectMutation.mutateAsync({ name, projectId });
    refetchProject();
    refetchAllProjects();
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;

    await deleteProjectMutation.mutateAsync({ projectId });
    await refetchAllProjects();
    router.push("/");
  };

  if (!project) {
    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p className="text-red-500">Error</p>;
  }

  return (
    <>
      <Head>
        <title>Settings | What the Buzz</title>
      </Head>

      <form onSubmit={handleRenameProject} className="mb-6">
        <h3>Name</h3>
        <input
          name="name"
          defaultValue={project.name}
          className="mr-2 rounded-2xl border-2 p-2"
          autoComplete="off"
        />
        <Button>Update Name</Button>
      </form>

      <div className="mb-8">
        <h3>Project Token</h3>
        <input
          className="mr-2 w-[350px] rounded-2xl border-2 p-2"
          value={project.token}
          readOnly
          onClick={(ev) => (ev.target as HTMLInputElement).select()}
        />
        <Button
          onClick={async () => {
            await navigator.clipboard.writeText(project.token);
            alert("Copied");
          }}
        >
          Copy
        </Button>
      </div>

      <Button onClick={handleDeleteProject}>Delete Project</Button>
    </>
  );
};

ProjectPage.getLayout = (page) => {
  return (
    <RootLayout>
      <ProjectLayout>{page}</ProjectLayout>
    </RootLayout>
  );
};

export default ProjectPage;
