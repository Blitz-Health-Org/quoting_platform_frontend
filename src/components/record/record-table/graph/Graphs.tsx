// @ts-nocheck

//TODO: Fix spacing for this

import { LineChart } from "@/src/components/record/chart/core/LineChart";
import { PieChart } from "@/src/components/record/chart/core/PieChart";
import { LineChart2 } from "@/src/components/record/chart/core/LineChart2";
import { months } from "@/src/components/record/record-table/graph/utils/constants";
import { monthlyPaymentFields } from "@/src/components/record/record-table/graph/utils/constants";

type GraphsProps = {
  filteredRecords: any[];
  visibleFieldDefinitionObjects: Record<PolicyField, any> | null;
  groupedFilteredRecords: Record<string, Record<PolicyField, any>[]>;
  groupFieldObject: Partial<PolicyField>;
};

export const Graphs = ({
  filteredRecords,
  groupedFilteredRecords,
}: GraphsProps) => {
  // Determine the current month's index
  const currentMonthIndex = new Date().getMonth();

  const projectedVersusExpectedData = months.map((month, index) => {
    let expected = 0;
    let actual = 0;
    let projected = 0;

    filteredRecords.forEach((record) => {
      // Sum actual payments up to the current month
      monthlyPaymentFields
        .slice(0, index + 1)
        .forEach((paymentField, paymentIndex) => {
          actual += record[paymentField] || 0;
        });

      if (index >= currentMonthIndex) {
        const actualAverage = actual / (currentMonthIndex + 1);
        projected = actualAverage * (index + 1);
      }

      expected += record["expected_monthly_revenue"] * (index + 1); // Assuming this is a fixed value for simplification
    });

    // Construct the data object for each month
    const data = {
      name: month,
      expected: expected,
    };

    // Add actual or projected field appropriately
    if (index < currentMonthIndex) {
      data.actual = actual;
    } else if (index == currentMonthIndex) {
      data.actual = actual;
      data.projected = projected;
    } else {
      data.projected = projected;
    }

    return data;
  });

  const projectedData = months.map((month, index) => {
    let expected = 0;
    let actual = 0;
    let projected = 0;

    filteredRecords.forEach((record) => {
      // Sum actual payments up to the current month
      monthlyPaymentFields
        .slice(0, index + 1)
        .forEach((paymentField, paymentIndex) => {
          actual += record[paymentField] || 0;
        });

      if (index >= currentMonthIndex) {
        const actualAverage = actual / (currentMonthIndex + 1);
        projected = actualAverage * (index + 1);
      }

      expected += record["expected_monthly_revenue"] * (index + 1); // Assuming this is a fixed value for simplification
    });

    // Construct the data object for each month
    const data = {
      name: month,
      expected: expected,
    };

    // Add actual or projected field appropriately
    if (index < currentMonthIndex) {
      data.actual = actual;
    } else if (index == currentMonthIndex) {
      data.actual = actual;
      data.projected = projected;
    } else {
      data.projected = projected;
    }

    return data;
  });

  console.log("groupedFilteredRecords", groupedFilteredRecords);

  return (
    <div className="gap-10 flex w-full overflow-x-auto mb-6">
      <div className="rounded-sm shadow-sm outline outline-1 outline-gray-200 ml-1 mt-1 mb-1">
        <h1 className="m-3 font-semibold">Expected vs Actual ($)</h1>
        <hr className="mb-2 mt-2"></hr>
        <div className="m-3">
          <LineChart data={projectedVersusExpectedData} />
        </div>
      </div>
      <div className="rounded-sm shadow-sm outline outline-1 outline-gray-200 ml-1 mt-1 mb-1">
        <h1 className="m-3 font-semibold">Projected Revenue ($)</h1>
        <hr className="mb-2 mt-2"></hr>
        <div className="m-3">
          <LineChart2 data={projectedData} />
        </div>
      </div>
      {Object.keys(groupedFilteredRecords).length > 0 && (
        <div className="rounded-sm shadow-sm outline outline-1 outline-gray-200 ml-1 mr-1 mt-1 mb-1">
          <h1 className="m-3 font-semibold">Client Breakdown</h1>
          <hr className="mb-2 mt-2"></hr>
          <div className="m-3">
            <PieChart />
          </div>
        </div>
      )}
    </div>
  );
};
