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

export const LineChart2 = ({ data }: { data: any[] }) => {
  return (
    <ComposedChart
      width={330}
      height={250}
      data={data}
      margin={{ top: 50, right: 30, left: 30, bottom: 30 }}
    >
      <defs>{/* Gradient definitions as before */}</defs>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Bar dataKey="actual" fill="#5800D6" />
      <Line
        type="monotone"
        dataKey="projected"
        stroke="#459E00"
        strokeDasharray="5 5" // This creates the dotted effect
      />
    </ComposedChart>
    //</ResponsiveContainer>
  );
};
