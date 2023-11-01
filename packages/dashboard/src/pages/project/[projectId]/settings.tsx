import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { RootLayout } from "$/components/RootLayout";
import { ProjectLayout } from "$/components/ProjectLayout";
import { RouterOutputs, api } from "$/lib/api";
import { Button } from "$/components/Button";
import { Input } from "$/components/Input";
import Skeleton from "react-loading-skeleton";
import { Dialog, Transition } from "@headlessui/react";
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

  if (!project) {
    if (isLoading) return <Skeleton count={7} />;
    if (isError) return <p className="text-red-500">Error</p>;
  }

  return (
    <>
      <Head>
        <title>Settings | Pocketbee</title>
      </Head>

      <form onSubmit={handleRenameProject} className="mb-6">
        <h3>Name</h3>
        <Input
          name="name"
          defaultValue={project.name}
          className="mr-2"
          autoComplete="off"
        />
        <Button>Update Name</Button>
      </form>

      <div className="mb-8">
        <h3>Project Token</h3>
        <Input
          className="mr-2 w-[350px]"
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

      <DeleteProjectButtonWithModal project={project} />
    </>
  );
};

interface DeleteProjectButtonWithModalProps {
  project: RouterOutputs["projects"]["get"];
}
const DeleteProjectButtonWithModal = ({
  project,
}: DeleteProjectButtonWithModalProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const formDisabled =
    inputVal.toLowerCase().trim() !== project.name.toLowerCase().trim();
  const deleteProjectMutation = api.projects.delete.useMutation();
  const { refetch: refetchAllProjects } = api.projects.getAll.useQuery();

  const handleSubmit = async () => {
    if (formDisabled) return;

    await deleteProjectMutation.mutateAsync({ projectId: project.id });
    await refetchAllProjects();
    router.push("/");
  };

  function closeModal() {
    setIsOpen(false);
    setInputVal("");
  }

  return (
    <>
      <Button
        className="flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        Delete Project
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mb-2 text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Project
                  </Dialog.Title>

                  <div className="my-4 space-y-3">
                    <p>Are you sure you want to delete this project?</p>
                    <p>If so, type {`"${project.name}"`}</p>
                    <p className="text-red-500">This cannot be undone</p>
                  </div>

                  <form
                    onSubmit={(ev) => {
                      ev.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <div className="mt-2">
                      <Input
                        className="w-full"
                        value={inputVal}
                        placeholder={project.name}
                        onChange={(ev) => setInputVal(ev.target.value)}
                      />
                    </div>

                    <div className="mt-6">
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={formDisabled}
                      >
                        Delete
                      </Button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
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
