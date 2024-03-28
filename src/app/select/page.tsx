"use client";

import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { MdFileUpload } from "react-icons/md";
import { supabase } from "../../supabase";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { QuoteType } from "@/src/types/custom/Quote";
import { IconBuilding } from "@tabler/icons-react";
import SelectQuotesHeader from "../../components/comparison/SelectQuotesHeader";
import { AddQuote } from "@/src/components/client/modal/AddQuote";
import { Navbar } from "@/src/components/comparison/Navbar";
import SelectSidebar from "@/src/components/SelectSidebar";
import { SocketTasksContext } from "@/src/context/SocketContext";
import AddCurrentPlanModal from "@/src/components/comparison/AddCurrentPlanModal";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { QuotesTable } from "@/src/components/client/QuotesTable";
import TabHeader from "@/src/components/ui/TabHeader";
import { ActionBar } from "./ActionBar";
import { QuoteSchemaContext } from "@/src/context/QuoteSchemaContext";

export type TabOption =
  | "Updated"
  | "ACA"
  | "Dental"
  | "Vision"
  | "LTD"
  | "Group Term Life"
  | "Ancillary Rates";

const TABS: TabOption[] = [
  "Updated",
  "ACA",
  "Dental",
  "Vision",
  "LTD",
  "Group Term Life",
  "Ancillary Rates",
];

export type CoverageTypeOption =
  | "medical"
  | "dental"
  | "vision"
  | "long_term_disability"
  | "group_term_life"
  | "rates";

const TABS_TO_COVERAGE_TYPE_MAPPING: Record<TabOption, CoverageTypeOption> = {
  Updated: "medical",
  ACA: "medical",
  Dental: "dental",
  Vision: "vision",
  LTD: "long_term_disability",
  "Group Term Life": "group_term_life",
  "Ancillary Rates": "rates",
};

export type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

