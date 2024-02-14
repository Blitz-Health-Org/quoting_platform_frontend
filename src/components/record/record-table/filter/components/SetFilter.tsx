import { useRecordTable } from "@/src/components/record/record-table/hooks/useRecordTable";
import { Dropdown } from "@/src/components/ui/dropdown/Dropdown";
import { FilterContext } from "@/src/context/FilterContext";
import { RecordContext } from "@/src/context/RecordContext";
import { PolicyField } from "@/src/types/metadata";
import { useContext, useEffect } from "react";

// type SetFilterProps = {
//     setNewFilter: Dispatch<SetStateAction<{}>>;
// }

export const SetFilter = () => {
  const { tableName } = useContext(RecordContext);
  const { visibleFieldDefinitionObjects, loading } = useRecordTable(tableName);

  const {
    fieldObject: [fieldObject, setFieldObject],
  } = useContext(FilterContext);

  useEffect(() => {
    if (visibleFieldDefinitionObjects.length) {
      const dummyObject = visibleFieldDefinitionObjects[0];
      setFieldObject({
        label: dummyObject.label,
        field: dummyObject.field,
        value: "",
      });
    }
  }, [visibleFieldDefinitionObjects, setFieldObject]);

  //@VARUN: refactor this to be inside of whatever component you make, since its outside right now the component changes shape when
  if (loading) {
    return <></>;
  }

  if (!visibleFieldDefinitionObjects.length) {
    return <>No Available Fields</>;
  }

  // const [relationOperator, setRelationOperator]= useState();

  console.log("chcek this", visibleFieldDefinitionObjects);

  return (
    <div className="flex flex-col w-full">
      <div className="flex mb-2">
        <Dropdown
          collapseOnClick
          clickableComponent={
            <button className="py-1 text-sm rounded-sm cursor-pointer">
              {fieldObject.label} ⌄
            </button>
          }
          dropdownComponents={visibleFieldDefinitionObjects.map(
            (fieldObject, index) => {
              return (
                <button
                  className="border border-1 border-gray-200 bg-gray-100 p-1 shadow-sm"
                  key={index}
                  onClick={() =>
                    setFieldObject({
                      label: fieldObject.label,
                      value: fieldObject.value,
                      field: fieldObject.field,
                    })
                  }
                >
                  {fieldObject.label}
                </button>
              );
            },
          )}
        />
      </div>
      <textarea
        className="w-full border border-1 border-gray-200 rounded-md p-2 text-sm"
        placeholder={`Enter desired ${fieldObject.label}`}
        value={fieldObject.value}
        onChange={(e) =>
          setFieldObject({ ...fieldObject, value: e.target.value })
        }
      />
    </div>
  );
};
