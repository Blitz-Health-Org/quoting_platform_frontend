import * as React from "react";
import { QuoteColumnDisplay } from "./QuoteColumnDisplay";

//TODO: Need to clean and validate the schema somewhere

export type HeaderCardProps = {
  fieldObject: Record<string, any>;
};

export const HeaderCard = ({ fieldObject }: HeaderCardProps) => {
  return (
    <QuoteColumnDisplay
      field={fieldObject}
      initialExpanded
      className="w-fit max-w-44"
    />
  );
};
