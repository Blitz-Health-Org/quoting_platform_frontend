import * as React from "react";
import { QuoteColumnDisplay } from "./QuoteColumnDisplay";
import { ContinuousSlider } from "./ContributionSlider";
import { useRecoilState } from "recoil";
import { contributionSettingsAtom } from "./contributionSettingsAtom";

//TODO: Need to clean and validate the schema somewhere

export type HeaderCardProps = {
  fieldObject: Record<string, any>;
};

export const HeaderCard = ({ fieldObject }: HeaderCardProps) => {
  const [isContributionSettingsExpanded, setIsContributionSettingsExpanded] =
    useRecoilState(contributionSettingsAtom);
  return (
    <QuoteColumnDisplay
      field={fieldObject}
      initialExpanded
      className="w-fit max-w-44 pt-23 rounded-t-md"
      headerComponent={
        <>
          {/* <div
            className="border invisible border-slate-300 rounded-lg hover:bg-slate-300 bg-slate-100 mb-2"
            onClick={() =>
              setIsContributionSettingsExpanded(!isContributionSettingsExpanded)
            }
          >
            <p className="m-2 text-sm">
              {isContributionSettingsExpanded
                ? "Collapse Contribution Setttings"
                : "Expand Contribution Settings"}
            </p>
          </div> */}
          {isContributionSettingsExpanded && (
            <div className="flex invisible w-full justify-center items-center p-5">
              <div className="bg-slate-100/80 rounded-sm shadow w-fit p-2">
                <div className="grid grid-cols-[1fr_1fr_1.5fr] mb-4 text-center items-center gap-2">
                  <div className="font-bold text-sm w-full">Tier</div>
                  <div className="font-bold text-sm w-full">Lives</div>
                  <div className="font-bold text-sm w-full overflow-x-auto">
                    Contribution
                  </div>

                  {["Employee", "Family", "Child", "Spouse"].map((tier) => (
                    <>
                      <div className="flex justify-center">
                        <div className="text-xs">{tier}</div>
                      </div>
                      <div className="flex justify-center">
                        <input
                          className="w-12 mx-2 border border-slate-300 rounded-lg px-1 text-xs h-5 justify-center"
                          onChange={(e) => {}}
                        />
                      </div>
                      <div className="flex w-40 justify-center">
                        <ContinuousSlider
                          setStandardContribution={() => {}}
                          className="mx-2 rounded-lg px-1 text-xs h-5"
                          hideLabels
                        />
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      }
    />
  );
};
