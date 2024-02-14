/* 
line:
- payments over time
- 

*/

import dynamic from "next/dynamic";

import {
  Line,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  Bar,
} from "recharts";

const ComposedChart = dynamic(
  () => import("recharts").then((recharts) => recharts.ComposedChart),
  { ssr: false },
);

export const LineChart = ({ data }: { data: any[] }) => {
  return (
    <ComposedChart
      width={330}
      height={250}
      data={data}
      margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
    >
      <defs>{/* Gradient definitions as before */}</defs>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        type="monotone"
        dataKey="expected"
        stroke="#002244"
        fillOpacity={1}
        fill="#5800D6"
      />
      <Bar dataKey="actual" fill="#459E00" />
    </ComposedChart>
    //</ResponsiveContainer>
  );
};
