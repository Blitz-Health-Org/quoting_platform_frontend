import * as React from "react";
import { QuoteColumnDisplay } from "./QuoteColumnDisplay";

//TODO: Need to clean and validate the schema somewhere

export type LeftProps = {
  fieldObject: Record<string, any>;
};

export default function Left({ fieldObject }: LeftProps) {
  return (
    <QuoteColumnDisplay
      field={fieldObject}
      initialExpanded
      className="max-w-44"
    />
  );
}
