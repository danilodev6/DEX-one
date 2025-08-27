"use client";

import { Droplets } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock data for liquidity over time
const mockLiquidityData = [
  { time: "00:00", liquidity: 8500, tokenA: 4250, tokenB: 4250 },
  { time: "04:00", liquidity: 9200, tokenA: 4600, tokenB: 4600 },
  { time: "08:00", liquidity: 8800, tokenA: 4400, tokenB: 4400 },
  { time: "12:00", liquidity: 10500, tokenA: 5250, tokenB: 5250 },
  { time: "16:00", liquidity: 11200, tokenA: 5600, tokenB: 5600 },
  { time: "20:00", liquidity: 10800, tokenA: 5400, tokenB: 5400 },
  { time: "24:00", liquidity: 12340, tokenA: 6170, tokenB: 6170 },
];

export function LiquidityChart() {
  const formatLiquidity = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{`Time: ${label}`}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-blue-600 dark:text-blue-400">Total Liquidity: </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${payload[0]?.value?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-purple-600 dark:text-purple-400">Token A: </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${payload[0]?.payload?.tokenA?.toLocaleString()}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-pink-600 dark:text-pink-400">Token B: </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${payload[0]?.payload?.tokenB?.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pool Liquidity (24h)</h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Last 24 hours</div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockLiquidityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="time" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <YAxis tickFormatter={formatLiquidity} className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="liquidity"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2, fill: "#ffffff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Current</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            ${mockLiquidityData[mockLiquidityData.length - 1].liquidity.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">24h High</div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            ${Math.max(...mockLiquidityData.map((d) => d.liquidity)).toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">24h Low</div>
          <div className="text-lg font-semibold text-red-600 dark:text-red-400">
            ${Math.min(...mockLiquidityData.map((d) => d.liquidity)).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
