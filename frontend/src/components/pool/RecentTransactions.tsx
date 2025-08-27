"use client";

import { ArrowUpDown, Clock, ExternalLink, Minus, Plus } from "lucide-react";

// Mock transaction data
const mockTransactions = [
  {
    id: "1",
    type: "swap",
    tokenIn: "TKA",
    tokenOut: "TKB",
    amountIn: "125.50",
    amountOut: "128.75",
    user: "0x1234...5678",
    timestamp: "2 minutes ago",
    hash: "0xabcd1234efgh5678",
    fee: "0.38",
  },
  {
    id: "2",
    type: "add_liquidity",
    tokenA: "TKA",
    tokenB: "TKB",
    amountA: "500.00",
    amountB: "512.50",
    user: "0x2345...6789",
    timestamp: "5 minutes ago",
    hash: "0xbcde2345fghi6789",
    fee: "0.00",
  },
  {
    id: "3",
    type: "swap",
    tokenIn: "TKB",
    tokenOut: "TKA",
    amountIn: "89.25",
    amountOut: "87.10",
    user: "0x3456...789a",
    timestamp: "8 minutes ago",
    hash: "0xcdef3456ghij789a",
    fee: "0.27",
  },
  {
    id: "4",
    type: "remove_liquidity",
    tokenA: "TKA",
    tokenB: "TKB",
    amountA: "200.00",
    amountB: "205.00",
    user: "0x4567...89ab",
    timestamp: "12 minutes ago",
    hash: "0xdef4567hijk89ab",
    fee: "0.00",
  },
  {
    id: "5",
    type: "swap",
    tokenIn: "TKA",
    tokenOut: "TKB",
    amountIn: "75.00",
    amountOut: "76.88",
    user: "0x5678...9abc",
    timestamp: "18 minutes ago",
    hash: "0xef5678ijkl9abc",
    fee: "0.23",
  },
  {
    id: "6",
    type: "add_liquidity",
    tokenA: "TKA",
    tokenB: "TKB",
    amountA: "1000.00",
    amountB: "1025.00",
    user: "0x6789...abcd",
    timestamp: "25 minutes ago",
    hash: "0xf6789jklmabcd",
    fee: "0.00",
  },
];

export function RecentTransactions() {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "swap":
        return <ArrowUpDown className="h-4 w-4 text-blue-600" />;
      case "add_liquidity":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "remove_liquidity":
        return <Minus className="h-4 w-4 text-red-600" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionTitle = (tx: any) => {
    switch (tx.type) {
      case "swap":
        return `Swap ${tx.tokenIn} → ${tx.tokenOut}`;
      case "add_liquidity":
        return "Add Liquidity";
      case "remove_liquidity":
        return "Remove Liquidity";
      default:
        return "Unknown Transaction";
    }
  };

  const getTransactionDetails = (tx: any) => {
    switch (tx.type) {
      case "swap":
        return `${parseFloat(tx.amountIn).toFixed(2)} ${tx.tokenIn} → ${parseFloat(tx.amountOut).toFixed(2)} ${tx.tokenOut}`;
      case "add_liquidity":
        return `${parseFloat(tx.amountA).toFixed(2)} ${tx.tokenA} + ${parseFloat(tx.amountB).toFixed(2)} ${tx.tokenB}`;
      case "remove_liquidity":
        return `${parseFloat(tx.amountA).toFixed(2)} ${tx.tokenA} + ${parseFloat(tx.amountB).toFixed(2)} ${tx.tokenB}`;
      default:
        return "Unknown details";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "swap":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "add_liquidity":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "remove_liquidity":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatTypeLabel = (type: string) => {
    switch (type) {
      case "add_liquidity":
        return "Add";
      case "remove_liquidity":
        return "Remove";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Last 100 transactions</div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {mockTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">{getTransactionIcon(tx.type)}</div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{getTransactionTitle(tx)}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(tx.type)}`}>
                    {formatTypeLabel(tx.type)}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{getTransactionDetails(tx)}</span>
                  {parseFloat(tx.fee) > 0 && <span className="text-green-600 dark:text-green-400">Fee: ${tx.fee}</span>}
                </div>
                <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>by {tx.user}</span>
                  <span>•</span>
                  <span>{tx.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`https://etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="View on Etherscan"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-6 text-center">
        <button
          type="button"
          className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
        >
          Load More Transactions
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {mockTransactions.filter((tx) => tx.type === "swap").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Swaps</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {mockTransactions.filter((tx) => tx.type === "add_liquidity").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Liquidity Added</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {mockTransactions.filter((tx) => tx.type === "remove_liquidity").length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Liquidity Removed</div>
        </div>
      </div>
    </div>
  );
}
