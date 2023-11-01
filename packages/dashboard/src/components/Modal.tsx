/**
 * Usage
 * =====
 *
 * <ModalRoot ref={modalRef}>
 *  <ModalTrigger>
 *    <button />
 *  </ModalTrigger>
 *
 *  <Modal>
 *    const {isOpen, setIsOpen} = useModalState()
 *    <Content />
 *  </Modal>
 * </ModalRoot>
 *
 * modalRef.isOpen // boolean
 * modalRef.setIsOpen(boolean)
 */

import {
  createContext,
  forwardRef,
  Fragment,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Slot } from "@radix-ui/react-slot";

interface Actions {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface ModalRootRef extends Actions {}
export interface ModalRootProps extends React.PropsWithChildren {}
export interface ModalTriggerProps extends React.PropsWithChildren {}
export interface ModalProps extends React.PropsWithChildren {}

const ModalContext = createContext<Actions>({
  isOpen: false,
  setIsOpen: () => {},
});

export const ModalRoot = forwardRef<ModalRootRef, ModalRootProps>(
  function ModalRoot({ children }, ref) {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      isOpen,
      setIsOpen,
    }));

    return (
      <ModalContext.Provider value={{ isOpen, setIsOpen }}>
        {children}
      </ModalContext.Provider>
    );
  },
);

export const ModalTrigger = ({ children }: ModalTriggerProps) => {
  const { setIsOpen } = useContext(ModalContext);

  return <Slot onClick={() => setIsOpen(true)}>{children}</Slot>;
};

export const ModalTitle = Dialog.Title;

export const Modal = ({ children }: ModalProps) => {
  const { isOpen, setIsOpen } = useContext(ModalContext);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
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
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
