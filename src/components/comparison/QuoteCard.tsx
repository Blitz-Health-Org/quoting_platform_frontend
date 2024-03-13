// import { useRef, useState } from "react";
// import Image from "next/image";
// import Apple from "@/public/Screenshot.png";
// import { QuoteType } from "@/src/types/custom/Quote";
// import { NonSystemField } from "@/src/types/metadata";
// import { supabase } from "@/src/supabase";
// import { useListenClickOutside } from "../ui/dropdown/utils/useListenClickOutside";
// import { valueOrDefault } from "chart.js/dist/helpers/helpers.core";
// import { calculateTotalCost } from "./utils/calculateTotalCost";

import { QuoteColumnDisplay } from "./QuoteColumnDisplay";
import Image from "next/image";
import { useCalculateTotalCost } from "./utils/useCalculateTotalCost";
import { MdOutlineArrowDropDown, MdOutlineArrowRight } from "react-icons/md";

// type QuoteCardProps = {
//   quote: QuoteType;
//   fieldObject: any;
//   classes: any;
//   standardContribution: any;
// };

export type QuoteCardProps = {
  fieldObject: any;
  quote: any;
  plan: any;
  classes: any;
  standardContribution: any;
};

export const QuoteCard = ({
  fieldObject,
  quote,
  plan,
  classes,
  standardContribution,
}: QuoteCardProps) => {
  quote.data.total_employer_cost = useCalculateTotalCost(
    quote.data,
    standardContribution,
    classes,
    {
      employee: (quote.data as any)?.["employee_rate"],
      child: (quote.data as any)?.["child_rate"],
      family: (quote.data as any)?.["family_rate"],
      spouse: (quote.data as any)?.["spouse_rate"],
    },
  );
  console.log("quotedata jere", quote.data);

  return (
    <QuoteColumnDisplay
      field={fieldObject}
      quoteData={quote.data}
      isQuoteCard
      initialExpanded
      // headerComponent={
      //   <div className="flex w-full gap-3 h-28 justify-center items-center px-2">
      //     <div className="max-w-1/2 truncate">
      //       <h1 className="font-bold text-lg text-wrap max-w-">{plan.name}</h1>
      //     </div>
      //     <div className="border-r border-1.5 h-10 border-gray-600"></div>{" "}
      //     {/* Vertical line break */}
      //     <div className="flex max-w-1/2 truncate">
      //       <div className="flex items-center justify-center">
      //         {plan.selectedQuotes[0].logo_url && (
      //           <Image
      //             src={plan.selectedQuotes[0].logo_url}
      //             alt={`Logo for ${plan.selectedQuotes[0].carrier}`}
      //             width={30}
      //             height={30}
      //             className="mr-2 rounded-md"
      //           />
      //         )}
      //       </div>
      //       <div className="flex flex-col items-start justify-center ml-1">
      //         <h1 className="font-bold text-xl">
      //           {plan.selectedQuotes[0].carrier}
      //         </h1>
      //         <p className="text-sm">{"aetna.com"}</p>
      //       </div>
      //     </div>
      //   </div>
      // }
    />
  );
};

// //DEPRECATED
// export default function QuoteCard({
//   quote,
//   fieldObject,
//   classes,
//   standardContribution,
// }: QuoteCardProps) {
//   const [quoteData, setQuoteData] = useState<any>(quote);

//   const [textAreaSelected, setTextAreaSelected] = useState<boolean>(false);
//   const ref1 = useRef();
//   const ref2 = useRef();
//   const ref3 = useRef();

//   const totalValue = calculateTotalCost(standardContribution, classes, {
//     employee: (quote.data as any)?.["employee_only_rate"],
//     child: (quote.data as any)?.["employee_child_rate"],
//     family: (quote.data as any)?.["employee_family_rate"],
//     spouse: (quote.data as any)?.["employee_spouse_rate"],
//   });

//   function valueOrDefault(val: any, def: string = "N/A") {
//     return val ?? def;
//   }

