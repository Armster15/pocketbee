import { useState, useRef } from "react";
import { api } from "$/lib/api";
import { Button } from "$/components/Button";
import { Input } from "$/components/Input";
import { IoAdd } from "react-icons/io5";
import {
  ModalRoot,
  ModalTrigger,
  ModalTitle,
  Modal,
  type ModalRootRef,
} from "$/components/Modal";

export const CreateProjectButtonWithModal = () => {
  const [name, setName] = useState("");
  const createProjectMutation = api.projects.create.useMutation();
  const { refetch: refetchProjects } = api.projects.getAll.useQuery();
  const modalRef = useRef<ModalRootRef | null>(null);

  async function onSubmit() {
    await createProjectMutation.mutateAsync({ name });
    modalRef.current?.setIsOpen(false);
    await refetchProjects();
    closeModal();
  }

  function closeModal() {
    modalRef.current?.setIsOpen(false);
    setName("");
  }

  return (
    <ModalRoot ref={modalRef}>
      <ModalTrigger>
        <Button className="flex items-center justify-center">
          <IoAdd className="mr-1" aria-hidden />
          Create new project
        </Button>
      </ModalTrigger>

      <Modal>
        <ModalTitle
          as="h2"
          className="text-lg font-medium leading-6 text-gray-900"
        >
          Create Project
        </ModalTitle>

        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            onSubmit();
          }}
        >
          <div className="mt-2">
            <label className="text-sm text-gray-500">
              Name
              <Input
                className="w-full"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
            </label>
          </div>

          <div className="mt-6">
            <Button>Create</Button>
          </div>
        </form>
      </Modal>
    </ModalRoot>
  );
};
