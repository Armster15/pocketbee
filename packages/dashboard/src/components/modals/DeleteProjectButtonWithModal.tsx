import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { api, type RouterOutputs } from "$/lib/api";
import { Button } from "$/components/Button";
import { Input } from "$/components/Input";
import {
  ModalRoot,
  ModalTrigger,
  ModalTitle,
  Modal,
  type ModalRootRef,
} from "$/components/Modal";

export interface DeleteProjectButtonWithModalProps {
  project: RouterOutputs["projects"]["get"];
}

export const DeleteProjectButtonWithModal = ({
  project,
}: DeleteProjectButtonWithModalProps) => {
  const router = useRouter();
  const modalRef = useRef<ModalRootRef | null>(null);
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
    modalRef.current?.setIsOpen(false);
  };

  return (
    <ModalRoot ref={modalRef}>
      <ModalTrigger>
        <Button className="flex items-center justify-center">
          Delete Project
        </Button>
      </ModalTrigger>

      <Modal>
        <ModalTitle
          as="h3"
          className="mb-2 text-lg font-medium leading-6 text-gray-900"
        >
          Delete Project
        </ModalTitle>

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
      </Modal>
    </ModalRoot>
  );
};
