# Complete DEX Development Roadmap
*Building a Professional AMM DEX with Modern Stack*

## 🛠️ Tech Stack

**Core Technologies:**
- **Bun** - Fast package manager and runtime
- **Hardhat + TypeScript** - Smart contract development
- **Next.js 14** - Frontend framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Styling
- **Ethers.js v6** - Blockchain interaction

**Additional Professional Tools:**
- **Wagmi + Viem** - Modern blockchain interaction (replacing Ethers.js)
- **RainbowKit** - Professional wallet connection
- **Foundry** - Advanced testing (alongside Hardhat)
- **Recharts** - Data visualization
- **Framer Motion** - Smooth animations
- **Zod** - Runtime validation
- **Vercel** - Deployment

---

## 📁 Project Structure Setup

### Phase 1: Repository Initialization (Day 1)

```bash
# 1. Create main project directory
mkdir dex-portfolio
cd dex-portfolio

# 2. Initialize monorepo structure
mkdir contracts frontend docs

# 3. Initialize git
git init
echo "node_modules/\n.env\n*.log\ndist/\nbuild/" > .gitignore
```

### Phase 2: Smart Contracts Setup (Day 1)

```bash
# Navigate to contracts directory
cd contracts

# Clean setup with compatible versions
echo '{
  "name": "dex-contracts",
  "version": "1.0.0",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy": "hardhat ignition deploy ignition/modules/DEX.ts"
  }
}' > package.json

# Install Hardhat and Viem dependencies
bun add -d hardhat@^2.22.0
bun add -d @nomicfoundation/hardhat-toolbox-viem@^4.1.0
bun add -d @nomicfoundation/hardhat-viem@^2.0.0
bun add -d @nomicfoundation/hardhat-ignition-viem@^0.15.0
bun add -d @types/node@^20.0.0
bun add -d typescript@~5.0.4
bun add -d viem@^2.7.6
bun add -d @openzeppelin/contracts@^5.0.0
bun add -d dotenv@^16.0.0
```

**Configure `hardhat.config.ts`:**
```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
```

### Phase 3: Frontend Setup (Day 1)

```bash
# Navigate back to root and create frontend
cd ../frontend

# Create Next.js app with TypeScript
bun create next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Install blockchain dependencies
bun add wagmi viem @tanstack/react-query
bun add @rainbow-me/rainbowkit
bun add recharts framer-motion
bun add zod @hookform/resolvers react-hook-form

# Install dev dependencies
bun add -D @types/node
```

---

## 🔧 Development Phases

### Phase 1: Core Smart Contracts (Days 2-5)

#### Day 2: Mock ERC20 Tokens
**File: `contracts/contracts/MockERC20.sol`**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * 10**decimals());
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
```

#### Day 3: LP Token Contract
**File: `contracts/contracts/LPToken.sol`**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPToken is ERC20, Ownable {
    constructor() ERC20("LP Token", "LP") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
```

#### Day 4-5: Main DEX Contract
**File: `contracts/contracts/SimpleDEX.sol`**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./LPToken.sol";

contract SimpleDEX is ReentrancyGuard {
    IERC20 public tokenA;
    IERC20 public tokenB;
    LPToken public lpToken;
    
    uint256 public reserveA;
    uint256 public reserveB;
    
    uint256 constant FEE_PERCENT = 3; // 0.3%
    uint256 constant FEE_DENOMINATOR = 1000;
    
    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swap(address indexed user, address tokenIn, uint256 amountIn, uint256 amountOut);
    
    // Implementation details...
}
```

#### Testing Strategy (Day 5)
**File: `contracts/test/SimpleDEX.test.ts`**
```typescript
import { expect } from "chai";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { parseEther, formatEther } from "viem";

