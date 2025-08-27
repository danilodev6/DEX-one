"use client";

import { type Address, formatEther, parseEther } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ERC20_ABI } from "@/constants/contracts";

export function useToken(tokenAddress: Address, spender?: Address) {
  const { address: userAddress } = useAccount();
  const { writeContract } = useWriteContract();

  // Read token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  // Read token info
  const { data: name } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "symbol",
  });
  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "decimals",
  });

  // Check allowance
  const { data: allowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: userAddress && spender ? [userAddress, spender] : undefined,
    query: {
      enabled: !!userAddress && !!spender,
    },
  });

  const approve = async (approveSpender: Address, amount: string) => {
    return writeContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [approveSpender, parseEther(amount)],
    });
  };

  return {
    // Token info
    name,
    symbol,
    decimals,

    // User data
    balance: balance ? formatEther(balance) : "0",
    allowance: allowance ? formatEther(allowance) : "0",

    // Actions
    approve,
    refetchBalance,
  };
}
