import React, { useState } from "react";
import { Sidebar } from "react-pro-sidebar";
import { LuArrowRightToLine, LuArrowLeftToLine } from "react-icons/lu";
import Image from "next/image";
import { FiArrowRight, FiTrash } from "react-icons/fi";
import { FaRegSave } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { QuoteType } from "../types/custom/Quote";
import { supabase } from "../supabase";
import { useRouter } from "next/navigation";

type QuoteTypeWithCheckbox = QuoteType & { isSelected: boolean };

type Props = {
  plans: Array<{
    id: number;
    name: string;
    selectedQuotes: QuoteTypeWithCheckbox[];
  }>;
  newPlanName: any;
  setNewPlanName: any;
  handleAddQuotesToPlan: any;
  selectedClient: any;
  setSnackbar: any;
  setPlans: any;
};

const SelectSidebar = ({
  plans,
  newPlanName,
  setNewPlanName,
  handleAddQuotesToPlan,
  selectedClient,
  setSnackbar,
  setPlans,
}: Props) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleNextClick = async () => {
    const clientId = selectedClient.id;
    if (!plans.length) {
      createAPlan();
      return;
    }
    if (plans.some((plan) => plan.selectedQuotes.length === 0)) {
      makeSure();
      return;
    }
    updateConnectedPlans(plans);
    comparison_created_true();
    router.push(`/quotes?clientId=${clientId}`);
    return { success: true };
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

  const createAPlan = () => {
    setSnackbar({
      open: true,
      message: "Please create a plan before a comparison!",
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

  const makeSure = () => {
    setSnackbar({
      open: true,
      message: "Make sure that each plan has at least one quote!",
      severity: "error",
    });
  };

  const planAdded = () => {
    setSnackbar({
      open: true,
      message: "Plan added! Make sure to save your changes.",
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

  const handleDeletePlan = (planId: number) => {
    const updatedPlans = plans.filter((plan) => plan.id !== planId);
    setPlans(updatedPlans);
    planDeleted();
  };

  const planDeleted = () => {
    setSnackbar({
      open: true,
      message: "Plan deleted! Make sure to save your changes.",
      severity: "success",
    });
  };

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

  return (
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
            <button className="sb-button" onClick={() => setCollapsed(false)}>
              <LuArrowLeftToLine className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        )}

        {!collapsed && (
          <div className="flex gap-2 p-3">
            <button className="sb-button" onClick={() => setCollapsed(true)}>
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
                placeholder="Enter New Group Name"
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
                                  {(quote.data as any)?.["plan_id"] || "N/A"}
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
  );
};

export default SelectSidebar;
