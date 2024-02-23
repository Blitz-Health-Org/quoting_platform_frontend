"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { IoHelpCircleSharp } from "react-icons/io5";
import { Subheader } from "../../components/comparison/Subheader";
import '../../components/comparison/sum.css'; // import your custom styles
import Fullheader from "../../components/comparison/Fullheader";
import QuoteCard from "../../components/comparison/QuoteCard";
import Left from "../../components/comparison/Left";
import { ClientType } from "@/src/types/custom/Client";
import { supabase } from "@/src/supabase";
import { QuoteType } from "@/src/types/custom/Quote";
import { NonSystemField, quoteMetadataObject } from "@/src/types/metadata";
import { isFieldVisible } from "@/src/types/utils/isFieldVisible";
import { useSearchParams, useRouter } from "next/navigation";
import SlidingPane from "react-sliding-pane";
import 'react-sliding-pane/dist/react-sliding-pane.css';
import InputSlider from "../../components/comparison/Slider";
import Input from "@mui/material/Input";

type QuotingPageProps = {
  client: ClientType;
};

export default function QuotingPage() {
  const [client, setClient] = useState(null);
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customClasses, setCustomClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");
  const [showStandardContributions, setShowStandardContributions] = useState(true);
  
  const router = useRouter();

  const searchParams = useSearchParams();

  // useEffect(() => {
  //   // Attach resize event listener for future adjustments (if needed)
  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('resize', handleResize);

  //     // Remove event listener on component unmount
  //     return () => {
  //       window.removeEventListener('resize', handleResize);
  //     };
  //   }
  // }, []);

  // const determineInitialWidth = () => {
  //   if (typeof window !== 'undefined') {
  //   // Set initial width based on screen size
  //     if (window.innerWidth <= 368) {
  //       return "100%";
  //     } else if (window.innerWidth <= 624) {
  //       return "80%";
  //     } else if (window.innerWidth <= 904) {
  //       return "60%";
  //     } else if (window.innerWidth <= 1224) {
  //       return "40%";
  //     } else if (window.innerWidth <= 1424) {
  //       return "32.5%";
  //     } else {
  //       return "25%";
  //     }
  //   }
  // };

  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
    // initialPaneWidth: determineInitialWidth(), // Set initial width based on screen size
    // paneWidth: determineInitialWidth()
  });

  // const handleResize = () => {
  //   if (typeof window !== 'undefined') {
  //     let newWidth: any;

  //     if (window.innerWidth <= 368) {
  //       newWidth = "100%";
  //     } else if (window.innerWidth <= 624) {
  //       newWidth = "80%";
  //     } else if (window.innerWidth <= 904) {
  //       newWidth = "60%";
  //     } else if (window.innerWidth <= 1224) {
  //       newWidth = "40%";
  //     } else if (window.innerWidth <= 1424) {
  //       newWidth = "32.5%";
  //     } else {
  //       newWidth = "25%";
  //     }

  //   setState((prevState) => ({ ...prevState, paneWidth: newWidth }));
  // };

  const handlePaneToggle = (newState: any) => {
    setState((prevState) => ({ ...prevState, isPaneOpen: newState }));
  };

  useEffect(() => {
    const clientId = searchParams.get("clientId");
    const quoteIds = searchParams.get("quoteIds");

    if (clientId && quoteIds) {
      // Convert quoteIds back into an array of IDs
      const ids = quoteIds.split(",").map((id) => id.trim());
      fetchClientAndQuotes(clientId, ids);
    }

    setLoading(false);
  }, [searchParams]);

  const fetchClientAndQuotes = async (clientId: string, quoteIds: string[]) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) throw clientError;

      setClient(clientData);

      // Fetch quotes data by IDs, assuming 'id' is in quoteIds array
      const { data: quotesData, error: quotesError } = await supabase
        .from("quotes")
        .select("*")
        .in("id", quoteIds);

      if (quotesError) throw quotesError;

      const orderedByAlphaData = quotesData.sort((rowA, rowB) => {
        if (rowA.name < rowB.name) return -1;
        if (rowA.name > rowB.name) return 1;
        return 0;
      });

      setQuotes(orderedByAlphaData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle errors, such as setting an error state or showing a notification
    }
  };

  const handleNewClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClass.trim() !== "") {
      setCustomClasses([...customClasses, newClass.trim()]);
      setNewClass("");
      setShowStandardContributions(false); // Hide Standard Contributions
    }
  };
  
  const visibleQuoteFields = Object.values(quoteMetadataObject).filter((val) =>
    isFieldVisible(val),
  ) as NonSystemField[];

  const nonObjectVisibleQuoteFields = visibleQuoteFields.filter(
    (val) => val.type !== "jsonb",
  );

  const objectVisibleQuoteFields = visibleQuoteFields.filter(
    (val) => val.type == "jsonb",
  );

  if (loading) {
    return <></>;
  }

  return (
    <div className="w-full h-fit bg-gray-100 pb-6">
      <Fullheader />

      <div className="h-full bg-gray-100 border border-gray-200 border-b-0 px-6 py-2">
      <Subheader isPaneOpen={state.isPaneOpen} onPaneToggle={handlePaneToggle} />

        <div className="w-full overflow-x-auto">
          <div className="p-0.5 flex w-fit h-fit gap-2">
            
            <Left
              nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
              objectVisibleQuoteFields={objectVisibleQuoteFields}
            />
            {quotes.length > 0 ? (
              quotes.map((quote) => {
                return (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    nonObjectVisibleQuoteFields={nonObjectVisibleQuoteFields}
                    objectVisibleQuoteFields={objectVisibleQuoteFields}
                  />
                );
              })
            ) : (
              <div className="w-full mt-5 text-center">No Quotes Available</div>
            )}
          </div>
        </div>
      </div>
      <div>
          <SlidingPane
            className="slide-pane_overlay2"
            overlayClassName="slide-pane_overlay2"
            isOpen={state.isPaneOpen}
            title="Settings"
            subtitle="Set classes and contribution structures." 
            width="25%"
            onRequestClose={() => {
              // triggered on "<" on left top click or on outside click
              setState((prevState) => ({ ...prevState, isPaneOpen: false }))
            }}
          >
            {showStandardContributions && (
            <>
            <h1 className="mb-2 font-bold">Standard Contributions</h1>
            <div className="mb-1.5 flex items-center justify-left">
              <p className="text-sm mr-2 font-bold">EE</p>
              <p className="mr-2">|</p>
              <Input
                  className="w-11"
                  defaultValue={100}
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 100,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              <p className="text-sm text-gray-500 mr-2">%</p>
              <p className="mr-2">|</p>
              <Input
                  className="w-12"
                  defaultValue={50}
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 10000,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              <p className="text-sm text-gray-800">Employees</p>
            </div>
            <div className="mb-1.5 flex items-center justify-left">
              <p className="text-sm mr-2 font-bold">EE/Spouse</p>
              <p className="mr-2">|</p>
              <Input
                  className="w-11"
                  defaultValue={100}
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 100,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              <p className="text-sm text-gray-500 mr-2">%</p>
              <p className="mr-2">|</p>
              <Input
                  className="w-12"
                  defaultValue={50}
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 10000,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              <p className="text-sm text-gray-800">Employees</p>
            </div>
            <div className="mb-1.5 flex items-center justify-left">
            <p className="text-sm mr-2 font-bold">EE/Child</p>
              <p className="mr-2">|</p>
              <Input
                  className="w-11"
                  defaultValue={100}
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 100,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              <p className="text-sm text-gray-500 mr-2">%</p>
              <p className="mr-2">|</p>
              <Input
                  className="w-12"
                  defaultValue={50}
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 10000,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              <p className="text-sm text-gray-800">Employees</p>
            </div>
            <div className="mb-1.5 flex items-center justify-left">
            <p className="text-sm mr-2 font-bold">EE/Family</p>
              <p className="mr-2">|</p>
              <Input
                  className="w-11"
                  defaultValue={100}
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 100,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              <p className="text-sm text-gray-500 mr-2">%</p>
              <p className="mr-2">|</p>
              <Input
                  className="w-12"
                  defaultValue={50}
                  size="small"
                  inputProps={{
                    step: 1,
                    min: 0,
                    max: 10000,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              <p className="text-sm text-gray-800">Employees</p>
              </div>
              <hr className="mt-4"></hr>
              </>
              )}
            <h1 className="mb-2 font-bold mt-4">Custom Classes</h1>
            <form className="mt-4" onSubmit={(e) => handleNewClassSubmit(e)}>
              <div className="flex">
                <input
                  placeholder="Class Name"
                  className="p-1 outline outline-1 outline-gray-400 bg-gray-100 mr-2 h-10 rounded-sm"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                />
                <button
                  type="submit"
                  className="outline py-1 outline-1 outline-gray-400 bg-gray-100 rounded-sm h-10 text-sm px-2"
                >
                  New
                </button>
              </div>
            </form>
            <div>


            {customClasses.map((className, index) => (
              <div key={index} className="mb-1.5 flex-col items-center justify-left mt-4">
                <p className="text-sm mr-2 font-bold">{className}</p>
                <div className="mb-1.5 flex items-center justify-left">
                  <p className="text-sm mr-2 font-bold">EE</p>
                  <p className="mr-2">|</p>
                  <Input
                      className="w-11"
                      defaultValue={100}
                      size="small"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 100,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  <p className="text-sm text-gray-500 mr-2">%</p>
                  <p className="mr-2">|</p>
                  <Input
                      className="w-12"
                      defaultValue={50}
                      size="small"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 10000,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  <p className="text-sm text-gray-800">Employees</p>
                </div>
                <div className="mb-1.5 flex items-center justify-left">
                  <p className="text-sm mr-2 font-bold">EE/Spouse</p>
                  <p className="mr-2">|</p>
                  <Input
                      className="w-11"
                      defaultValue={100}
                      size="small"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 100,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  <p className="text-sm text-gray-500 mr-2">%</p>
                  <p className="mr-2">|</p>
                  <Input
                      className="w-12"
                      defaultValue={50}
                      size="small"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 10000,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  <p className="text-sm text-gray-800">Employees</p>
                </div>
                <div className="mb-1.5 flex items-center justify-left">
                <p className="text-sm mr-2 font-bold">EE/Child</p>
                  <p className="mr-2">|</p>
                  <Input
                      className="w-11"
                      defaultValue={100}
                      size="small"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 100,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  <p className="text-sm text-gray-500 mr-2">%</p>
                  <p className="mr-2">|</p>
                  <Input
                      className="w-12"
                      defaultValue={50}
                      size="small"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 10000,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  <p className="text-sm text-gray-800">Employees</p>
                </div>
                <div className="mb-1.5 flex items-center justify-left">
                <p className="text-sm mr-2 font-bold">EE/Family</p>
                  <p className="mr-2">|</p>
                  <Input
                      className="w-11"
                      defaultValue={100}
                      size="small"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 100,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  <p className="text-sm text-gray-500 mr-2">%</p>
                  <p className="mr-2">|</p>
                  <Input
                      className="w-12"
                      defaultValue={50}
                      size="small"
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: 10000,
                        type: "number",
                        "aria-labelledby": "input-slider",
                      }}
                    />
                  <p className="text-sm text-gray-800">Employees</p>
                </div>
              </div>
            ))}

            </div>
            <br />
          </SlidingPane>
        </div>
    </div>
  );
  }