describe("SimpleDEX", function () {
  async function deployDEXFixture() {
    const publicClient = await viem.getPublicClient();
    const [owner, user1, user2] = await viem.getWalletClients();
    
    // Deploy contracts using Viem
    const tokenA = await viem.deployContract("MockERC20", ["Token A", "TKA", parseEther("1000000")]);
    const tokenB = await viem.deployContract("MockERC20", ["Token B", "TKB", parseEther("1000000")]);
    const lpToken = await viem.deployContract("LPToken");
    const dex = await viem.deployContract("SimpleDEX", [tokenA.address, tokenB.address, lpToken.address]);
    
    return { dex, tokenA, tokenB, lpToken, publicClient, owner, user1, user2 };
  }

  it("Should add liquidity correctly", async function () {
    const { dex, tokenA, tokenB, owner } = await loadFixture(deployDEXFixture);
    
    const amountA = parseEther("100");
    const amountB = parseEther("200");
    
    // Approve tokens
    await tokenA.write.approve([dex.address, amountA], { account: owner.account });
    await tokenB.write.approve([dex.address, amountB], { account: owner.account });
    
    // Add liquidity
    await dex.write.addLiquidity([amountA, amountB], { account: owner.account });
    
    // Verify reserves
    const [reserveA, reserveB] = await dex.read.getReserves();
    expect(reserveA).to.equal(amountA);
    expect(reserveB).to.equal(amountB);
  });
  
  it("Should maintain k invariant after swap", async function () {
    const { dex, tokenA, tokenB, owner } = await loadFixture(deployDEXFixture);
    
    // Setup initial liquidity
    const amountA = parseEther("1000");
    const amountB = parseEther("1000");
    
    await tokenA.write.approve([dex.address, amountA], { account: owner.account });
    await tokenB.write.approve([dex.address, amountB], { account: owner.account });
    await dex.write.addLiquidity([amountA, amountB], { account: owner.account });
    
    // Get initial k value
    const [initialReserveA, initialReserveB] = await dex.read.getReserves();
    const initialK = initialReserveA * initialReserveB;
    
    // Perform swap
    const swapAmount = parseEther("100");
    await tokenA.write.approve([dex.address, swapAmount], { account: owner.account });
    await dex.write.swapAForB([swapAmount], { account: owner.account });
    
    // Verify k invariant (allowing for fees)
    const [finalReserveA, finalReserveB] = await dex.read.getReserves();
    const finalK = finalReserveA * finalReserveB;
    
    // K should increase slightly due to fees
    expect(finalK).to.be.greaterThan(initialK);
  });
});
```

### Phase 2: Frontend Development (Days 6-10)

#### Day 6: Wagmi Configuration
**File: `frontend/src/lib/wagmi.ts`**
```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, hardhat } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DEX Portfolio',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [hardhat, sepolia],
  ssr: true,
});
```

#### Day 7: Contract Hooks
**File: `frontend/src/hooks/useDEXContract.ts`**
```typescript
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, Address } from 'viem';
import { dexABI, dexAddress } from '@/lib/contracts';

export function useDEXContract() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });
  
  // Read contract data
  const { data: reserves } = useReadContract({
    address: dexAddress,
    abi: dexABI,
    functionName: 'getReserves',
  });
  
  const addLiquidity = async (amountA: string, amountB: string) => {
    return writeContract({
      address: dexAddress,
      abi: dexABI,
      functionName: 'addLiquidity',
      args: [parseEther(amountA), parseEther(amountB)],
    });
  };
  
  const swapAForB = async (amountIn: string) => {
    return writeContract({
      address: dexAddress,
      abi: dexABI,
      functionName: 'swapAForB',
      args: [parseEther(amountIn)],
    });
  };
  
  const removeLiquidity = async (lpTokens: string) => {
    return writeContract({
      address: dexAddress,
      abi: dexABI,
      functionName: 'removeLiquidity',
      args: [parseEther(lpTokens)],
    });
  };
  
  return {
    // Write functions
    addLiquidity,
    swapAForB,
    removeLiquidity,
    
    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    
    // Read data
    reserves: reserves ? {
      reserveA: formatEther(reserves[0]),
      reserveB: formatEther(reserves[1])
    } : null,
  };
}

