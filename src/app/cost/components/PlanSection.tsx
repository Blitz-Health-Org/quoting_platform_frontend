import { QuoteType } from "@/src/types/custom/Quote";
import {
  ClassType,
  PlanSpecificClassInfoType,
  PlanSpecificClassType,
} from "@/src/types/custom/Class";
import { cleanInput } from "@/src/components/comparison/utils/cleanInput";
import {
  TierType,
  calculateTotalCost,
} from "@/src/components/comparison/utils/calculateTotalCost";
import { Dispatch, SetStateAction, useState } from "react";
type PlanSectionProps = {
  plans: QuoteType[];
  classes: ClassType[];
  isCustomClassesActivated: boolean;
  planSpecificClassInfo: PlanSpecificClassInfoType;
  censusData: CensusDataType;
  handleUpdateClassInfo: (
    classItem: PlanSpecificClassType,
    planId: number,
  ) => void;
};
import lodash from "lodash";
import { CensusDataType } from "../page";
import { MdEdit, MdSave } from "react-icons/md";

export const PlanSection = ({
  plans,
  classes,
  planSpecificClassInfo,
  censusData,
  isCustomClassesActivated,
  handleUpdateClassInfo,
}: PlanSectionProps) => {
  const [editedPlanClassId, setEditedPlanClassId] = useState<
    string | undefined
  >(undefined);

  //Default class results not saved (probably bad design but I'm too lazy to populate them into the supabase). planSpecificClassInfo not used without custom classes
  const [editedPlanSpecificClassInfo, setEditedPlanSpecificClassInfo] =
    useState<PlanSpecificClassInfoType>(planSpecificClassInfo);

  //USED TO UPDATE WHEN ADDING OR DELETING CLASSES, CHECKS IF IDS ARE THE SAME
  const currentClassIdList = classes.map((c) => c.id as number);
  const [previousClassIdList, setPreviousClassIdList] =
    useState<number[]>(currentClassIdList);

  console.log("EDIT", editedPlanSpecificClassInfo);
  console.log(
    "prev",
    previousClassIdList,
    currentClassIdList,
    planSpecificClassInfo,
  );
  if (!lodash.isEqual(previousClassIdList, currentClassIdList)) {
    setPreviousClassIdList(currentClassIdList);
    setEditedPlanSpecificClassInfo(planSpecificClassInfo);
  }

  const handleInputChange = (
    planId: number,
    classId: number,
    tier: TierType,
    field: string,
    value: string,
  ) => {
    setEditedPlanSpecificClassInfo((currentInfo) =>
      currentInfo.map((info) => {
        if (info.plan_id === planId && info.class_id === classId) {
          return {
            ...info,
            [tier]: {
              ...info[tier],
              [field]: value,
            },
          };
        }
        return info;
      }),
    );
  };

  let grandTotalCost = 0.0;

  return (
    <div className="flex-col">
      <div className="flex justify-between mb-4">
        <div className="font-semibold">Plans</div>
        <p className="font-semibold">Grand Total Cost: {grandTotalCost}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {plans.map((plan) => {
          const planSpecificClasses = editedPlanSpecificClassInfo.filter(
            (planSpecificClass) => {
              return planSpecificClass.plan_id === plan.id;
            },
          );

          const totalCost = calculateTotalCost({}, plan, planSpecificClasses);
          grandTotalCost += parseFloat(totalCost);

          return (
            <div
              key={plan.id}
              className="p-4 bg-gray-100 outline outline-1 outline-gray-300 rounded-md"
            >
              {/* {plan.id} */}
              <h3 className="font-bold mb-2">
                {plan.data.plan_name as string}
              </h3>

              <p className="font-medium mb-1 mt-2">Plan Rates</p>
              <ul>
                <li>
                  Employee rate: {plan.data.employee_rate as string | undefined}
                </li>
                <li>
                  Spouse rate: {plan.data.spouse_rate as string | undefined}
                </li>
                <li>
                  Child rate: {plan.data.child_rate as string | undefined}
                </li>
                <li>
                  Family rate: {plan.data.family_rate as string | undefined}
                </li>
              </ul>

              <>
                <p className="font-medium mb-1 mt-2">Classes</p>
                <div>
                  {classes.length === 0
                    ? "None (add a class above)"
                    : classes.map((classItem) => {
                        const editedPlanSpecificClass =
                          editedPlanSpecificClassInfo.find(
                            (planSpecificClassItem) =>
                              planSpecificClassItem.plan_id === plan.id &&
                              planSpecificClassItem.class_id === classItem.id,
                          ) as PlanSpecificClassType;

                        const planSpecificClassId = `${plan.id}-${classItem.id}`;
                        return (
                          <div
                            key={classItem.id}
                            className="mb-4 p-4 bg-gray-200 border border-gray-300 rounded-md"
                          >
                            <p className="font-semibold">
                              {isCustomClassesActivated && classItem.class_name}
                            </p>
                            <ul>
                              {(
                                [
                                  "employee",
                                  "spouse",
                                  "child",
                                  "family",
                                ] as TierType[]
                              ).map((tier) => {
                                return (
                                  <li key={tier}>
                                    <ul>
                                      <li>
                                        {editedPlanClassId ===
                                        planSpecificClassId ? (
                                          <>
                                            <span>
                                              {tier[0].toUpperCase() +
                                                tier.slice(1)}{" "}
                                              Contribution:
                                            </span>
                                            <input
                                              value={
                                                editedPlanSpecificClass?.[tier]
                                                  .contribution_percentage
                                              }
                                              onChange={(e) =>
                                                handleInputChange(
                                                  plan.id,
                                                  classItem.id as number,
                                                  tier,
                                                  "contribution_percentage",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                            {/* {errorMessageMap[plan.id][
                                              classItem.id
                                            ][tier][
                                              "contribution_percentage"
                                            ] && "Please enter a valid input"} */}
                                          </>
                                        ) : (
                                          <span>
                                            {tier[0].toUpperCase() +
                                              tier.slice(1)}{" "}
                                            Contribution:{" "}
                                            {
                                              editedPlanSpecificClass?.[tier]
                                                .contribution_percentage
                                            }
                                          </span>
                                        )}
                                      </li>
                                      {isCustomClassesActivated && (
                                        <li>
                                          {editedPlanClassId ===
                                          planSpecificClassId ? (
                                            <>
                                              <span>
                                                No. of{" "}
                                                {tier[0].toUpperCase() +
                                                  tier.slice(1)}
                                                :{" "}
                                              </span>
                                              <input
                                                value={
                                                  editedPlanSpecificClass?.[
                                                    tier
                                                  ].num_lives
                                                }
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    plan.id,
                                                    classItem.id as number,
                                                    tier,
                                                    "num_lives",
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                            </>
                                          ) : (
                                            <span>
                                              No. of{" "}
                                              {tier[0].toUpperCase() +
                                                tier.slice(1)}
                                              :{" "}
                                              {
                                                editedPlanSpecificClass?.[tier]
                                                  .num_lives
                                              }
                                            </span>
                                          )}
                                        </li>
                                      )}
                                    </ul>
                                  </li>
                                );
                              })}
                            </ul>
                            {planSpecificClassId === editedPlanClassId ? (
                              <button
                                className="flex w-full justify-center px-2 py-1 mt-2 items-center gap-2 outline outline-1 outline-gray-300 rounded-sm bg-gray-100/20 hover:bg-gray-100/50"
                                onClick={() => {
                                  const [
                                    cleanedEditedPlanSpecificClass,
                                    parseSucceeded,
                                  ] = cleanInput({
                                    employee: editedPlanSpecificClass.employee,
                                    spouse: editedPlanSpecificClass.spouse,
                                    family: editedPlanSpecificClass.family,
                                    child: editedPlanSpecificClass.child,
                                  });
                                  if (!parseSucceeded) {
                                    alert("Invalid Input. Please re-enter");
                                    return;
                                  }

                                  handleUpdateClassInfo(
                                    {
                                      ...editedPlanSpecificClass,
                                      ...cleanedEditedPlanSpecificClass,
                                    },
                                    plan.id,
                                  );
                                  setEditedPlanClassId(undefined);
                                }}
                              >
                                <MdSave />
                                <p>Save</p>
                              </button>
                            ) : (
                              <button
                                className="flex w-full justify-center px-2 py-1 mt-2 items-center gap-2 outline outline-1 outline-gray-300 rounded-sm bg-gray-100/20 hover:bg-gray-100/50"
                                onClick={() =>
                                  setEditedPlanClassId(
                                    `${plan.id}-${classItem.id}`,
                                  )
                                }
                              >
                                <MdEdit />
                                <p>Edit</p>
                              </button>
                            )}
                            {planSpecificClassId === editedPlanClassId && (
                              <button
                                onClick={() => {
                                  setEditedPlanClassId(undefined);
                                  setEditedPlanSpecificClassInfo(
                                    planSpecificClassInfo,
                                  );
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        );
                      })}
                </div>
              </>
              Plan Rates
            <ul>
              <li>
                Employee rate: {plan.data.employee_rate as string | undefined}
              </li>
              <li>
                Employee + Spouse rate: {plan.data.spouse_rate as string | undefined}
              </li>
              <li>Employee + Child rate: {plan.data.child_rate as string | undefined}</li>
              <li>
                Employee + Family rate: {plan.data.family_rate as string | undefined}
              </li>
            </ul>
              <div className="mt-4">
                <strong>Total Cost: </strong>
                {totalCost}
              </div>
              <strong>Grand Total Cost: {grandTotalCost}</strong>

            </div>
          );
        })}
      </div>
    </div>
  );
};
