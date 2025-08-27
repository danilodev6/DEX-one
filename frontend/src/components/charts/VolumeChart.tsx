"use client";

import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock data for trading volume over time
const mockVolumeData = [
  { time: "00:00", volume: 1250, swaps: 8, fees: 3.75 },
  { time: "04:00", volume: 890, swaps: 5, fees: 2.67 },
  { time: "08:00", volume: 2100, swaps: 14, fees: 6.3 },
  { time: "12:00", volume: 3450, swaps: 22, fees: 10.35 },
  { time: "16:00", volume: 2800, swaps: 18, fees: 8.4 },
  { time: "20:00", volume: 1950, swaps: 12, fees: 5.85 },
  { time: "24:00", volume: 1670, swaps: 9, fees: 5.01 },
];

export function VolumeChart() {
  const formatVolume = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{`Time: ${label}`}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-green-600 dark:text-green-400">Volume: </span>
              <span className="font-semibold text-gray-900 dark:text-white">${data.volume.toLocaleString()}</span>
            </p>
            <p className="text-sm">
              <span className="text-blue-600 dark:text-blue-400">Swaps: </span>
              <span className="font-semibold text-gray-900 dark:text-white">{data.swaps}</span>
            </p>
            <p className="text-sm">
              <span className="text-purple-600 dark:text-purple-400">Fees: </span>
              <span className="font-semibold text-gray-900 dark:text-white">${data.fees.toFixed(2)}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalVolume = mockVolumeData.reduce((sum, item) => sum + item.volume, 0);
  const totalSwaps = mockVolumeData.reduce((sum, item) => sum + item.swaps, 0);
  const totalFees = mockVolumeData.reduce((sum, item) => sum + item.fees, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Trading Volume (24h)</h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Last 24 hours</div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockVolumeData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="time" className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <YAxis tickFormatter={formatVolume} className="text-gray-600 dark:text-gray-400" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="volume" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Volume</div>
          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
            ${totalVolume.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Swaps</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{totalSwaps}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">Fees Generated</div>
          <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">${totalFees.toFixed(2)}</div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg. Swap Size</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            ${(totalVolume / totalSwaps).toFixed(0)}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fee Rate</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {((totalFees / totalVolume) * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}
