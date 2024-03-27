"use client";

import { createContext, useEffect, useState } from "react";

type QuoteSchemaContextProps = {
  quoteSchema: Record<string, any>;
};

export const QuoteSchemaContext = createContext<QuoteSchemaContextProps>({
  quoteSchema: [undefined, () => {}, true],
});

export const QuoteSchemaContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [quoteSchema, setQuoteSchema] = useState<any>();
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/get_quote_schema`,
      );
      if (response.ok) {
        const data = await response.json();

        // // Adding a new property to the filtered properties
        // filteredProperties.plan_name = {
        //   label: "Plan Name",
        //   type: "string",
        // };

        // Assign the modified object back to data.properties

        setQuoteSchema(data);
      }
    }
    fetchData();
  }, []);

  console.log("QUOTESCHEMA", quoteSchema);
  return (
    <QuoteSchemaContext.Provider value={{ quoteSchema }}>
      {children}
    </QuoteSchemaContext.Provider>
  );
};
