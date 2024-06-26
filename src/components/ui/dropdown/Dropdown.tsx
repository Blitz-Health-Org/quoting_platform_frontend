import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  autoUpdate,
  flip,
  offset,
  Placement,
  useFloating,
} from "@floating-ui/react";
import { useListenClickOutside } from "@/src/components/ui/dropdown/utils/useListenClickOutside";
import { RecordContext } from "@/src/context/commissions/RecordContext";

type DropdownProps = {
  clickableComponent: React.ReactNode;
  dropdownComponents: React.ReactNode;
  dropdownOffset?: { x?: number; y?: number };
  dropdownPlacement?: Placement;
  onClick?: () => {};
  initialDropdown?: boolean;
  collapseOnClick?: boolean;
  controlledDropdownOpen?: [boolean, Dispatch<SetStateAction<boolean>>];
};

export const Dropdown = ({
  clickableComponent,
  dropdownComponents,
  dropdownOffset = { x: 0, y: 0 },
  dropdownPlacement = "bottom-end",
  onClick,
  collapseOnClick = true,
  controlledDropdownOpen,
}: DropdownProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    userCreatedRecord: [, setIsUserCreatedRecordActive],
  } = useContext(RecordContext);

  const internalIsDropdownOpen = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] =
    controlledDropdownOpen ?? internalIsDropdownOpen;

  const offsetMiddlewares = [];

  if (dropdownOffset.x) {
    offsetMiddlewares.push(offset({ crossAxis: dropdownOffset.x }));
  }

  if (dropdownOffset.y) {
    offsetMiddlewares.push(offset({ mainAxis: dropdownOffset.y }));
  }

  useListenClickOutside({
    refs: [containerRef],
    callback: (event) => {
      event.stopImmediatePropagation();
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    },
    enabled: isDropdownOpen,
  });

  const { refs, floatingStyles } = useFloating({
    placement: dropdownPlacement,
    middleware: [flip(), ...offsetMiddlewares],
    whileElementsMounted: autoUpdate,
  });

  function handleDropdownClick() {
    console.log("always fires??");
    setIsDropdownOpen(!isDropdownOpen);
    onClick?.();
  }

  return (
    <div ref={containerRef}>
      {clickableComponent && (
        <div onClick={handleDropdownClick} ref={refs.setReference}>
          {clickableComponent}
        </div>
      )}
      {isDropdownOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="flex flex-col overflow-auto"
          onClick={() => {
            if (collapseOnClick) {
              handleDropdownClick();
            }
          }}
        >
          {dropdownComponents}
        </div>
      )}
    </div>
  );
};
