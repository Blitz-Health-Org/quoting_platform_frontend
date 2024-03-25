import { TabOption } from "@/src/app/select/page";
import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";

type TabHeaderProps = {
  tabs: string[];
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>; // Function to update the selected tab
  titles: string[];
};

export const TabHeader = ({
  tabs,
  selectedTab,
  setSelectedTab,
  titles,
}: TabHeaderProps) => {
  const [highlightStyle, setHighlightStyle] = useState({});
  const tabsRef = useRef<HTMLDivElement[]>([]); // To store refs for each tab

  useEffect(() => {
    const currentIndex = tabs.indexOf(selectedTab);
    if (currentIndex !== -1 && tabsRef.current[currentIndex]) {
      const { offsetWidth, offsetLeft } = tabsRef.current[currentIndex];
      setHighlightStyle({
        width: `${offsetWidth}px`,
        transform: `translateX(${offsetLeft}px)`,
        transition: "transform 300ms ease-in-out", // Smooth transition for sliding effect
      });
    }
  }, [selectedTab, tabs]);

  return (
    <div className="relative truncate overflow-x-auto">
      <div className="flex overflow-x-auto">
        {tabs.map((tab, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) {
                tabsRef.current[index] = el;
              }
            }} // Assign ref to each tab
            className={`mx-1 mb-1 text-xs px-3 py-1 cursor-pointer rounded-md border border-gray-300
            ${selectedTab === tab ? "bg-gray-200" : "hover:bg-gray-100"}`}
            onClick={() => setSelectedTab(tab)} // Handle tab selection
          >
            {titles[index]}
          </div>
        ))}
        <div
          className="absolute bottom-1 left-0 bg-blue-500 h-0.5 rounded-sm"
          style={highlightStyle}
        ></div>
      </div>
      {/* Highlight element */}
    </div>
  );
};

export default TabHeader;
