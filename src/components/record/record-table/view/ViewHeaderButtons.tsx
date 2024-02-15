import { GroupByContext } from "@/src/context/commissions/GroupByContext";
import { useContext } from "react";

export const ViewHeaderButtons = () => {
  const {
    groupField: [, setGroupFieldObject],
  } = useContext(GroupByContext);

  return (
    <div className="bg-white flex flex-col shadow-sm outline outline-1 outline-gray-200 text-sm mr-1">
      <button
        className="px-1.5 py-1"
        onClick={() =>
          setGroupFieldObject({ field: "client", label: "Client" })
        }
      >
        Client
      </button>
      <hr className="mt-1 mb-1"></hr>
      <button
        className="px-1.5 py-1"
        onClick={() =>
          setGroupFieldObject({ field: "carrier_id", label: "Carrier" })
        }
      >
        Carrier
      </button>
      <hr className="mt-1 mb-1"></hr>
      <button
        className="px-1.5 py-1"
        onClick={() =>
          setGroupFieldObject({ field: "plan_type", label: "Plan Type" })
        }
      >
        Plan Type
      </button>
    </div>
  );
};
