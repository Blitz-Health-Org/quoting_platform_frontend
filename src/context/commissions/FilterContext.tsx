import { PolicyField } from "../../types/metadata";
import { Filter } from "@/src/types/custom/Filter";
import { Dispatch, SetStateAction, createContext, useState } from "react";

type StateProps<T = string> = [T, Dispatch<SetStateAction<T>>];

type FilterContextProps = {
  filters: StateProps<Filter[]>;
  fieldObject: any;
};

export const FilterContext = createContext<FilterContextProps>({
  filters: [[], () => {}],
  fieldObject: ["", () => {}],
});

export function FilterContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [fieldObject, setFieldObject] = useState<PolicyField>({
    field: "",
    type: "",
  });

  return (
    <>
      <FilterContext.Provider
        value={{
          filters: [filters, setFilters],
          fieldObject: [fieldObject, setFieldObject],
        }}
      >
        {children}
      </FilterContext.Provider>
    </>
  );
}