export default function SelectQuotes() {
  type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

  const [modalOpen, setModalOpen] = useState<string>("");

  const { quoteSchema } = useContext(QuoteSchemaContext);

  const displayedPlanAttributesByCoverageType: Record<string, string[]> = {
    ...Object.entries(quoteSchema).reduce(
      (acc: Record<string, string[]>, [coverageType, coverageTypeSchema]) => {
        // Assuming coverageTypeSchema has a structure similar to { properties: { ... } }
        // and you want to collect the labels of these properties:
        if (!coverageTypeSchema.properties) {
          return acc;
        }
        const labels = Object.entries(coverageTypeSchema.properties).map(
          ([_, propertySchema]) => (propertySchema as any).label,
        );
        return { ...acc, [coverageType]: labels };
      },
      {},
    ),
    medical: [
      "carrier",
      "plan_id",
      "deductible",
      "coinsurance",
      "out_of_pocket_max",
      "employee_rate",
      "total_employer_cost",
    ],
  };

  const {
    socketTasks: [socketTasks, setSocketTasks],
  } = useContext(SocketTasksContext);

  const fetchQuoteData = async (client: any) => {
    if (client) {
      const { data, error } = await supabase
        .from("quotes")
        .select()
        .eq("client_id", client.id);

      if (error) {
        alert("Error updating data");
        router.push("/404");
      } else {
        // Check if selected_quotes is not null

        setQuotes(data);
        setOriginalQuotes(data);

        if (client.connected_plans) {
          // Check if there is data for connected_plans
          setPlans((client.connected_plans as any) || []); // Update plans state
        }
      }
    }
  };

  const searchParams = useSearchParams();

  const [selectedClient, setSelectedClient] = useState<ClientType>(
    undefined as unknown as ClientType,
  );

  const { setSnackbar } = useContext(SnackBarContext);
  const [file, setFile] = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("bcbs_tx_aca");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [customRange, setCustomRange] = useState("");
  const [isRangeValid, setIsRangeValid] = useState(true);
  const [rangeSelection, setRangeSelection] = useState("all"); // Dropdown selection state
  const [currentTab, setCurrentTab] = useState<string>("Medical");
  const [prevCurrentTab, setPrevCurrentTab] = useState<string>(currentTab);
  const [optionalParams, setOptionalParams] = useState<OptionalParamsType>({
    optionalRanges: {
      censusDataRange: "",
      ratesRange: "",
      quotesRange: "",
    },
    is_aca: false,
  });

  const [selectedQuotes, setSelectedQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );

  const handleBusiness = () => {
    setSnackbar({
      open: true,
      message: "This feature is coming soon!",
      severity: "info",
    });
  };

  async function setCurrentPlan() {
    const currentPlan = plans.find((plan) => plan.isCurrentPlan);
    if (currentPlan) {
      const updatedPlans = plans.map((plan) =>
        plan.id === currentPlan.id
          ? {
              ...currentPlan,
              selectedQuotes: [
                ...currentPlan.selectedQuotes,
                ...selectedQuotes,
              ],
            }
          : plan,
      );
      const { success } = await updateConnectedPlans(updatedPlans);
      if (success) {
        setPlans(updatedPlans);
      } else {
        alert("Upload failed");
        return;
      }
      handleClearCheckboxes();
    } else {
      createNewPlanAndAddSelectedQuotes(true);
    }
  }

  const comparison_created_false = async () => {
    const { data, error } = await supabase
      .from("clients") // Replace 'your_table_name' with your actual table name
      .update({ comparison_created: false }) // 'plans' is the array to insert into the 'connected_plans' column
      .match({ id: selectedClient.id }); // Assuming 'selectedClient.id' is the primary key of the row you want to update

    if (error) {
      console.error("Error updating connected plans in Supabase:", error);
      return { success: false, error };
    }

    console.log("Connected plans updated successfully:", data);
    return { success: true, data };
  };

  const updateConnectedPlans = async (updatedPlans: any) => {
    if (updatedPlans.length === 0) {
      comparison_created_false();
    }
    const { data, error } = await supabase
      .from("clients") // Replace 'your_table_name' with your actual table name
      .update({ connected_plans: updatedPlans }) // 'plans' is the array to insert into the 'connected_plans' column
      .match({ id: selectedClient.id }); // Assuming 'selectedClient.id' is the primary key of the row you want to update
    if (error) {
      console.error("Error updating connected plans in Supabase:", error);
      return { success: false, error };
    }
    console.log("Connected plans updated successfully:", data);

    return { success: true, data };
  };

  const createNewPlanAndAddSelectedQuotes = (isCurrentPlan = false) => {
    console.log("running create new plan and add selected qutoes");
    const newPlan = {
      id: Date.now(),
      isCurrentPlan: false,
      name: `Option #${plans.length + 1}`,
      selectedQuotes: selectedQuotes,
    };
    setPlans([...plans, newPlan]);
    handleClearCheckboxes();
    setSnackbar({
      open: true,
      message: "Plan added! Make sure to save your changes.",
      severity: "success",
    });
  };

  async function deleteQuotes() {
    console.log("DELETE", quotes, selectedQuotes);
    setQuotes(
      quotes.filter(
        (quote) =>
          !selectedQuotes
            .map((selectedQuote) => selectedQuote.id)
            .includes(quote.id),
      ),
    );
    const { error } = await supabase
      .from("quotes")
      .delete()
      .in(
        "id",
        selectedQuotes.map((quote) => quote.id),
      );
    handleClearCheckboxes();
  }

  const selectQuotesFirst = () => {
    setSnackbar({
      open: true,
      message: "Select quotes to add them to a plan!",
      severity: "error",
    });
  };

  const [quotes, setQuotes] = useState<QuoteTypeWithCheckbox[]>([]);
  const [originalQuotes, setOriginalQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );

  const [currentTab, setCurrentTab] = useState<string>("Updated");

  const coverageType = TABS_TO_COVERAGE_TYPE_MAPPING[currentTab as TabOption];
  const planAttributes = displayedPlanAttributesByCoverageType[coverageType];
  console.log("PLANATTRIBUTES", planAttributes);

  const [search, setSearch] = useState<string | undefined>();


    if (currentTab === "Medical") {
      setSelectedPlan("bcbs_tx_aca");
    }

  const [entryWidth, setEntryWidth] = useState(
    innerWidth / planAttributes.length,
  );

  const actionBarEntries = [
    {
      label: "Delete",
      onClick: deleteQuotes,
      //TODO: add icon here
    },
    {
      label: "Set as Current Plan Option",
      onClick: setCurrentPlan,
    },
    {
      label: "Add to New Option",
      onClick: createNewPlanAndAddSelectedQuotes,
    },
  ];

  useEffect(() => {
    // Update entryWidth when the screen size changes

    const handleResize = () => {
      setEntryWidth(innerWidth / planAttributes.length);
    };

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleCheckboxChange = (quoteId: number) => {
    setQuotes((prevQuotes) =>
      prevQuotes?.map((quote) =>
        quote.id === quoteId
          ? { ...quote, isSelected: !quote.isSelected }
          : quote,
      ),
    );


  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  function validateCustomRangeAndParse(range: string) {
    if (range === "") {
      setIsRangeValid(true);
      return [];
    }
    const ranges = range.split(",").map((part) => {
      const numbers = part.trim().split("-").map(Number);
      // If it's a single number, duplicate it to make a range [number, number]
      if (numbers.length === 1 && !isNaN(numbers[0])) {
        return [numbers[0], numbers[0]];
      }
      // If it's a proper range and both numbers are valid, return the range
      else if (
        numbers.length === 2 &&
        !isNaN(numbers[0]) &&
        !isNaN(numbers[1])
      ) {
        return numbers;
      }
      // If neither, return null to indicate invalid input
      return null;
    });

    // Update the state with the sorted quotes
    setQuotes(sortedQuotes);
  };

  console.log("QUOTES", quotes);

  const router = useRouter();

  const fetchClients = useCallback(async (clientId: number) => {
    try {
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();
      if (clientError) throw clientError;
      fetchQuoteData(clientData);
      setSelectedClient(clientData);

      return clientData;
    } catch (error) {
      console.error("Failed to fetch client and quotes", error);
    }
  }

  function validateSubRangesWithinMainRange(
    ranges: (number[] | null)[],
    censusDataRanges: (number[] | null)[],
    quoteRanges: (number[] | null)[],
    rateRanges: (number[] | null)[],
  ) {
    console.log(
      "MADE IT HERE",
      ...(censusDataRanges
        .flat()
        .filter(
          (item) => item !== null && typeof item === "number",
        ) as number[]),
      ...(ranges
        .flat()
        .filter(
          (item) => item !== null && typeof item === "number",
        ) as number[]),
    );
    return !(
      Math.max(
        ...(censusDataRanges
          .flat()
          .filter(
            (item) => item !== null && typeof item === "number",
          ) as number[]),
        ...(rateRanges
          .flat()
          .filter(
            (item) => item !== null && typeof item === "number",
          ) as number[]),
        ...(quoteRanges
          .flat()
          .filter(
            (item) => item !== null && typeof item === "number",
          ) as number[]),
      ) >
        Math.max(
          ...(ranges
            .flat()
            .filter(
              (item) => item !== null && typeof item === "number",
            ) as number[]),
        ) ||
      Math.min(
        ...(censusDataRanges
          .flat()
          .filter(
            (item) => item !== null && typeof item === "number",
          ) as number[]),
        ...(rateRanges
          .flat()
          .filter(
            (item) => item !== null && typeof item === "number",
          ) as number[]),
        ...(quoteRanges
          .flat()
          .filter(
            (item) => item !== null && typeof item === "number",
          ) as number[]),
      ) <
        Math.min(
          ...(ranges
            .flat()
            .filter(
              (item) => item !== null && typeof item === "number",
            ) as number[]),
        )
    );
  }

  const handleUpload = async (ranges?: number[][]) => {
    console.log("HELLO?????");
    if (!file) {
      setSnackbar({
        open: true,
        message: "Please upload a file",
        severity: "error",
      });
      return;
    }
    const errFiles = [] as string[];
    const successfulFileUrls: string[] = [];
    const fileId = uuid();
    try {
      console.log("selectedPlan", selectedPlan);
      const fileName = `${selectedPlan}/${fileId}/whole`;
      await supabase.storage.from("images").upload(fileName, file);

    // setQuotes()

    const clientId = selectedClient.id;

    const { data: insertData, error: insertError } = await supabase
      .from("clients") // Replace with your actual Supabase table name
      .upsert({ id: selectedClient.id, selected_quotes: selectedQuoteIds });

    if (insertError) {
      console.error("Error inserting row into Supabase table:", insertError);
      return { success: false };
    } else {
      router.push(
        `/quotes?clientId=${clientId}&type=${TABS_TO_COVERAGE_TYPE_MAPPING[currentTab as TabOption]}`,
      );

      return { success: true };
    }
  }

  if (selectedClient && socketTasks?.includes("fetch_quotes")) {
    fetchQuoteData(selectedClient);
    setSocketTasks(socketTasks?.filter((task) => task !== "fetch_quotes"));
  }

      if (!data?.publicUrl) {
        throw new Error("No url found for file");
      }

      // const fileUrl = data.publicUrl;

  useEffect(() => {
    const clientId = searchParams.get("clientId");


      // Send the fileName instead of fileUrl to backend so we can parse out the carrier name
      successfulFileUrls.push(fileName);
    } catch {
      errFiles.push(file.name);
    }

  function filterQuotesByCoverageType(coverage_type: string, isACA?: boolean) {
    let internalFilteredQuotes = quotes;

    internalFilteredQuotes = internalFilteredQuotes.filter((quote) => {
      return (
        ((quote?.["data"]?.["metadata"] as any)?.["coverage_type"] ??
          "medical") === coverage_type
      );
    });

    if (typeof isACA !== "undefined" && coverage_type === "medical") {
      internalFilteredQuotes = internalFilteredQuotes.filter((quote) => {
        const isAcaMetadata = (quote?.["data"]?.["metadata"] as any)?.[
          "is_aca"
        ];
        // Explicitly treat undefined as false
        const isAcaValue = isAcaMetadata === undefined ? false : isAcaMetadata;
        console.log("CHECK", isAcaMetadata, isACA, isAcaValue === isACA);
        return isAcaValue === isACA;
      });
    }

    return internalFilteredQuotes;
  }

  let filteredQuotes = filterQuotesByCoverageType(
    TABS_TO_COVERAGE_TYPE_MAPPING[currentTab as TabOption],
    currentTab === "ACA",
  );

  const currentPlan = plans.find((plan) => plan.isCurrentPlan);

  if (currentPlan) {
    const currentPlanQuotes = currentPlan.selectedQuotes;
    filteredQuotes = filteredQuotes.sort((quoteA, quoteB) => {
      if (currentPlanQuotes.map((quote) => quote.id).includes(quoteA.id)) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  const parseValue2 = (value: string | undefined): number => {
    if (value === "0") {
      return 0;
    }
    if (
      value === undefined ||
      value === null ||
      value === "deductible" ||
      value === "MISSING" ||
      value === "" ||
      value.includes("N/A") ||
      value.includes("/") ||
      value.includes("+")
    ) {
      return 0;
    }
    // Before cleaning up the value, truncate digits after the decimal point
    const withoutParenthesis = value.split("(")[0];
    const withoutDecimal = withoutParenthesis.split(".")[0];
    // Remove commas, dollar signs, and any periods that might be left
    const cleanedValue = withoutDecimal.replace(/[,+$]/g, "");
    // If the value is a percentage (contains '%'), remove '%' and convert to a number
    if (cleanedValue.includes("%")) {
      return parseFloat(cleanedValue.replace("%", "")) || 0;
    }
    // If the value is a regular number or a numeric string, convert it to a number
    return Number(cleanedValue);
  };

  function findMinimumValue(category: string) {
    let specificQuotes = filteredQuotes;
    return (
      Math.min(
        ...specificQuotes.map((quote) =>
          parseValue2((quote.data as any)?.[category] ?? "0"),
        ),
      ) | 0
    );
    // else if (category === "coinsurance") {
    //   return Math.min(...quotes.map((quote) => parseValue((quote.data as any)?.["coinsurance"] ?? "0"))) | 0;
    // }
  }

  function findMaximumValue(category: string) {
    let specificQuotes = filteredQuotes;

    return (
      Math.max(
        ...specificQuotes.map((quote) =>
          parseValue2((quote.data as any)?.[category] ?? "0"),
        ),
      ) | 0
    );
    // else if (category === "coinsurance") {
    //   return Math.max(...quotes.map((quote) => parseInt((quote.data as any)?.["coinsurance"] ?? '0') || 0));
    // }
  }

  const [valueDeductible, setValueDeductible] = React.useState<number[]>([
    findMinimumValue("deductible"),
    findMaximumValue("deductible"),
  ]);
  // const [valueCoinsurance, setValueCoinsurance] = React.useState<number[]>([20, 37]);
  const [valueOOP, setValueOOP] = React.useState<number[]>([
    findMinimumValue("out_of_pocket_max"),
    findMaximumValue("out_of_pocket_max"),
  ]);

  const [valueEmployeeRate, setValueEmployeeRate] = React.useState<number[]>([
    findMinimumValue("employee_rate"),
    findMaximumValue("employee_rate"),
  ]);

  useEffect(() => {
    // Reset valueDeductible and valueOOP when currentTab changes.
    setValueDeductible([
      findMinimumValue("deductible"),
      findMaximumValue("deductible"),
    ]);
    setValueOOP([
      findMinimumValue("out_of_pocket_max"),
      findMaximumValue("out_of_pocket_max"),
    ]);
    setValueEmployeeRate([
      findMinimumValue("employee_rate"),
      findMaximumValue("employee_rate"),
    ]);
  }, [currentTab]);

  if (!selectedClient) {
    return <></>;
  }

  return (
    <>
      <main className="flex w-full h-full overflow-x-scroll pl-4 md:pl-0 bg-gray-100">
        <Navbar selected="Quotes" />
        <div className="w-full md:w-6/7 flex">
          <div className="h-screen overflow-x-scroll flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 text-gray-700">
            <div className="flex w-full items-center mb-4 mt-1 justify-between">
              <div className="flex items-center text-sm md:text-base">
                <button
                  className="flex items-center"
                  onClick={handleCloseComparison}
                >
                  <option value="all" className="w-full">
                    All
                  </option>
                  <option value="custom" className="w-1/2">
                    Custom
                  </option>
                </select>
                {rangeSelection === "custom" && (
                  <>
                    <input
                      type="text"
                      className="bg-gray-100 px-2 h-8 drop-shadow-sm outline outline-1 outline-gray-400/80 hover:outline-gray-400 text-sm rounded-sm w-full"
                      placeholder="e.g., 1-5, 8, 11-13"
                      onChange={(e) => {
                        setCustomRange(e.target.value);
                        const newValue = e.target.value.trim();
                        validateCustomRangeAndParse(newValue);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            {rangeSelection === "custom" && !isRangeValid && (
              <div className="text-red-500 text-xs mb-4">
                Please enter a valid range format (e.g., 1-5, 8, 11-13).
              </div>
            )}
            <div className="my-2">Advanced</div>
            {isAdvancedOpen ? (
              <FaArrowDown
                onClick={() => {
                  setIsAdvancedOpen(false);
                }}
              />
            ) : (
              <FaArrowRight
                onClick={() => {
                  setIsAdvancedOpen(true);
                }}
              />
            )}
            {isAdvancedOpen && (
              <>
                <label>
                  <Toggle
                    defaultChecked={optionalParams.is_aca}
                    onChange={() => {
                      setOptionalParams((prev) => {
                        return { ...prev, is_aca: !prev.is_aca };
                      });
                    }}
                  />
                  <span>ACA</span>
                </label>
                <input
                  placeholder="Census Data Page Range"
                  className="mt-2 bg-gray-100 px-2 rounded-sm w-full drop-shadow-sm outline outline-1 h-8 outline-gray-400/80 hover:outline-gray-400"
                  value={optionalParams.optionalRanges.censusDataRange ?? ""}
                  onChange={(e) => {
                    setOptionalParams((prev) => {
                      return {
                        ...prev,
                        optionalRanges: {
                          ...prev.optionalRanges,
                          censusDataRange: e.target.value,
                        },
                      };
                    });
                  }}
                />
                <input
                  placeholder="Medical Rates Page Range"
                  className="mt-2 bg-gray-100 px-2 rounded-sm w-full drop-shadow-sm outline outline-1 h-8 outline-gray-400/80 hover:outline-gray-400"
                  value={optionalParams.optionalRanges.ratesRange ?? ""}
                  onChange={(e) => {
                    setOptionalParams((prev) => {
                      return {
                        ...prev,
                        optionalRanges: {
                          ...prev.optionalRanges,
                          ratesRange: e.target.value,
                        },
                      };
                    });
                  }}
                />
                <input
                  placeholder="Quotes Page Range"
                  className="mt-2 bg-gray-100 px-2 rounded-sm w-full drop-shadow-sm outline outline-1 h-8 outline-gray-400/80 hover:outline-gray-400"
                  value={optionalParams.optionalRanges.quotesRange ?? ""}
                  onChange={(e) => {
                    setOptionalParams((prev) => {
                      return {
                        ...prev,
                        optionalRanges: {
                          ...prev.optionalRanges,
                          quotesRange: e.target.value,
                        },
                      };
                    });
                  }}
                />{" "}
              </>
            )}
            <div className="modal-body">
              {/* File Upload Section */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent the default form submission
                  setIsProcessing(true);
                  if (rangeSelection === "all") {
                    handleUpload();
                  } else {
                    console.log("ENTERED");
                    const ranges = validateCustomRangeAndParse(customRange);
                    const censusDataRanges = validateCustomRangeAndParse(
                      optionalParams.optionalRanges.censusDataRange,
                    );
                    const quoteRanges = validateCustomRangeAndParse(
                      optionalParams.optionalRanges.quotesRange,
                    );
                    const rateRanges = validateCustomRangeAndParse(
                      optionalParams.optionalRanges.ratesRange,
                    );
                    console.log("HUH????");
                    if (
                      rangeSelection === "custom" &&
                      !validateSubRangesWithinMainRange(
                        ranges,
                        censusDataRanges,
                        quoteRanges,
                        rateRanges,
                      )
                    ) {
                      alert("Advanced ranges must be within the main range");
                      setIsProcessing(false);
                      return;
                    }

                    if (!isProcessing && ranges.length) {
                      handleUpload(ranges as number[][]); // Proceed with uploading
                    }
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center cursor-pointer">
                  <div
                    {...getRootProps()}
                    className={`p-6 mb-2 mt-2 drop-shadow-sm outline outline-1 outline-gray-400/80 hover:outline-gray-400 w-full ${
                      isDragActive ? "bg-gray-200/50" : "bg-gray-100/50"
                    }`}
                    style={{ borderRadius: "0.25rem" }}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <MdUpload className="h-8 w-8" />
                    </div>
                    <input {...getInputProps()} />
                    <h1 className="text-lg mb-4 text-center">
                      {isDragActive
                        ? "Drop the files here"
                        : "Select or Drag-In Quotes"}
                    </h1>
                    {file && (
                      <div className="text-center mb-4">
                        <p className="truncate">{file.name}</p>
                      </div>
                    )}
                  </div>
                  {/* <div className="flex items-center my-4 gap-3">
                <p>Page Range:</p>
                <select
                  className="outline outline-1 outline-gray-300 rounded-sm"
                  value={rangeSelection}
                  onChange={(e) => {
                    setRangeSelection(e.target.value);
                  }}
                >
                  <option value="all">All</option>
                  <option value="custom">Custom</option>
                </select>
                {rangeSelection === "custom" && (
                  <>
                    <input
                      type="text"
                      className="h-5 outline outline-1 outline-gray-300 text-sm rounded-sm"
                      placeholder="e.g., 1-5, 8, 11-13"
                      onChange={(e) => {
                        if (e.target.value && e.target.value.trim()) {
                          const newValue = e.target.value.trim();
                          setCustomRange(newValue);
                          validateCustomRange(newValue);
                        }
                      }}
                    />
                  </>
                )}
              </div>
              {rangeSelection === "custom" && !isRangeValid && (
                <div className="text-red-500 text-xs mb-4">
                  Please enter a valid range format (e.g., 1-5, 8, 11-13).
                </div>
              )} */}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer mt-1"
                  >
                    Upload
                  </button>

                  <p className="text-xs text-center text-gray-700 mb-1 mt-3">
                    We use bank-level security to encrypt and process your
                    statements. For more information about our privacy
                    measures,&nbsp;
                    <a
                      className="text-slate-900 underline"
                      href="mailto:founders@tryblitz.ai?subject=Security%20Inquiry"
                    >
                      email us
                    </a>
                    .
                  </p>
                </div>
              </form>
            </div>

            <div className="rounded-md w-full flex-col overflow-x-scroll h-full overflow-y-scroll bg-white outline outline-1 outline-gray-200">
              <div className="py-2 px-4 h-full">
                <SelectQuotesHeader
                  search={search}
                  setSearch={setSearch}
                  quotes={filteredQuotes}
                  handleSort={handleSort}
                  setSelectedFilter={setSelectedFilter}
                  handleBusiness={handleBusiness}
                  selectedFilter={selectedFilter}
                  valueDeductible={valueDeductible}
                  setValueDeductible={setValueDeductible}
                  valueEmployeeRate={valueEmployeeRate}
                  setValueEmployeeRate={setValueEmployeeRate}
                  valueOOP={valueOOP}
                  setValueOOP={setValueOOP}
                  findMaximumValue={findMaximumValue}
                  findMinimumValue={findMinimumValue}
                  currentTab={currentTab}
                  TabHeader={
                    <TabHeader
                      tabs={TABS}
                      titles={TABS.map((tab) => {
                        return `${tab} (${filterQuotesByCoverageType(TABS_TO_COVERAGE_TYPE_MAPPING[tab as TabOption], tab === "ACA").length})`;
                      })}
                      selectedTab={currentTab}
                      setSelectedTab={setCurrentTab}
                    />
                  }
                />

                <QuotesTable
                  quotes={filteredQuotes}
                  coverageType={coverageType}
                  planAttributes={planAttributes}
                  entryWidth={entryWidth}
                  handleCheckboxChange={handleCheckboxChange}
                  handleAddNewQuote={handleAddNewQuote}
                  search={search}
                  valueOOP={valueOOP}
                  parseValue2={parseValue2}
                  valueDeductible={valueDeductible}
                  valueEmployeeRate={valueEmployeeRate}
                  findMaximumValue={findMaximumValue}
                  findMinimumValue={findMinimumValue}
                />

              </div>
              {rangeSelection === "custom" && !isRangeValid && (
                <div className="text-red-500 text-xs mb-4">
                  Please enter a valid range format (e.g., 1-5, 8, 11-13).
                </div>
              )} */}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer mt-1"
                  >
                    Upload
                  </button>

                  <p className="text-xs text-center text-gray-700 mb-1 mt-3">
                    We use bank-level security to encrypt and process your
                    statements. For more information about our privacy
                    measures,&nbsp;
                    <a
                      className="text-slate-900 underline"
                      href="mailto:founders@tryblitz.ai?subject=Security%20Inquiry"
                    >
                      email us
                    </a>
                    .
                  </p>
                </div>
              </form>
            </div>
          </div>
          <SelectSidebar
            selectedClient={selectedClient}
            setPlans={setPlans}
            plans={plans}
            newPlanName={newPlanName}
            setNewPlanName={setNewPlanName}
            handleAddQuotesToPlan={handleAddQuotesToPlan}
            setSnackbar={setSnackbar}
            coverageType={
              TABS_TO_COVERAGE_TYPE_MAPPING[currentTab as TabOption]
            }
          />
        </div>
      </main>

      {modalOpen === "addCurrentPlan" && (
        <AddCurrentPlanModal
          setModalOpen={setModalOpen}
          client={selectedClient}
          fetchClients={fetchClients}
        />
      )}

      {modalOpen === "addNewQuote" && (
        <AddQuote
          onClose={() => {
            setModalOpen("");
          }}
          setModalOpen={setModalOpen}
          client={selectedClient}
          type={"Select"}
        />
      )}
      {selectedQuotes.length > 0 && (
        <ActionBar actionBarEntries={actionBarEntries} />
      )}
    </>

  );
};