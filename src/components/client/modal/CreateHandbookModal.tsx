import { Modal } from "../../ui/Modal";
import React from "react";

type CreateHandbookModalProps = {
  onClose: () => void;
};

export const CreateHandbookModal = ({ onClose }: CreateHandbookModalProps) => {
  return (
    <div>
      <Modal onClose={onClose} modalComponent={<>Createhandbookmodal</>} />
    </div>
  );
};
