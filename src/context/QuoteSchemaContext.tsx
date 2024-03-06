"use client";

import { createContext, useEffect, useState } from "react";

type QuoteSchemaContextProps = {
  quoteSchema: any;
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
        setQuoteSchema(data);
      }
    }
    fetchData();
  }, []);
  return (
    <QuoteSchemaContext.Provider value={{ quoteSchema }}>
      {children}
    </QuoteSchemaContext.Provider>
  );
};
