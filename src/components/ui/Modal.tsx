//TODO: type checking
export type ModalProps = {
  onClose: () => void;
  modalComponent: React.ReactNode;
};

export const Modal = ({ onClose, modalComponent }: ModalProps) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center`}
      style={{ backdropFilter: "blur(2px)" }}
      onClick={handleOverlayClick}
    >
      {modalComponent}
    </div>
  );
};
