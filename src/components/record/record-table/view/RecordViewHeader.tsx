import { FilterDropdown } from "@/src/components/record/record-table/filter/components/FilterDropdown";
import { ViewHeaderButtons } from "@/src/components/record/record-table/view/ViewHeaderButtons";
import { Dropdown } from "@/src/components/ui/dropdown/Dropdown";
import { useRecordTable } from "@/src/components/record/record-table/hooks/useRecordTable";
import { CiBoxList } from "react-icons/ci";
import { useContext } from "react";
import { RecordContext } from "@/src/context/commissions/RecordContext";

export const RecordViewHeader = () => {
  const { tableName } = useContext(RecordContext);
  let { filteredRecords } = useRecordTable(tableName);
  // const [isHorizontalScroll, setIsHorizontalScroll] = useState<boolean>(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollElement = document.getElementById("scrollContainer");
  //     if (scrollElement) {
  //       console.log('yo')
  //       const isScrolling = scrollElement.scrollWidth > scrollElement.clientWidth;
  //       setIsHorizontalScroll(isScrolling);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 w-full mb-4">
        <div className="col-span-1 h-full">
          <div className="text-center flex items-center justify-left text-sm h-full">
            <CiBoxList className="w-5 h-5" />
            <p className="ml-1.5 mr-1.5"> View All Records</p>
            <p>({filteredRecords.length})</p>
          </div>
        </div>

        <div className={`col-span-1 flex flex-row justify-end items-center`}>
          <Dropdown
            collapseOnClick={false}
            clickableComponent={
              <button className="mx-1 px-1 py-1 text-sm rounded-sm bg-white cursor-pointer text-center">
                Filter
              </button>
            }
            dropdownComponents={<FilterDropdown />}
          />

          {/* <Dropdown clickableComponent = {<button className="mx-1 px-2 py-1 text-sm rounded-sm outline outline-1 outline-gray-300 shadow-sm bg-white cursor-pointer text-center">Sort By</button>} dropdownComponents={<div>stuff</div>}/> */}
          {/* <Dropdown
            collapseOnClick
            clickableComponent={
              <button className="mx-1 px-1 py-1 text-sm rounded-sm bg-white cursor-pointer text-center">
                Group By
              </button>
            }
            dropdownComponents={<ViewHeaderButtons />}
          />

          <Dropdown
            clickableComponent={
              <button className="mx-1 px-1 py-1 text-sm rounded-sm bg-white cursor-pointer text-center">
                Sort
              </button>
            }
            dropdownComponents={<ViewHeaderButtons />}
          /> */}
        </div>
      </div>
    </>
  );
};
