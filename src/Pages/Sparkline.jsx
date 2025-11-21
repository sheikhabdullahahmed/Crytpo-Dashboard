// frontend/src/Pages/Sparkline.jsx
import { LineChart, Line, ResponsiveContainer } from "recharts";

const Sparkline = ({ data, isUp }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-gray-400 text-xs italic text-center">No Data</div>
    );
  }

  return (
    <div className="w-[120px] h-[40px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={isUp ? "#00C853" : "#FF1744"} // green/red line
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;
