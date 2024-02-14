import { GroupByContext } from "@/src/context/GroupByContext";
import { RecordContext } from "@/src/context/RecordContext";
import { useContext } from "react";

export type NewRecordButtonProps = {
  tableName: {
    singular: string;
    plural: string;
  };
};

export const NewRecordButton = ({ tableName }: NewRecordButtonProps) => {
  const {
    userCreatedRecord: [
      isUserCreatedRecordActive,
      setIsUserCreatedRecordActive,
    ],
  } = useContext(RecordContext);
  const {
    groupField: [, setGroupFieldObject],
  } = useContext(GroupByContext);

  function handleClick(event: any) {
    event.stopPropagation();

    setGroupFieldObject({ value: "" });

    setIsUserCreatedRecordActive(!isUserCreatedRecordActive);
  }

  return <button onClick={handleClick}>+ New</button>;
};
