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
      className={`fixed z-10 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center`}
      style={{ backdropFilter: "blur(2px)" }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-4 rounded-md w-1/2 md:w-1/3 lg:1/3">
        {modalComponent}
      </div>
    </div>
  );
};