//   function handleQuoteChange(path: string) {
//     return (event: React.ChangeEvent<HTMLTextAreaElement>) => {
//       const newValue = event.target.value;

//       // Split the path into parts if it's nested, e.g., 'oop.name' becomes ['oop', 'name']
//       const pathParts = path.split(".");

//       // Function to recursively update the nested object
//       const updateNestedObject = (obj: any, pathParts: any, value: any) => {
//         // Clone the object at the current level
//         let updated = { ...obj };

//         // If we're at the last part of the path, update the value
//         if (pathParts.length === 1) {
//           updated[pathParts[0]] = value;
//         } else {
//           // If not, recursively update the next level
//           const [currentPart, ...remainingParts] = pathParts;
//           updated[currentPart] = updateNestedObject(
//             obj[currentPart] || {},
//             remainingParts,
//             value,
//           );
//         }

//         return updated;
//       };

//       // Update the quoteData using the recursive function
//       const updatedQuote = updateNestedObject(quoteData, pathParts, newValue);

//       // Update the state with the new quote
//       setQuoteData(updatedQuote);
//     };
//   }

//   useListenClickOutside({
//     refs: [ref1 as any, ref2 as any, ref3 as any],
//     callback: async (event) => {
//       // SEND DATA
//       try {
//         const { data, error } = await supabase
//           .from("quotes") // Replace with your actual table name
//           .upsert(quoteData);

//         if (error) {
//           console.error("Error inserting data:", error);
//         } else {
//           console.log("Data inserted successfully:", data);
//         }
//       } catch (error) {
//         console.error("Error connecting to Supabase:", error);
//       }
//       setTextAreaSelected(false);
//     },
//     enabled: textAreaSelected,
//   });

//   return (
//     // <RecursiveColumnDisplay quoteData={quote.data} field={fieldObject} />
//     //   <div className="w-full">
//     //     <hr className="w-full border-t-1 border-gray-300"></hr>

//     //     <div className="flex flex-col items-center bg-violet-100/60">
//     //       {fieldObject
//     //         .filter(
//     //           (field) => field.field !== "name" && field.field !== "website",
//     //         )
//     //         .map((field) => {
//     //           return (
//     //             <>
//     //               <textarea
//     //                 ref={ref1 as any}
//     //                 onClick={() => setTextAreaSelected(true)}
//     //                 onChange={handleQuoteChange(field.field)}
//     //                 value={valueOrDefault((quoteData as any)[field.field])}
//     //                 className="text-center resize-none text-sm content-center h-7 w-full bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto rounded-md p-1"
//     //               />
//     //               <hr className="w-full border-t-1 border-gray-300"></hr>
//     //             </>
//     //           );
//     //         })}

//     //       {quoteData?.plan_type ? (
//     //         <>
//     //           <div className="flex w-full">
//     //             <textarea
//     //               disabled
//     //               value={valueOrDefault(quoteData.plan_type)}
//     //               className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
//     //             />
//     //             <textarea
//     //               disabled
//     //               defaultValue={"Out-of-Network"}
//     //               className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
//     //             />
//     //           </div>
//     //           <hr className="w-full border-t-1 border-gray-500"></hr>

//     //           {objectVisibleQuoteFields.map((objectField) => {
//     //             return (
//     //               <>
//     //                 <div className="flex w-full">
//     //                   <textarea
//     //                     disabled
//     //                     className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent border-r focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
//     //                   />
//     //                   <textarea
//     //                     disabled
//     //                     className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
//     //                   />
//     //                 </div>

