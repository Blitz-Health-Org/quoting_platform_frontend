import React, { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { ContributionCard } from "./ContributionCard";
import SlidingPane from "react-sliding-pane";
import { supabase } from "@/src/supabase";

type ClassType = {
  name: string;
  data: Record<string, any>;
};

type ContributionPaneProps = {
  paneState: any;
  setPaneState: any;
  standardContribution: any;
  setStandardContribution: any;
  client: any;
  setClasses: any;
  classes: any;
};

const ContributionPane = ({
  paneState,
  setPaneState,
  classes,
  setClasses,
  client,
  standardContribution,
  setStandardContribution,
}: ContributionPaneProps) => {
  const [newClassName, setNewClassName] = useState<string>("");

  const handleNewClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      classes.map((prevClass: any) => prevClass.name).includes(newClassName)
    ) {
      alert("Class already exists");
      return;
    }

    if (newClassName.trim() !== "") {
      console.log("here", [...classes, newClassName.trim()]);
      setClasses([
        ...classes,
        {
          name: newClassName,
          data: {
            employee: { percent: 100, employees: 50 },
            family: { percent: 100, employees: 50 },
            child: { percent: 100, employees: 50 },
            spouse: { percent: 100, employees: 50 },
          },
        },
      ]);
    }

    await supabase
      .from("clients")
      .update({
        classes_contributions: [
          ...classes,
          {
            name: newClassName,
            data: {
              employee: { percent: 100, employees: 50 },
              family: { percent: 100, employees: 50 },
              child: { percent: 100, employees: 50 },
              spouse: { percent: 100, employees: 50 },
            },
          },
        ],
      })
      .eq("id", client.id);

    setNewClassName("");
  };

  const handleDeleteClass = async (index: any) => {
    if (!client) {
      return;
    }
    const updatedClasses = [...classes];
    updatedClasses.splice(index, 1);
    setClasses(updatedClasses);

    await supabase
      .from("clients")
      .update({ classes_contributions: [...classes] })
      .eq("id", client.id);
  };

  return (
    <div>
      <SlidingPane
        className="slide-pane_overlay2"
        overlayClassName="slide-pane_overlay2"
        isOpen={paneState.isPaneOpen}
        title="Settings"
        subtitle="Set classes and contribution structures."
        width={paneState.paneWidth}
        onRequestClose={() => {
          // triggered on "<" on left top click or on outside click
          setPaneState((prevState: any) => ({
            ...prevState,
            isPaneOpen: false,
          }));
        }}
      >
        {classes.length === 0 && (
          <>
            <h1 className="mb-2 font-bold">Standard Contributions</h1>

            <ContributionCard
              contribution={standardContribution}
              onSave={setStandardContribution}
            />

            <hr className="mt-4 mb-4"></hr>
          </>
        )}
        <div className="flex items-center mt-4 mb-4 gap-2">
          <button className="outline outline-1 outline-gray-300 p-1 hover:bg-gray-100 rounded-sm">$</button>
          <button className="outline outline-1 outline-gray-300 p-1 hover:bg-gray-100 rounded-sm">%</button>
        </div>
        <h1 className="mb-2 font-bold">Custom Classes</h1>
        <form className="mt-2" onSubmit={(e) => handleNewClassSubmit(e)}>
          <div className="flex">
            <input
              placeholder="Class Name"
              className="py-0.5 px-2 outline outline-1 outline-gray-400 mr-2 h-10 rounded-sm w-4/5 hover:outline-gray-500 hover:cursor-pointer focus:cursor-auto"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
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
          {classes.map((customClass: any, index: any) => (
            <div
              key={index}
              className="mb-1.5 flex-col items-center justify-left mt-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => handleDeleteClass(index)}
                  className="rounded-sm text-sm"
                >
                  <FaTrash />
                </button>
                <p className="mr-2 font-bold">
                  Class #{index + 1} : {customClass.name}
                </p>
              </div>
              <ContributionCard
                onSave={(value: any) =>
                  setClasses((prevCustomClasses: any) =>
                    prevCustomClasses.map((prevCustomClass: any) =>
                      prevCustomClass.name === customClass.name
                        ? value
                        : prevCustomClass,
                    ),
                  )
                }
                contribution={customClass}
              />
            </div>
          ))}
        </div>
        <br />
      </SlidingPane>
    </div>
  );
};

export default ContributionPane;
