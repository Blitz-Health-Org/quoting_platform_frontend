"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { IoHelpCircleSharp } from "react-icons/io5";
import { Subheader } from "../../components/comparison/Subheader";
import Contributions from "../../components/comparison/Contributions";
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
import { FaTrash } from "react-icons/fa";
import { SnackbarAlert } from "../../components/ui/SnackbarAlert";

type QuotingPageProps = {
  client: ClientType;
};

export default function QuotingPage() {
  const [client, setClient] = useState<ClientType>();
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customClasses, setCustomClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");
  const [showStandardContributions, setShowStandardContributions] = useState(true);
  const [editStandardContributions, setEditStandardContributions] = useState(false);
  
  const router = useRouter();

  const searchParams = useSearchParams();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });  

  const handleDeleteClass = (index: any) => {
    const updatedClasses = [...customClasses];
    updatedClasses.splice(index, 1);
    setCustomClasses(updatedClasses);

    // Check if the length of customClasses is zero and update showStandardContributions
    if (updatedClasses.length === 0) {
      setShowStandardContributions(true);
    }
  };

  const handleDownloadCSV = (index: any) => {
    setSnackbar({
      open: true,
      message: "This feature is coming soon!",
      severity: "info",
    });
  };

  useEffect(() => {
    // Attach resize event listener for future adjustments (if needed)
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      // Remove event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const determineInitialWidth = () => {
    if (typeof window !== 'undefined') {
    // Set initial width based on screen size
      if (window.innerWidth <= 368) {
        return "75%";
      } else if (window.innerWidth <= 624) {
        return "65%";
      } else if (window.innerWidth <= 904) {
        return "55%";
      } else if (window.innerWidth <= 1224) {
        return "40%";
      } else if (window.innerWidth <= 1424) {
        return "32.5%";
      } else {
        return "25%";
      }
    }
  };

  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenLeft: false,
    initialPaneWidth: determineInitialWidth(), // Set initial width based on screen size
    paneWidth: determineInitialWidth()
  });

  const handleResize = () => {
    if (typeof window !== 'undefined') {
      let newWidth: any;

      if (window.innerWidth <= 368) {
        newWidth = "75%";
      } else if (window.innerWidth <= 624) {
        newWidth = "65%";
      } else if (window.innerWidth <= 904) {
        newWidth = "55%";
      } else if (window.innerWidth <= 1224) {
        newWidth = "40%";
      } else if (window.innerWidth <= 1424) {
        newWidth = "32.5%";
      } else {
        newWidth = "25%";
      }

    setState((prevState) => ({ ...prevState, paneWidth: newWidth }));
  }
};

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

  const [standardContributions, setStandardContributions] = useState({
    ee: { percent: 100, employees: 50 },
    eeSpouse: { percent: 100, employees: 50 },
    eeChild: { percent: 100, employees: 50 },
    eeFamily: { percent: 100, employees: 50 },
  });

  // const handleEdit = () => {
  //   // Enable editing mode
  //   setEditStandardContributions(true);
  // };
  
  // const handleSave = () => {
  //   // Disable editing mode
  //   setEditStandardContributions(false);
  
  //   // Save the edited values to JSON
  //   const jsonResult = JSON.stringify(standardContributions);
  //   console.log(jsonResult);
  
  //   // You can save the JSON data to your desired location or state.
  //   // For example, you can send it to the server or store it in another state.
  // };
  
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

  const copyUrlToClipboard = () => {
    // Use window.location.href to get the current URL
    const url = window.location.href;
  
    // Use the Clipboard API to write the text
    navigator.clipboard
      .writeText(url)
      .then(() => {
        // Optional: Display a message or call a function to indicate success
        setSnackbar({
          open: true,
          message: "Copied to clipboard!",
          severity: "success",
        });
      })
      .catch((err) => {
        // Optional: Handle any errors
        console.error("Failed to copy URL to clipboard", err);
        setSnackbar({
          open: true,
          message: "Failed to copy URL to clipboard",
          severity: "error",
        });
      });
  };  

  return (
    <div className="w-full h-fit bg-gray-100 pb-6">
        <Fullheader clientName={client?.name || "N/A"} />
      <div className="h-full bg-gray-100 border border-gray-200 border-b-0 px-6 py-2">
      <Subheader isPaneOpen={state.isPaneOpen} onPaneToggle={handlePaneToggle} copyUrlToClipboard={copyUrlToClipboard} handleDownloadCSV={handleDownloadCSV} />

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
            width={state.paneWidth}
            onRequestClose={() => {
              // triggered on "<" on left top click or on outside click
              setState((prevState) => ({ ...prevState, isPaneOpen: false }))
            }}
          >
            {showStandardContributions && (
            <>
            <h1 className="mb-2 font-bold">Standard Contributions</h1>
            
              <Contributions/>

              <hr className="mt-4 mb-4"></hr>
              </>
              )}
            <h1 className="mb-2 font-bold">Custom Classes</h1>
            <form className="mt-2" onSubmit={(e) => handleNewClassSubmit(e)}>
              <div className="flex">
                <input
                  placeholder="Class Name"
                  className="py-0.5 px-2 outline outline-1 outline-gray-400 mr-2 h-10 rounded-sm w-4/5 hover:outline-gray-500 hover:cursor-pointer focus:cursor-auto"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                />
                <button
                  type="submit"
                  className="py-1 bg-neutral-800 text-gray-100 shadow rounded-sm h-10 text-sm px-2 w-1/5 hover:bg-neutral-900"
                >
                  New
                </button>
              </div>
            </form>
            <div>


            {customClasses.map((className, index) => (
              <div key={index} className="mb-1.5 flex-col items-center justify-left mt-6">
                <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => handleDeleteClass(index)}
                  className="rounded-sm text-sm"
                >
                  <FaTrash/>
                </button>
                  <p className="mr-2 font-bold">Class #{index + 1} : {className}</p>
                  </div>
                  <Contributions/>
              </div>
            ))}
            </div>
            <br />
          </SlidingPane>
        </div>

        <SnackbarAlert
          openSnackbarShare={snackbar.open}
          setOpenSnackbarShare={setSnackbar}
          snackbar={{
            open: snackbar.open,
            message: snackbar.message,
            severity: snackbar.severity,
          }}
        />

    </div>
  );
  }
