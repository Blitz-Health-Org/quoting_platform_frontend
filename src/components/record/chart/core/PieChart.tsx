// @ts-nocheck
import { ErrorBoundary } from "react-error-boundary";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { RecordContext } from "@/src/context/commissions/RecordContext";
import { useContext } from "react";

export const PieChart = () => {
  const { groupedFilteredRecords: records } = useContext(RecordContext);

  ChartJS.register(ArcElement, Tooltip, Legend);

  const labels = Object.keys(records);

  const datasets = [
    {
      label: "Total YTD Revenue",
      data: Object.values(records).map((value) => {
        return value.reduce((acc, val) => {
          return acc + (val.actual_ytd_revenue || 0);
        }, 0);
      }),
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ];

  const data = {
    labels: labels,
    datasets: datasets,
  };

  return (
    <div className="h-56">
      <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
        <Pie
          data={data}
          width={"330"}
          options={{ maintainAspectRatio: false }}
        />
      </ErrorBoundary>
    </div>
  );
};
