import React from "react";
import { Modal } from "../../ui/Modal";
import { ClientType } from "@/src/types/custom/Client";

type Props = {
  client: ClientType;
};

export const ViewQuoteModal = ({ client }: Props) => {
  return (
    <div>
      <Modal onClose={() => {}} modalComponent={<></>} />
    </div>
  );
};
