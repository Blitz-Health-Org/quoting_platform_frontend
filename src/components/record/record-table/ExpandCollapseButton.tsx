import { RecordContext } from "@/src/context/commissions/RecordContext";
import { useContext, useState } from "react";

export const ExpandCollapseButton = () => {
  const {
    visibleFieldDefinitionObjects: [, setVisibleFieldDefinitionObjects],
    expanded: [isExpanded, setIsExpanded],
  } = useContext(RecordContext);

  function handleClick() {
    setIsExpanded(!isExpanded);
  }

  return (
    <span className="flex items-start">
      <button
        className="bg-slate-200 pl-0.5 pr-1 py-1.5 rounded-r-md"
        onClick={handleClick}
      >
        {isExpanded ? `<` : `>`}
      </button>
    </span>
  );
};

export default ExpandCollapseButton;
