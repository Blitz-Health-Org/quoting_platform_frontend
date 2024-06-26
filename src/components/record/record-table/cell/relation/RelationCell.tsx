import { useEffect, useState } from "react";
import { PolicyField } from "@/src/types/metadata";
import { RelationDropdownItems } from "@/src/components/record/record-table/cell/relation/RelationDropdownItems";
import { debounce } from "lodash";
import error from "next/error";
import { TableCellDropdown } from "@/src/components/ui/dropdown/TableCellDropdown";
import { supabase } from "@/src/supabase";
import { row } from "../../view/constants/initializeEmptyUserCreatedRow";

type RelationCellProps = {
  field: PolicyField;
  setRefs: (element: any) => void;
  isFirstField: boolean;
  isUserCreatedRow: boolean;
  relationObject: any;
  onEnter: any;
  isCellSelected?: boolean;
  setIsCellSelected?: (val: boolean) => void;
};

//TODO: extract non relation specific logic into abstracted component
export const RelationCell = ({
  field,
  setRefs,
  isFirstField,
  isUserCreatedRow,
  relationObject,
  onEnter,
  isCellSelected,
  setIsCellSelected,
}: RelationCellProps) => {
  console.log("relation", relationObject);

  const internalIdValue = parseInt(relationObject?.id);

  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

  const [fieldValue, setFieldValue] = useState<string>(
    relationObject?.name ?? "",
  );

  const debouncedSetSearchFilter = debounce(setFieldValue, 100, {
    leading: true,
  });

  useEffect(() => {
    if (isCellSelected) {
      const fetchData = async () => {
        if (
          field.relationIdField &&
          field.relationLabel &&
          field.relationTable
        ) {
          if (!fieldValue) {
            const { data: matchingRelationRecords, error } = await supabase
              .from(field.relationTable)
              .select(`${field.relationLabel}, ${field.relationIdField}`)
              .limit(5);

            if (error) {
              console.error(error);
            } else {
              setSelectedRecords(matchingRelationRecords);
            }
          } else {
            const { data: matchingRelationRecords, error } = await supabase
              .from(field.relationTable)
              .select(`${field.relationLabel}, ${field.relationIdField}`)
              .like(field.relationLabel, `%${fieldValue}%`)
              .limit(5);

            if (error) {
              console.error(error);
            } else {
              setSelectedRecords(matchingRelationRecords);
            }
          }
        }
      };

      fetchData();
    }
  }, [field, fieldValue, internalIdValue, isCellSelected]);

  function handleDropdownItemClick(item: any) {
    return () => {
      if (setIsCellSelected) {
        setIsCellSelected(false);
      }
      setFieldValue(item[field.relationLabel as string]);
      onEnter(field.field, item[field.relationIdField as string]);
    };
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    debouncedSetSearchFilter(event.currentTarget.value);
  }

  return (
    <>
      <TableCellDropdown
        setRefs={setRefs}
        setIsCellSelected={setIsCellSelected}
        clickableComponent={
          <textarea
            className="block border-l-0 border-t-0 hover:border-l bg-transparent hover:border-t focus:border-t focus:border-l focus:z-10 resize-none cursor-pointer focus:outline-0 focus:border-gray-400 hover:border-gray-400/80 focus:cursor-auto h-7 text-sm border border-1 border-gray-200 w-full py-1 px-1 z-0 hover:rounded-md focus:rounded-md"
            value={fieldValue ?? ""}
            autoFocus={isUserCreatedRow && isFirstField}
            onChange={handleChange}
          />
        }
        dropdownComponents={
          <>
            {isCellSelected &&
              field.relationIdField &&
              field.relationLabel &&
              field.relationTable && (
                <RelationDropdownItems
                  handleClick={handleDropdownItemClick}
                  items={selectedRecords as any}
                  labelField={field.relationLabel}
                />
              )}
          </>
        }
      />
      {/*menu items*/}
    </>
  );
};

/*
onEnter: 
if name already exists in carrier table, select that
if not, create a new carrier as well
assign the returned id to the carrier id of the pending and submit

RecordCell:
needs still to list all, should it query the database repeatedly??

onClick: 
fires onEnter with the given name
*/
