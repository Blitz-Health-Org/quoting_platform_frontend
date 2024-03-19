import { QuoteType } from "@/src/types/custom/Quote";
import { ClassType } from "@/src/types/custom/Class";
import { PlanSpecificClassInfoType } from "../utils/getClasses";
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
  planSpecificClassInfo: PlanSpecificClassInfoType[];
  handleUpdatePlanSpecificClassInfo: (
    customClass: PlanSpecificClassInfoType,
    planId: number,
  ) => void;
};
import lodash from "lodash";

export const PlanSection = ({
  plans,
  classes,
  isCustomClassesActivated,
  planSpecificClassInfo,
  handleUpdatePlanSpecificClassInfo,
}: PlanSectionProps) => {
  const [editedPlanClassId, setEditedPlanClassId] = useState<
    string | undefined
  >(undefined);
  const [editedPlanSpecificClassInfo, setEditedPlanSpecificClassInfo] =
    useState<PlanSpecificClassInfoType[]>(
      isCustomClassesActivated
        ? planSpecificClassInfo
        : plans.map((plan) => {
            return {
              plan_id: plan.id,
              class_id: 1,
              employee: {
                contribution_percentage: 50,
                num_lives: 0,
              },
              spouse: {
                contribution_percentage: 50,
                num_lives: 0,
              },
              child: {
                contribution_percentage: 50,
                num_lives: 0,
              },
              family: {
                contribution_percentage: 50,
                num_lives: 0,
              },
            };
          }),
    );

  console.log("EDITEDPLANSPECIFICCLASS", editedPlanSpecificClassInfo);

  if (
    isCustomClassesActivated &&
    !lodash.isEqual(editedPlanSpecificClassInfo, planSpecificClassInfo) &&
    !editedPlanClassId
  ) {
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
        if (
          info.plan_id === planId &&
          (!isCustomClassesActivated || info.class_id === classId)
        ) {
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
  return (
    <div>
      {plans.map((plan) => {
        const planSpecificClasses = planSpecificClassInfo.filter(
          (planSpecificClass) => planSpecificClass.plan_id === plan.id,
        );

        const totalCost = calculateTotalCost({}, plan, planSpecificClasses);

        return (
          <div key={plan.id} className="mb-4 p-4 bg-gray-200 rounded-md">
            {plan.id}
            <h3 className="font-bold mb-2">{plan.data.plan_name as string}</h3>
            {isCustomClassesActivated ? (
              <>
                Classes
                <div className="border border-black p-4">
                  {classes.length === 0
                    ? "None (add a class above)"
                    : classes.map((classItem) => {
                        const editedPlanSpecificClass =
                          editedPlanSpecificClassInfo.find(
                            (planSpecificClassItem) =>
                              planSpecificClassItem.plan_id === plan.id &&
                              planSpecificClassItem.class_id === classItem.id,
                          ) as PlanSpecificClassInfoType;

                        const planSpecificClassId = `${plan.id}-${classItem.id}`;
                        return (
                          <div
                            key={classItem.id}
                            className="mb-4 p-4 bg-gray-200 border border-black rounded-md"
                          >
                            {classItem.class_name}
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
                                                editedPlanSpecificClass?.[tier]
                                                  .num_lives
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
                                    </ul>
                                  </li>
                                );
                              })}
                            </ul>
                            {planSpecificClassId === editedPlanClassId ? (
                              <button
                                onClick={() => {
                                  if (isCustomClassesActivated) {
                                    handleUpdatePlanSpecificClassInfo(
                                      editedPlanSpecificClass,
                                      plan.id,
                                    );
                                  }
                                  setEditedPlanClassId(undefined);
                                }}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setEditedPlanClassId(
                                    `${plan.id}-${classItem.id}`,
                                  )
                                }
                              >
                                Edit{" "}
                              </button>
                            )}
                            {planSpecificClassId === editedPlanClassId && (
                              <button
                                onClick={() => setEditedPlanClassId(undefined)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        );
                      })}
                </div>
              </>
            ) : (
              <>
                Classes
                <div className="border border-black p-4">
                  {classes.length === 0
                    ? "None (add a class above)"
                    : classes.map((classItem) => {
                        const editedPlanSpecificClass =
                          editedPlanSpecificClassInfo.find(
                            (planSpecificClassItem) =>
                              planSpecificClassItem.plan_id === plan.id,
                          ) as PlanSpecificClassInfoType;

                        const planSpecificClassId = `${plan.id}-${classItem.id}`;

                        return (
                          <div
                            key={classItem.id}
                            className="mb-4 p-4 bg-gray-200 border border-black rounded-md"
                          >
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
                                  </li>
                                );
                              })}
                            </ul>
                            {planSpecificClassId === editedPlanClassId ? (
                              <button
                                onClick={() => {
                                  console.log(
                                    "eiojeoiwjf",
                                    isCustomClassesActivated,
                                  );
                                  if (isCustomClassesActivated) {
                                    handleUpdatePlanSpecificClassInfo(
                                      editedPlanSpecificClass,
                                      plan.id,
                                    );
                                  }
                                  setEditedPlanClassId(undefined);
                                }}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setEditedPlanClassId(
                                    `${plan.id}-${classItem.id}`,
                                  )
                                }
                              >
                                Edit{" "}
                              </button>
                            )}
                            {planSpecificClassId === editedPlanClassId && (
                              <button
                                onClick={() => setEditedPlanClassId(undefined)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        );
                      })}
                </div>
              </>
            )}
            Plan Rates
            <ul>
              <li>
                Employee rate: {plan.data.employee_rate as string | undefined}
              </li>
              <li>
                Spouse rate: {plan.data.spouse_rate as string | undefined}
              </li>
              <li>Child rate: {plan.data.child_rate as string | undefined}</li>
              <li>
                Family rate: {plan.data.family_rate as string | undefined}
              </li>
            </ul>
            <div className="mt-4">
              <strong>Total Cost: </strong>
              {totalCost}
            </div>
          </div>
        );
      })}
    </div>
  );
};
