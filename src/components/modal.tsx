import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface ModalProps {
  children: JSX.Element;
  description?: string;
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
}

function Modal({
  children,
  isOpen,
  onOpenChange,
  title,
  ...props
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[10] bg-zinc-950/75 animate-in fade-in" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[11] flex max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%]  flex-col gap-4 overflow-y-auto rounded-2xl border-2 border-zinc-950/50 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-800 p-6 shadow-lg focus:outline-none">
          <div className="flex items-center justify-between gap-2 pr-12">
            <Dialog.Title className="text-2xl font-bold tracking-wide text-white md:text-4xl">
              {title}
            </Dialog.Title>
            <Dialog.Close className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 text-zinc-600 transition-colors duration-150 hover:bg-zinc-700 hover:text-white">
              <X />
            </Dialog.Close>
          </div>
          {props.description && (
            <Dialog.Description className="text-zinc-600">
              {props.description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
