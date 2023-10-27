import { Fragment, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { NextPageWithLayout } from "$/pages/_app";
import { api } from "$/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { RootLayout } from "$/components/RootLayout";
import { Button } from "$/components/Button";
import { IoAdd } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";

const Home: NextPageWithLayout = () => {
  const { data: projects, error, isLoading } = api.projects.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Pocketbee</title>
      </Head>

      <CreateProjectButtonWithModal />

      <div className="mt-12">
        {isLoading && !projects && <Skeleton count={6} />}

        {projects && projects.length > 0 && (
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
            {projects.map((project) => (
              <Link
                href={`/project/${project.id}`}
                key={project.id}
                className="h-36 rounded-2xl border-2 bg-white p-5 duration-100 hover:shadow active:bg-gray-100/95"
              >
                {project.name}
              </Link>
            ))}

            {projects && projects.length === 0 && <p>No projects (yet...)</p>}
          </div>
        )}
      </div>
    </>
  );
};

const CreateProjectButtonWithModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const createProjectMutation = api.projects.create.useMutation();
  const { refetch: refetchProjects } = api.projects.getAll.useQuery();

  async function onSubmit() {
    await createProjectMutation.mutateAsync({ name });
    setIsOpen(false);
    await refetchProjects();
    closeModal();
  }

  function closeModal() {
    setIsOpen(false);
    setName("");
  }

  return (
    <>
      <Button
        className="flex items-center justify-center"
        onClick={() => setIsOpen(true)}
      >
        <IoAdd className="mr-1" aria-hidden />
        Create new project
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
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create Project
                  </Dialog.Title>

                  <form
                    onSubmit={(ev) => {
                      ev.preventDefault();
                      onSubmit();
                    }}
                  >
                    <div className="mt-2">
                      <label className="text-sm text-gray-500">
                        Name
                        <input
                          className="w-full rounded-xl border-2 p-1"
                          value={name}
                          onChange={(ev) => setName(ev.target.value)}
                        />
                      </label>
                    </div>

                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onSubmit}
                      >
                        Create
                      </button>
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

Home.getLayout = (page) => {
  return <RootLayout>{page}</RootLayout>;
};

export default Home;
