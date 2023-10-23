import { Fragment, useState } from "react";
import { api } from "$/utils/api";
import { Dialog, Transition } from "@headlessui/react";

export default function Home() {
  const { data: projects, error, isLoading } = api.main.getProjects.useQuery();

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <nav>
        <h1 className="text-3xl font-semibold">What the Buzz</h1>

        <main className="mt-6">
          <CreateProjectButtonWithModal />

          <div className="mt-12 grid grid-cols-5 gap-12">
            {projects &&
              projects.length > 0 &&
              projects.map((project) => (
                <a
                  key={project.id}
                  className="h-36 rounded-2xl bg-white p-5 hover:shadow-md active:bg-gray-100/95"
                >
                  {project.name}
                </a>
              ))}

            {projects && projects.length === 0 && <p>No projects (yet...)</p>}
          </div>
        </main>
      </nav>
    </div>
  );
}

export function CreateProjectButtonWithModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const createProjectMutation = api.main.createProject.useMutation();
  const { refetch: refetchProjects } = api.main.getProjects.useQuery();

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
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-2xl bg-white p-3 hover:shadow-md active:bg-gray-100/95"
      >
        Create new project
      </button>

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
}
