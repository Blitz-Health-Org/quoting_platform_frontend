/*
bar:
- no. and total value of unpaid commissions by different carriers, clients, and plan types
- total projected, accrued, and estimated revenues by carrier, client, and plan type
z
*/

import {
  BarChart as ColumnChart,
  Bar,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Rectangle,
  XAxis,
} from "recharts";

export const BarChart = ({ data }: { data: any }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ColumnChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="pv"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
        <Bar
          dataKey="uv"
          fill="#82ca9d"
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </ColumnChart>
    </ResponsiveContainer>
  );
};
