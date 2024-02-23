// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Subheader } from "./Subheader";
// import Fullheader from "./Fullheader";
// import QuoteCard from "./QuoteCard";
// import Left from "./Left";
// import { ClientType } from "@/src/types/custom/Client";
// import { supabase } from "@/src/supabase";
// import { QuoteType } from "@/src/types/custom/Quote";
// import { NonSystemField, quoteMetadataObject } from "@/src/types/metadata";
// import { isFieldVisible } from "@/src/types/utils/isFieldVisible";

// type ViewComparisonPage = {
//   client: ClientType;
// };

// export const ViewComparisonPage = () => {
//   //TODO: fix
//   const client = {
//     created_at: "323",
//     icon: "",
//     num_lives: 3,
//     user_id: 1,
//     name: "",
//     id: 1,
//   };
//   const router = useRouter();
//   const [quotes, setQuotes] = useState<QuoteType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("quotes")
//           .select()
//           .eq("client_id", client.id);
//         if (error) {
//           console.error("Error retrieving data:", error);
//         } else {
//           const orderedByAlphaData = data.sort((rowA, rowB) => {
//             if (rowA.name < rowB.name) return -1;
//             if (rowA.name > rowB.name) return 1;
//             return 0;
//           });
//           setQuotes(orderedByAlphaData);
//           setLoading(false);
//           console.log("Data retrieved successfully:", data);
//         }
//       } catch (error) {
//         alert("Error connecting to database");
//       }
//     };
//     fetchData();
//   }, [client.id]);

//   const visibleQuoteFields = Object.values(quoteMetadataObject).filter((val) =>
//     isFieldVisible(val),
//   ) as NonSystemField[];

//   const nonObjectVisibleQuoteFields = visibleQuoteFields.filter(
//     (val) => val.type !== "jsonb",
//   );

//   const objectVisibleQuoteFields = visibleQuoteFields.filter(
//     (val) => val.type == "jsonb",
//   );

//   const handleNewClientClick = () => {
//     router.push("/");
//   };

//   if (loading) {
//     return <></>;
//   }

//   return (
//     <div className="w-full h-fit bg-gray-100 pb-6">
//       <Fullheader />

//       <div className="h-full bg-gray-100 border border-gray-200 border-b-0 px-6 py-2">
//         <Subheader />
//         <div className="w-full overflow-x-auto">
//           <div className="p-0.5 flex w-fit h-fit gap-2">
//             <Left
//               nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
//               objectVisibleQuoteFields={objectVisibleQuoteFields}
//             />
//             {quotes.length > 0 ? (
//               quotes.map((quote) => {
//                 return (
//                   <QuoteCard
//                     key={quote.id}
//                     quote={quote}
//                     nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
//                     objectVisibleQuoteFields={objectVisibleQuoteFields}
//                   />
//                 );
//               })
//             ) : (
//               <div className="w-full mt-5 text-center">No Quotes Available</div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