//     //                 {Object.entries(
//     //                   JSON.parse(objectField.json_structure as string),
//     //                 ).map(([subFieldKey, value]) => {
//     //                   return (
//     //                     <>
//     //                       <hr className="w-full border-t-1 border-gray-300"></hr>
//     //                       <div className="flex w-full bg-white">
//     //                         <textarea
//     //                           ref={ref3 as any}
//     //                           onClick={() => setTextAreaSelected(true)}
//     //                           onChange={handleQuoteChange(
//     //                             `${objectField.field}.in.${subFieldKey}`,
//     //                           )}
//     //                           value={valueOrDefault(
//     //                             (quoteData as any)[objectField.field]?.in?.[
//     //                               subFieldKey
//     //                             ],
//     //                           )}
//     //                           className="text-center resize-none text-sm content-center h-7 w-1/2 border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
//     //                         />
//     //                         <textarea
//     //                           ref={ref2 as any}
//     //                           onClick={() => setTextAreaSelected(true)}
//     //                           onChange={handleQuoteChange(
//     //                             `${objectField.field}.oon.${subFieldKey}`,
//     //                           )}
//     //                           value={valueOrDefault(
//     //                             (quoteData as any)[objectField.field]?.oon?.[
//     //                               subFieldKey
//     //                             ],
//     //                           )}
//     //                           className="text-center resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
//     //                         />
//     //                       </div>
//     //                     </>
//     //                   );
//     //                 })}
//     //                 <hr className="w-full border-t-1 border-gray-500"></hr>
//     //               </>
//     //             );
//     //           })}
//     //         </>
//     //       ) : (
//     //         <>
//     //           <div className="flex w-full">
//     //             <textarea
//     //               disabled
//     //               // value={valueOrDefault(quoteData.plan_type)}
//     //               className="text-center font-semibold resize-none text-sm content-center h-7 w-1/2 bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
//     //             />
//     //           </div>
//     //           <hr className="w-full border-t-1 border-gray-500"></hr>

//     //           {objectVisibleQuoteFields.map((objectField) => {
//     //             return (
//     //               <>
//     //                 <div className="flex w-full">
//     //                   <textarea
//     //                     disabled
//     //                     className="text-center resize-none text-sm content-center h-7 w-full bg-transparent border-r focus:outline-0 focus:border focus:border-1 focus:border-gray-200 focus:cursor-auto p-1"
//     //                   />
//     //                 </div>

//     //                 {Object.entries(
//     //                   JSON.parse(objectField.json_structure as string),
//     //                 ).map(([subFieldKey, value]) => {
//     //                   // console.log(
//     //                   //   "check this stuff",
//     //                   //   quoteData,
//     //                   //   objectField,
//     //                   //   subFieldKey,
//     //                   // );
//     //                   return (
//     //                     <>
//     //                       <hr className="w-full border-t-1 border-gray-300"></hr>
//     //                       <div className="flex w-full bg-white">
//     //                         <textarea
//     //                           ref={ref3 as any}
//     //                           onClick={() => setTextAreaSelected(true)}
//     //                           onChange={handleQuoteChange(
//     //                             `${objectField.field}.${subFieldKey}`,
//     //                           )}
//     //                           value={valueOrDefault(
//     //                             (quoteData as any)[objectField.field]?.[
//     //                               subFieldKey
//     //                             ],
//     //                           )}
//     //                           className="text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
//     //                         />
//     //                       </div>
//     //                     </>
//     //                   );
//     //                 })}
//     //                 <hr className="w-full border-t-1 border-gray-500"></hr>
//     //               </>
//     //             );
//     //           })}
//     //         </>
//     //       )}

//     //       <div className="flex w-full">
//     //         <textarea
//     //           disabled
//     //           className="font-semibold text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
//     //         />
//     //       </div>
//     //       <hr className="w-full border-t-1 border-gray-300"></hr>
//     //       <div className="flex w-full bg-white">
//     //         <textarea
//     //           value={totalValue}
//     //           className="text-center resize-none text-sm content-center h-7 w-full border-r bg-transparent focus:outline-0 focus:border focus:border-1 focus:border-gray-200 cursor-pointer focus:cursor-auto p-1"
//     //         />
//     //       </div>
//     //     </div>
//     //   </div>
//     <></>
//   );
// }
