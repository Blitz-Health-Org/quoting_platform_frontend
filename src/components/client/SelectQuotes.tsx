"use client";

import Image, { StaticImageData } from "next/image";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NewClientModal } from "@/src/components/client/modal/NewClient";
import { LuArrowRightToLine, LuArrowLeftToLine } from "react-icons/lu";
import { ClientType } from "@/src/types/custom/Client";
import { useRouter } from "next/navigation";
import { MdFileUpload } from "react-icons/md";
import { SnackbarAlert } from "../ui/SnackbarAlert";
import { supabase } from "../../supabase";
import { FaRegSave } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IoMdArrowBack } from "react-icons/io";
import { QuoteType } from "@/src/types/custom/Quote";
import { IconBuilding } from "@tabler/icons-react";
import AetnaLogo from "@/public/Screenshot.png";
import AnotherCarrierLogo from "@/public/Anthem.jpeg";
import Cigna from "@/public/Cigna.png";
import United from "@/public/United.png";
import Chamber from "@/public/Chamber.png";
import BCBS from "@/public/BCBS.png";
import NewProject from "@/public/NewProject.jpg";
import { io } from "socket.io-client";
import { FiArrowRight, FiTrash } from "react-icons/fi";
import { UserContext } from "@/src/context/UserContext";
import SelectQuotesHeader from "../comparison/SelectQuotesHeader";
import { SnackBarContext } from "@/src/context/SnackBarContext";
import { set } from "lodash";

