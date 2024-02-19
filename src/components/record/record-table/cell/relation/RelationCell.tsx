import { useEffect, useState } from "react";
import { PolicyField } from "@/src/types/metadata";
import { RelationDropdownItems } from "@/src/components/record/record-table/cell/relation/RelationDropdownItems";
import { createClient } from "@supabase/supabase-js";
import { debounce } from "lodash";
import error from "next/error";
import { RelationDropdown } from "@/src/components/ui/dropdown/RelationDropdown";

const supabase = createClient(
  "https://ifaekiywtbedsipmwtkr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmYWVraXl3dGJlZHNpcG13dGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjgyNjU1NCwiZXhwIjoyMDIyNDAyNTU0fQ.37mTjcmzwBWCIm1RIeaREROrnoEFSYAXyFrY48NDCsA",
);

type RelationCellProps = {
  field: PolicyField;
  setRefs: (element: any) => void;
  isFirstField: boolean;
  isUserCreatedRow: boolean;
  idValue: string;
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
  idValue,
  onEnter,
  isCellSelected,
  setIsCellSelected,
}: RelationCellProps) => {
  const internalIdValue = parseInt(idValue);

  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);

  const [fieldValue, setFieldValue] = useState<string>("");

  const debouncedSetSearchFilter = debounce(setFieldValue, 100, {
    leading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (internalIdValue) {
        if (
          field?.relationIdField &&
          field?.relationLabel &&
          field?.relationTable
        ) {
          const { data, error } = await supabase
            .from(field.relationTable)
            .select(`${field.relationLabel}`)
            .eq(field.relationIdField, internalIdValue)
            .single();

          if (!error) {
            setFieldValue(data?.[field.relationLabel as any]);
          }
        }
      }
    };
    fetchData();
  }, [field, internalIdValue]);

  useEffect(() => {
    const fetchData = async () => {
      if (field.relationIdField && field.relationLabel && field.relationTable) {
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
  }, [field, fieldValue, internalIdValue]);

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
      <RelationDropdown
        setRefs={setRefs}
        setIsCellSelected={setIsCellSelected}
        clickableComponent={
          <textarea
            className="block truncate border-l-0 border-t-0 hover:border-l hover:border-t focus:border-t focus:border-l focus:z-50 resize-none cursor-pointer focus:outline-0 focus:border-gray-400 hover:border-gray-400/80 focus:cursor-auto h-7 text-sm border border-1 border-gray-200 w-32 py-1 px-1 z-0 hover:rounded-md focus:rounded-md"
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
