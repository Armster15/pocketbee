import { useRouter } from "next/router";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { RootLayout } from "$/components/RootLayout";
import { ProjectLayout } from "$/components/ProjectLayout";
import { api } from "$/lib/api";
import { Button } from "$/components/Button";
import { Input } from "$/components/Input";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { DeleteProjectButtonWithModal } from "$/components/modals/DeleteProjectButtonWithModal";
import type { FormProps } from "react-html-props";

const ProjectSettingsPage: NextPageWithLayout = () => {
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
  const { refetch: refetchAllProjects } = api.projects.getAll.useQuery();
  const editProjectMutation = api.projects.edit.useMutation({
    onSuccess: () => {
      toast.success("Success!");
      refetchProject();
      refetchAllProjects();
    },
    onError: () => {
      toast.error("An error occurred");
    },
  });

  const handleEditProject: FormProps["onSubmit"] = async (ev) => {
    ev.preventDefault();
    if (editProjectMutation.isLoading) return;

    const formData = new FormData(ev.target as HTMLFormElement);
    let name = formData.get("name") as string | undefined;
    let image_url = formData.get("image_url") as string | null;

    // If name is blank, make it undefined (keep value as is in DB), but if the image url is blank, make it null (remove value in DB)
    name = name?.trim() === "" ? undefined : name;
    image_url = image_url?.trim() === "" ? null : image_url;

    if (!projectId) return;

    editProjectMutation.mutate({ projectId, name, image_url });
  };

  if (!project) {
    if (isLoading) return <Skeleton count={7} />;
    if (isError) return <p className="text-red-500">Error</p>;
  }

  return (
    <>
      <Head>
        <title>Settings | Pocketbee</title>
      </Head>

      <form onSubmit={handleEditProject} className="mb-12">
        <h3 className="mb-4 text-2xl font-bold">Project Information</h3>

        <div className="children:flex-1 flex gap-8">
          <label className="grid">
            Name
            <Input
              className="mt-2"
              name="name"
              defaultValue={project.name}
              autoComplete="off"
            />
          </label>

          <label className="grid">
            Image URL
            <Input
              className="mt-2"
              name="image_url"
              defaultValue={project.image_url ?? undefined}
              placeholder={"https://example.com/image.png"}
              autoComplete="off"
            />
          </label>
        </div>

        <Button disabled={editProjectMutation.isLoading} className="mt-4">
          Update
        </Button>
      </form>

      <div className="mb-12">
        <h3 className="mb-4 text-2xl font-bold">Project Token</h3>
        <Input
          className="mr-2 w-[365px]"
          value={project.token}
          readOnly
          onClick={(ev) => (ev.target as HTMLInputElement).select()}
        />
        <Button
          onClick={async () => {
            await navigator.clipboard.writeText(project.token);
            toast.success("Copied project token!");
          }}
        >
          Copy
        </Button>
      </div>

      <div className="mb-12">
        <h3 className="mb-4 text-2xl font-bold">Danger Zone</h3>
        <DeleteProjectButtonWithModal project={project} />
      </div>
    </>
  );
};

ProjectSettingsPage.getLayout = (page) => {
  return (
    <RootLayout>
      <ProjectLayout>{page}</ProjectLayout>
    </RootLayout>
  );
};

export default ProjectSettingsPage;