// Hook for token operations
export function useTokenContract(tokenAddress: Address) {
  const { writeContract } = useWriteContract();
  
  const approve = async (spender: Address, amount: string) => {
    return writeContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'approve',
      args: [spender, parseEther(amount)],
    });
  };
  
  const { data: balance } = useReadContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [useAccount().address],
  });
  
  return {
    approve,
    balance: balance ? formatEther(balance) : '0',
  };
}
```

#### Day 8-9: Core Components
**Swap Interface:** `frontend/src/components/SwapInterface.tsx`
**Liquidity Interface:** `frontend/src/components/LiquidityInterface.tsx`
**Charts:** `frontend/src/components/PoolChart.tsx`

#### Day 10: Integration & Polish
- Connect all components
- Add loading states
- Implement error handling
- Add animations

### Phase 3: Advanced Features (Days 11-14)

#### Day 11: Price Oracle & TWAP
**File: `contracts/contracts/PriceOracle.sol`**
```solidity
contract PriceOracle {
    struct Observation {
        uint32 timestamp;
        uint256 price0Cumulative;
        uint256 price1Cumulative;
    }
    
    mapping(uint256 => Observation) public observations;
    uint16 public observationIndex;
    uint16 public observationCardinality;
    
    function observe(uint32[] memory secondsAgos) 
        external 
        view 
        returns (int56[] memory tickCumulatives) {
        // TWAP implementation
    }
}
```

#### Day 12: Advanced Frontend Features
- Real-time price updates with WebSockets
- Transaction history
- Portfolio tracking
- Advanced charts with multiple timeframes

#### Day 13: Security Enhancements
- Slippage protection
- Emergency pause mechanism
- Access controls
- Comprehensive testing

#### Day 14: Gas Optimization
- Assembly optimizations where appropriate
- Efficient storage patterns
- Batch operations

### Phase 4: Testing & Deployment (Days 15-17)

#### Day 15: Comprehensive Testing
```bash
# Run all tests
cd contracts
bun run test

# Coverage report
bun hardhat coverage

# Gas reporting
REPORT_GAS=true bun hardhat test
```

#### Day 16: Deployment
**File: `contracts/ignition/modules/DEX.ts`**
```typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

const DEXModule = buildModule("DEX", (m) => {
  // Deploy mock tokens
  const tokenA = m.contract("MockERC20", ["Token A", "TKA", parseEther("1000000")]);
  const tokenB = m.contract("MockERC20", ["Token B", "TKB", parseEther("1000000")]);
  
  // Deploy LP token
  const lpToken = m.contract("LPToken");
  
  // Deploy DEX with token addresses
  const dex = m.contract("SimpleDEX", [tokenA, tokenB, lpToken]);
  
  // Transfer LP token ownership to DEX
  m.call(lpToken, "transferOwnership", [dex]);
  
  return {
    tokenA,
    tokenB,
    lpToken,
    dex,
  };
});

export default DEXModule;
```

**Deploy to testnet:**
```bash
bun hardhat ignition deploy ignition/modules/DEX.ts --network sepolia
```

#### Day 17: Frontend Deployment
```bash
# Build and deploy frontend
cd frontend
bun run build
vercel deploy
```

---

## 📊 Portfolio Presentation

### Documentation Structure
```
docs/
├── README.md
├── ARCHITECTURE.md
├── API.md
├── DEPLOYMENT.md
└── assets/
    ├── demo.gif
    ├── architecture-diagram.png
    └── screenshots/
```

### Key Metrics to Highlight
- **Gas efficiency:** Before/after optimization comparisons
- **Test coverage:** Aim for >90%
- **Security:** Slither analysis results
- **Performance:** Frontend loading times
- **User experience:** Smooth animations and error handling

### Demo Script
1. **Contract interaction demo** (2 minutes)
2. **Frontend walkthrough** (2 minutes)
3. **Code architecture explanation** (1 minute)

---

## 🎯 Success Metrics

**Technical Excellence:**
- All tests passing with >90% coverage
- Gas-optimized contracts
- Type-safe frontend with no `any` types
- Responsive design on all devices

**Professional Polish:**
- Clean, documented code
- Proper error handling
- Loading states and animations
- Professional UI/UX

**Blockchain Competency:**
- Understanding of AMM mechanics
- Proper use of events and indexing
- Security best practices
- Integration with wallet providers

---

## ⏱️ Timeline Summary

- **Week 1:** Setup + Core contracts
- **Week 2:** Frontend development
- **Week 3:** Advanced features + Testing
- **Week 4:** Polish + Deployment + Documentation

**Total Time Investment:** 3-4 weeks (part-time) or 2-3 weeks (full-time)

This roadmap balances technical depth with practical implementation, ensuring you build something impressive while learning modern blockchain development practices.