export default function SelectQuotes({
  setComparisonOpen,
  setSelectedClient,
  selectedClient,
  setModalOpen,
}: {
  setComparisonOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedClient: Dispatch<SetStateAction<ClientType>>;
  selectedClient: ClientType;
  setModalOpen: Dispatch<SetStateAction<string>>;
}) {
  type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

  const { setSnackbar } = useContext(SnackBarContext);
  const [selectedQuotes, setSelectedQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );
  const [collapsed, setCollapsed] = useState(selectedQuotes.length! > 0);

  const handleBusiness = () => {
    setSnackbar({
      open: true,
      message: "This feature is coming soon!",
      severity: "info",
    });
  };

  const planDeleted = () => {
    setSnackbar({
      open: true,
      message: "Plan deleted! Make sure to save your changes.",
      severity: "success",
    });
  };

  const planAdded = () => {
    setSnackbar({
      open: true,
      message: "Plan added! Make sure to save your changes.",
      severity: "success",
    });
  };

  const pleasePlans = () => {
    setSnackbar({
      open: true,
      message: "Please create a plan before saving!",
      severity: "error",
    });
  };

  const handleUpdate = () => {
    setSnackbar({
      open: true,
      message: "Plans saved!",
      severity: "success",
    });
  };

  const pleaseInput = () => {
    setSnackbar({
      open: true,
      message: "Please input a plan name!",
      severity: "error",
    });
  };

  const createAPlan = () => {
    setSnackbar({
      open: true,
      message: "Please create a plan before a comparison!",
      severity: "error",
    });
  };

  const planAttributesMapping: {
    key: keyof PlanAttributes;
    label: string;
    alternateKey?: string;
  }[] = [
    { key: "carrier", label: "Carrier" },
    { key: "plan_id", alternateKey: "plan_name", label: "Plan" },
    // { key: "plan_type", label: "Plan Type" },
    // { key: "office_copay", label: "Office Copay (PCP/Specialist)" },
    { key: "deductible", label: "Deductible (Individual)" },
    { key: "coinsurance", label: "Coinsurance (In-Network)" },
    { key: "out_of_pocket_max", label: "Out of Pocket (Individual)" },
    {
      key: "additional_copay",
      label: "Additional Copays (ER / Imaging / OP / IP)",
    },
    { key: "total_cost", label: "Total Monthly Premium" },
  ];

  const [entryWidth, setEntryWidth] = useState(
    innerWidth / planAttributesMapping.length,
  );
  const [quotes, setQuotes] = useState<QuoteTypeWithCheckbox[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    userId: [userId, , loading],
  } = useContext(UserContext);

  const router = useRouter();
  const [search, setSearch] = useState<string>();

  function handleAddNewQuote(event: any) {
    event?.stopPropagation();
    setModalOpen("addNewQuote");
    setSelectedClient(selectedClient);
    return;
  }

  const handleClearCheckboxes = () => {
    setQuotes((prevQuotes) =>
      prevQuotes?.map((quote) => ({
        ...quote,
        isSelected: false,
      })),
    );
    setSelectedQuotes([]);
  };

  async function handleDeleteQuote() {
    const selectedQuoteIds =
      quotes?.filter((quote) => quote.isSelected).map((quote) => quote.id) ||
      [];

    const { error } = await supabase
      .from("quotes")
      .delete()
      .in("id", selectedQuoteIds);
    if (error) {
      alert("Failed to delete quotes");
      return;
    }

    // setQuotes()

    const clientId = selectedClient.id;

    const { data: insertData, error: insertError } = await supabase
      .from("clients") // Replace with your actual Supabase table name
      .upsert({ id: selectedClient.id, selected_quotes: selectedQuoteIds });

    if (insertError) {
      console.error("Error inserting row into Supabase table:", insertError);
      return { success: false };
    } else {
      router.push(`/quotes?clientId=${clientId}`);

      return { success: true };
    }
  }

  useEffect(() => {
    // Update entryWidth when the screen size changes

    const handleResize = () => {
      setEntryWidth(innerWidth / planAttributesMapping.length);
      console.log("yeah", entryWidth);
    };

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  interface PlanAttributes {
    plan_id: string;
    carrier: string;
    plan_name: string;
    plan_type: string;
    office_copay: string;
    deductible: string;
    coinsurance: string;
    out_of_pocket_max: string;
    additional_copay: string;
    total_cost: string;
  }

  // const [sortOption, setSortOption] = useState("deductible"); // Initial sorting option
  const [loadingNewQuotes, setLoadingNewQuotes] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState("asc"); // Initial sorting order

  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [originalQuotes, setOriginalQuotes] = useState<QuoteTypeWithCheckbox[]>(
    [],
  );
  const [plans, setPlans] = useState<
    Array<{ id: number; name: string; selectedQuotes: QuoteTypeWithCheckbox[] }>
  >([]);
  const [newPlanName, setNewPlanName] = useState("");

  const handleAddPlan = () => {
    if (newPlanName.trim() !== "") {
      const newPlan = {
        id: Date.now(),
        name: newPlanName.trim(),
        selectedQuotes: [],
      };
      setPlans([...plans, newPlan]);
      setNewPlanName("");
      planAdded();
    } else {
      pleaseInput();
    }
  };

  const handleDeletePlan = (planId: number) => {
    const updatedPlans = plans.filter((plan) => plan.id !== planId);
    setPlans(updatedPlans);
    planDeleted();
  };

  const handleAddQuotesToPlan = (planId: number) => {
    const updatedPlans = plans.map((plan) => {
      if (plan.id === planId) {
        // Filter out duplicates before updating the currentQuotes array
        const uniqueQuotesToAdd = selectedQuotes.filter(
          (selectedQuote) =>
            !plan.selectedQuotes.some(
              (planQuote) => planQuote.id === selectedQuote.id,
            ),
        );
        console.log(selectedQuotes);
        console.log(plan.selectedQuotes);
        console.log(uniqueQuotesToAdd);
        return {
          ...plan,
          selectedQuotes: [...plan.selectedQuotes, ...uniqueQuotesToAdd],
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
    // updateConnectedPlans(updatedPlans);
    handleClearCheckboxes();
  };

  const handleRemoveQuoteFromPlan = (
    planId: number,
    quote: QuoteTypeWithCheckbox,
  ) => {
    const updatedPlans = plans.map((plan) => {
      if (plan.id === planId) {
        return {
          ...plan,
          selectedQuotes: plan.selectedQuotes.filter(
            (selectedQuote) => selectedQuote.id !== quote.id,
          ),
        };
      }
      return plan;
    });
    setPlans(updatedPlans);
    // updateConnectedPlans(updatedPlans);
  };

  const handleSort = (option: string | null) => {
    if (option === null) {
      setQuotes(originalQuotes);
      return;
    }

    // Perform the sorting
    //TODO: handle empty quotes
    const sortedQuotes = quotes.slice().sort((a, b) => {
      const valueA = parseValue((a.data as any)?.[option]); // Remove extra parenthesis here
      const valueB = parseValue((b.data as any)?.[option]); // Remove extra parenthesis here

      if (sortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    // Update the state with the sorted quotes
    setQuotes(sortedQuotes);
  };

  const parseValue = (value: string | undefined): number => {
    if (
      value === undefined ||
      value === "MISSING" ||
      value === "" ||
      value.includes("N/A") ||
      value.includes("/") ||
      value.includes("+")
    )
      return Number.POSITIVE_INFINITY;

    // Remove commas, dollar signs, and periods
    const cleanedValue = value.replace(/[,$.]/g, "");

    // If the value is a percentage (contains '%'), remove '%' and convert to a number
    if (cleanedValue.includes("%")) {
      return parseFloat(cleanedValue.replace("%", "")) || 0;
    }

    // If the value is a regular number or a numeric string, convert it to a number
    return Number(cleanedValue) || 0;
  };

  const handleCheckboxChange = (quoteId: number) => {
    setQuotes((prevQuotes) =>
      prevQuotes?.map((quote) =>
        quote.id === quoteId
          ? { ...quote, isSelected: !quote.isSelected }
          : quote,
      ),
    );

    // Update selectedQuotes state
    setSelectedQuotes((prevSelectedQuotes) => {
      const index = prevSelectedQuotes.findIndex(
        (quote) => quote.id === quoteId,
      );
      if (index !== -1) {
        // If quote is already selected, remove it
        return prevSelectedQuotes.filter((quote) => quote.id !== quoteId);
      } else {
        // If quote is not selected, add it
        return [
          ...prevSelectedQuotes,
          quotes.find((quote) => quote.id === quoteId)!,
        ];
      }
    });
  };

  const handleNextClick = async () => {
    const clientId = selectedClient.id;
    if (!plans.length) {
      createAPlan();
      return;
    }
    updateConnectedPlans(plans);
    comparison_created_true();
    router.push(`/quotes?clientId=${clientId}`);
    return { success: true };
  };

  const fetchQuoteData = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select()
      .eq("client_id", selectedClient.id);

    const { data: clientData } = await supabase
      .from("clients")
      .select("connected_plans")
      .eq("id", selectedClient.id)
      .single(); // Add this to fetch 'connected_plans' for the current client

    if (error) {
      alert("Error updating data");
    } else {
      // Check if selected_quotes is not null

      if (data.length) {
        setSnackbar({
          open: true,
          message: `${data.length - quotes.length} new quotes loaded!`,
          severity: "success",
        });
      }

      setQuotes(data);
      setOriginalQuotes(data);

      if (clientData) {
        // Check if there is data for connected_plans
        setPlans(clientData.connected_plans || []); // Update plans state
      }
    }
  };

  useEffect(() => {
    fetchQuoteData();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseComparison = () => {
    setSelectedClient(undefined as unknown as ClientType);
    setComparisonOpen(false);
    router.push(`/`);
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

  const comparison_created_true = async () => {
    const { data, error } = await supabase
      .from("clients") // Replace 'your_table_name' with your actual table name
      .update({ comparison_created: true }) // 'plans' is the array to insert into the 'connected_plans' column
      .match({ id: selectedClient.id }); // Assuming 'selectedClient.id' is the primary key of the row you want to update

    if (error) {
      console.error("Error updating connected plans in Supabase:", error);
      return { success: false, error };
    }

    console.log("Connected plans updated successfully:", data);
    return { success: true, data };
  };

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

  return (
    <>
      <main className="flex w-full h-full overflow-hidden">
        <div className="h-screen overflow-hidden flex-col w-full bg-gray-100 bg-opacity-50 pl-2 pr-6 pt-5 pb-6 text-gray-700">
          <div className="flex w-full items-center mb-4 mt-1 justify-between">
            <div className="flex items-center text-sm md:text-base">
              <button
                className="flex items-center"
                onClick={handleCloseComparison}
              >
                <IoMdArrowBack />
                <p className="ml-2 mr-2">Clients / </p>
              </button>
              <IconBuilding className="h-5 w-5 mr-2" />
              <p className="mr-2">{selectedClient.name}</p>
              {/* <p className="mr-1">/ Quotes</p>
            <p className="mr-1 text-gray-400 text-xs">•</p>
            <p className="text-gray-400">({quotes.length})</p> */}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddNewQuote}
                className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center hover:bg-gray-100/80 cursor-pointer"
              >
                <div className="mr-2">Add Quotes</div>
                <MdFileUpload />
              </button>
              {/* <button
                onClick={handleNextClick}
                className="text-sm md:text-base mr-1 outline outline-1 outline-gray-200 py-1 px-2 rounded-md flex items-center justify-center hover:bg-gray-100/80 cursor-pointer"
              >
                <div className="mr-2">New Comparison</div>
                <FiArrowRight />
              </button> */}
            </div>
          </div>
          <div className="rounded-md w-full flex-col overflow-x-hidden h-full pb-12 overflow-y-scroll bg-white outline outline-1 outline-gray-200">
            <div className="py-2 px-4">
              <SelectQuotesHeader
                search={search}
                setSearch={setSearch}
                quotes={quotes}
                handleSort={handleSort}
                setSelectedFilter={setSelectedFilter}
                handleBusiness={handleBusiness}
                selectedFilter={selectedFilter}
              />
              <div className="w-full overflow-x-auto">
                <div className="flex py-2 w-fit border-b">
                  <div className="grid-cols-9 flex justify-left text-center w-fit gap-1 h-20 font-bold items-center text-wrap text-sm">
                    {planAttributesMapping.map((attribute) => (
                      <div
                        key={attribute.key}
                        className="flex justify-center gap-2 min-w-32"
                        style={{ width: `${entryWidth}px` }}
                      >
                        <p>{attribute.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {quotes.length === 0 ? (
                  loadingNewQuotes ? (
                    <>Loading</>
                  ) : (
                    <div className="flex w-full mt-16 mb-2 h-fit items-center justify-center flex-col">
                      <p className="mb-2">No Quotes</p>
                      <button
                        onClick={handleAddNewQuote}
                        className="bg-gray-100 outline outline-1 outline-gray-300 rounded-md px-2 py-0.5"
                      >
                        Add Quotes
                      </button>
                    </div>
                  )
                ) : (
                  quotes
                    .filter(
                      (quote: any) =>
                        !search || // Only apply the filter if search is empty
                        ((quote.data as any)?.["plan_id"] + quote.carrier)
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                    )
                    .map((quote) => (
                      <div
                        key={quote.id}
                        className="flex items-center w-fit mb-1 mt-1 py-2 border-b"
                      >
                        <div className="grid-cols-9 w-full flex justify-left text-center w-fit gap-1 h-8 items-center text-sm">
                          {/* Map through the plan attributes for each quote */}
                          {planAttributesMapping.map((attribute) => (
                            <div
                              key={attribute.key}
                              className="min-w-32 max-h-10 overflow-y-auto"
                              style={{ width: `${entryWidth}px` }}
                            >
                              {attribute.key === "carrier" ? (
                                <div className="flex items-center justify-left ml-6">
                                  <input
                                    type="checkbox"
                                    checked={quote.isSelected}
                                    onChange={() =>
                                      handleCheckboxChange(quote.id)
                                    }
                                    className="mr-4"
                                  />
                                  {quote.logo_url && (
                                    <Image
                                      src={quote.logo_url}
                                      alt={`Logo for ${quote[attribute.key]}`}
                                      width={20}
                                      height={20}
                                      className="mr-2 rounded-md"
                                    />
                                  )}
                                  <p>{quote[attribute.key] || "Sup"}</p>
                                </div>
                              ) : (
                                <p>
                                  {(quote.data as any)?.[attribute.key] ??
                                    "N/A"}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        <Sidebar
          collapsedWidth="60px"
          backgroundColor="white"
          collapsed={collapsed}
          rootStyles={{
            height: "100vh",
            overflowY: "auto",
            overflowX: "hidden",
            borderLeft: "1px solid #d1d5db", // Set the left border only
          }}
        >
          <div className="flex-col h-fit w-full pt-3 justify-center overflow-y-scroll overflow-x-hidden">
            {collapsed && (
              <div className="flex-col h-full w-full text-center">
                <button
                  className="sb-button"
                  onClick={() => setCollapsed(false)}
                >
                  <LuArrowLeftToLine className="h-6 w-6 text-gray-700" />
                </button>
              </div>
            )}

            {!collapsed && (
              <div className="flex gap-2 p-3">
                <button
                  className="sb-button"
                  onClick={() => setCollapsed(true)}
                >
                  <LuArrowRightToLine className="h-6 w-6 text-gray-700" />
                </button>
                <p className="font-normal text-lg">Plan Builder</p>
              </div>
            )}

            {/* Add Plan input and button */}
            {!collapsed && (
              <div className="flex-col items-center justify-center w-full gap-2 py-2 px-4">
                <div
                  onClick={handleNextClick}
                  className="w-full text-gray-600 mb-2 text-sm md:text-base mr-1 outline outline-1 outline-gray-300 py-1 px-2 rounded-md flex items-center justify-center hover:outline-gray-400 cursor-pointer"
                >
                  <div className="mr-2 text-sm">Create Comparison</div>
                  <FiArrowRight />
                </div>
                <div
                  onClick={() => {
                    updateConnectedPlans(plans);
                    handleUpdate();
                  }}
                  className="w-full text-gray-600 mb-2 text-sm md:text-base mr-1 outline outline-1 outline-gray-300 py-1 px-2 rounded-md flex items-center justify-center hover:outline-gray-400 cursor-pointer"
                >
                  <div className="mr-2 text-sm">Save Plans</div>
                  <FaRegSave />
                </div>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Enter New Plan Name"
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    className="py-1 px-4 text-sm outline outline-1 outline-gray-300 rounded-md w-7/8 hover:cursor-pointer focus:cursor-auto hover:outline-gray-400"
                  />
                  <button
                    onClick={handleAddPlan}
                    className="sb-button outline outline-1 outline-gray-300 rounded-md px-0.5 hover:outline-gray-400 w-1/8"
                  >
                    <IoIosAdd className="h-6 w-6 text-gray-700" />
                  </button>
                </div>
              </div>
            )}

            {/* Display plans */}
            {!collapsed && (
              <div className="flex-col gap-2 py-2 px-4">
                {plans.map((plan) => (
                  <div key={plan.id} className="flex flex-col gap-1">
                    <hr className="mt-2"></hr>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold mt-1">{plan.name}</p>
                      <div className="flex gap-1">
                        <button onClick={() => handleAddQuotesToPlan(plan.id)}>
                          <IoIosAdd className="h-6 w-6" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FiTrash />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Display current quotes in the plan */}
                      {plan.selectedQuotes.length > 0 && (
                        <div className="w-full">
                          <ul className="w-full">
                            {plan.selectedQuotes.map((quote) => (
                              <li key={quote.id} className="mt-2 w-full">
                                <div className="flex justify-between w-full gap-1">
                                  <div className="flex gap-1 items-center">
                                    {quote.logo_url && (
                                      <Image
                                        src={quote.logo_url}
                                        alt={`Logo for ${(quote.data as any)?.["plan_id"]}`}
                                        width={25}
                                        height={25}
                                        className="mr-2"
                                      />
                                    )}
                                    <p className="text-sm truncate max-w-36">
                                      {(quote.data as any)?.["plan_id"] ||
                                        "N/A"}
                                    </p>
                                  </div>
                                  <button
                                    className="text-red-500 hover:text-red-600"
                                    onClick={() =>
                                      handleRemoveQuoteFromPlan(plan.id, quote)
                                    }
                                  >
                                    <FiTrash />
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {/* Button to add selected quotes to the plan */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Sidebar>
      </main>
    </>
  );
}
