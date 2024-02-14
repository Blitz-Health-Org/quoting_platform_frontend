//TODO: Type checking

import { Dispatch, SetStateAction, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import BlumeLogo from "@/public/BlumeLogo.png";
import { supabase } from "@/src/supabase";
import { clientMetadataObject, ClientFieldType } from "@/src/types/metadata";
import { ClientType } from "@/src/types/custom/Client";

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
