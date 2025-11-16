# Quick Start: Building New MBPS v2.1 MCP Server from Scratch

## 🚀 Zero to Production in 2 Hours

Build a fully MBPS v2.1 compliant blockchain MCP server with 25+ core tools.

## Prerequisites
- Node.js 18+
- TypeScript knowledge
- RPC endpoint for your blockchain

## Step 1: Project Setup (10 min)

```bash
# Create project
mkdir {blockchain}-mcp-server
cd {blockchain}-mcp-server

# Initialize package.json
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk ethers axios zod
npm install -D typescript @types/node jest @types/jest ts-jest

# Create TypeScript config
cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Update package.json scripts
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.dev="tsx src/index.ts"
npm pkg set scripts.inspect="npx @modelcontextprotocol/inspector node dist/index.js"
npm pkg set scripts.test="jest"
```

## Step 2: Create MBPS Directory Structure (5 min)

```bash
# Create standard directories
mkdir -p src/tools/{core,tokens,network,transactions,wallets,utility,help}
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/config
mkdir -p tests/{unit,integration,smoke}

# Create base files
touch src/index.ts
touch src/config/network.ts
touch src/types/index.ts
touch src/utils/validation.ts
touch src/tools/core/mbps-core-tools.ts
```

## Step 3: Network Configuration (10 min)

```typescript
// src/config/network.ts
export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  symbol: string;
  explorer: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  mainnet: {
    name: '{Blockchain} Mainnet',
    chainId: 1, // Your chain ID
    rpcUrl: process.env.RPC_URL || 'https://rpc.{blockchain}.com',
    symbol: 'TOKEN',
    explorer: 'https://explorer.{blockchain}.com'
  },
  testnet: {
    name: '{Blockchain} Testnet',
    chainId: 2, // Your testnet chain ID
    rpcUrl: process.env.TESTNET_RPC_URL || 'https://testnet-rpc.{blockchain}.com',
    symbol: 'tTOKEN',
    explorer: 'https://testnet-explorer.{blockchain}.com'
  }
};

export function getCurrentNetwork(): NetworkConfig {
  const network = process.env.NETWORK || 'testnet';
  return NETWORKS[network] || NETWORKS.testnet;
}
```

## Step 4: Implement 25 MBPS Core Tools (30 min)

```typescript
// src/tools/core/mbps-core-tools.ts
import { z } from 'zod';
import { ethers } from 'ethers'; // or your blockchain SDK
import { getCurrentNetwork } from '../config/network.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

// Validation schemas
const AddressSchema = z.object({
  address: z.string().min(1, 'Address required')
});

const TransactionSchema = z.object({
  hash: z.string().min(1, 'Transaction hash required')
});

// MBPS Tool Definitions (25 tools)
export const toolDefinitions = [
  // 1. Chain Info
  {
    name: '{prefix}_get_chain_info',
    description: 'Get comprehensive blockchain information',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  
  // 2. Network Info
  {
    name: '{prefix}_get_network_info',
    description: 'Get network status and configuration',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  
  // 3. Get Balance
  {
    name: '{prefix}_get_balance',
    description: 'Get native token balance for address',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Blockchain address' }
      },
      required: ['address']
    }
  },
  
  // 4. Get Transaction
  {
    name: '{prefix}_get_transaction',
    description: 'Get transaction details by hash',
    inputSchema: {
      type: 'object',
      properties: {
        hash: { type: 'string', description: 'Transaction hash' }
      },
      required: ['hash']
    }
  },
  
  // 5. Get Block
  {
    name: '{prefix}_get_block',
    description: 'Get block information',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'number', description: 'Block number (optional)' }
      },
      required: []
    }
  },
  
  // ... Add all 25 tools following MBPS v2.1 spec
];

// Handler implementations
export async function handleGetChainInfo(args: any, provider: any) {
  try {
    const network = getCurrentNetwork();
    const [blockNumber, gasPrice, nodeInfo] = await Promise.all([
      provider.getBlockNumber(),
      provider.getFeeData(),
      provider.getNetwork()
    ]);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          network: network.name,
          chainId: network.chainId,
          blockHeight: blockNumber,
          gasPrice: gasPrice.gasPrice?.toString(),
          symbol: network.symbol,
          rpcUrl: network.rpcUrl,
          explorer: network.explorer
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get chain info: ${error.message}`
    );
  }
}

export async function handleGetBalance(args: any, provider: any) {
  try {
    const { address } = AddressSchema.parse(args);
    
    // Validate address format (blockchain-specific)
    if (!ethers.isAddress(address)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid address format: ${address}`
      );
    }
    
    const balance = await provider.getBalance(address);
    const formatted = ethers.formatEther(balance);
    
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          address,
          balance: `${formatted} ${getCurrentNetwork().symbol}`,
          balanceWei: balance.toString(),
          symbol: getCurrentNetwork().symbol
        }, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Failed to get balance: ${error.message}`
    );
  }
}

// ... Implement all 25 handlers

// Export handlers map
export const toolHandlers = {
  '{prefix}_get_chain_info': handleGetChainInfo,
  '{prefix}_get_balance': handleGetBalance,
  // ... all 25 handlers
};
```

## Step 5: Main Server Implementation (20 min)

```typescript
// src/index.ts
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';
import { ethers } from 'ethers'; // or your blockchain SDK
import { getCurrentNetwork } from './config/network.js';
import { 
  toolDefinitions as coreTools, 
  toolHandlers as coreHandlers 
} from './tools/core/mbps-core-tools.js';

class BlockchainMCPServer {
  private server: Server;
  private provider: ethers.JsonRpcProvider;
  private allTools: any[];
  private allHandlers: Record<string, Function>;
  
  constructor() {
    // Initialize provider
    const network = getCurrentNetwork();
    this.provider = new ethers.JsonRpcProvider(network.rpcUrl);
    
    // Combine all tools (add more categories as you build them)
    this.allTools = [
      ...coreTools,
      // ...tokenTools,
      // ...defiTools,
    ];
    
    // Combine all handlers
    this.allHandlers = {
      ...coreHandlers,
      // ...tokenHandlers,
      // ...defiHandlers,
    };
    
    // Initialize MCP server
    this.server = new Server(
      {
        name: '{blockchain}-mcp-server',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );
    
    this.setupHandlers();
  }
  
  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.allTools
    }));
    
    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      const handler = this.allHandlers[name];
      if (!handler) {
        throw new Error(`Tool not found: ${name}`);
      }
      
      return await handler(args || {}, this.provider);
    });
  }
  
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // NO console output here! (STDIO compliance)
  }
}

// Start server
const server = new BlockchainMCPServer();
server.run().catch(console.error);
```

## Step 6: Add Help System (15 min)

```typescript
// src/tools/help/index.ts
export const helpTools = [
  {
    name: '{prefix}_help',
    description: 'Get help and usage information',
    inputSchema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'Help topic' }
      },
      required: []
    }
  },
  {
    name: '{prefix}_search_tools',
    description: 'Search available tools',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' }
      },
      required: ['query']
    }
  },
  {
    name: '{prefix}_list_tools_by_category',
    description: 'List tools by category',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Tool category' }
      },
      required: []
    }
  }
];

export async function handleHelp(args: any) {
  const { topic } = args;
  
  const helpText = `
# {Blockchain} MCP Server

## Available Categories:
- core: Blockchain fundamentals (25 tools)
- tokens: Token operations
- network: Network management
- transactions: Transaction operations
- wallets: Wallet management

## Quick Start:
1. Get chain info: {prefix}_get_chain_info
2. Check balance: {prefix}_get_balance
3. Send transaction: {prefix}_send_transaction

## For more help:
- Search tools: {prefix}_search_tools
- List by category: {prefix}_list_tools_by_category
  `;
  
  return {
    content: [{
      type: 'text',
      text: helpText.trim()
    }]
  };
}

// ... implement search and list handlers
```

## Step 7: Testing Setup (10 min)

```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};

// tests/smoke/server.test.ts
describe('Server Smoke Tests', () => {
  it('should compile without errors', () => {
    expect(() => require('../../dist/index')).not.toThrow();
  });
});

// tests/unit/mbps-tools.test.ts
import { handleGetBalance } from '../../src/tools/core/mbps-core-tools';

describe('MBPS Core Tools', () => {
  it('should validate address in get_balance', async () => {
    await expect(handleGetBalance({}, mockProvider))
      .rejects.toThrow('Address required');
  });
});
```

## Step 8: Documentation (10 min)

```markdown
# README.md

# {Blockchain} MCP Server

✅ **MBPS v2.1 Compliant** - 25+ tools for {blockchain} integration

## Features
- 25 MBPS core tools
- Full TypeScript support
- Modular architecture
- Help system
- Network switching

## Installation
\`\`\`bash
npm install
npm run build
\`\`\`

## Usage
\`\`\`bash
# MCP Inspector
npm run inspect

# Claude Desktop
Add to claude_desktop_config.json
\`\`\`

## Tools
- Core: 25 tools
- Tokens: X tools
- DeFi: X tools
Total: XX tools
```

## Step 9: Validation (10 min)

```bash
# 1. Build
npm run build
echo "✅ Build successful"

# 2. Test STDIO compliance
echo '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' | \
  node dist/index.js 2>/tmp/err.log
[ -s /tmp/err.log ] && echo "❌ STDIO issues" || echo "✅ STDIO clean"

# 3. Run tests
npm test
echo "✅ Tests passing"

# 4. Check with Inspector
npm run inspect
# Manually verify 25+ tools appear

# 5. Test core tools
# In Inspector, test each MBPS tool
```

## Step 10: Production Checklist

- [ ] 25 MBPS core tools implemented
- [ ] All tools follow naming convention
- [ ] Error handling with McpError
- [ ] No console output in production
- [ ] TypeScript compilation successful
- [ ] Tests written and passing
- [ ] README documentation complete
- [ ] Help system functional
- [ ] Network switching works
- [ ] Package.json metadata complete

## Common Patterns to Copy

### Pattern 1: Provider Setup (Ethereum-like)
```typescript
import { ethers } from 'ethers';
const provider = new ethers.JsonRpcProvider(rpcUrl);
```

### Pattern 2: Provider Setup (Solana)
```typescript
import { Connection } from '@solana/web3.js';
const connection = new Connection(rpcUrl, 'confirmed');
```

### Pattern 3: Provider Setup (Bitcoin)
```typescript
import axios from 'axios';
const rpcClient = axios.create({
  baseURL: rpcUrl,
  auth: { username, password }
});
```

## Next Steps

1. **Extend with blockchain-specific tools** (tokens, DeFi, NFTs)
2. **Add specialized features** unique to your blockchain
3. **Implement caching** for performance
4. **Add rate limiting** for API protection
5. **Deploy to npm** for distribution

## Troubleshooting

### "Cannot find module" errors
Add `.js` extension to all imports

### TypeScript errors
Check `tsconfig.json` module settings

### Tools not appearing
Ensure tools are in both definitions AND handlers

### Network connection failures
Verify RPC endpoint is accessible

## Time Estimates

- **Hour 1**: Setup, structure, core tools
- **Hour 2**: Testing, validation, documentation
- **Day 1**: Full 25-tool implementation
- **Week 1**: Extended tools, production ready

## Reference Servers

Study these implementations:
- Simple: `ethereum-sepolia-mcp-server`
- Complex: `solana-devnet-mcp-server-refactor`
- Advanced: `osmosis-testnet-mcp-server`

---

**Questions?** See:
- [MBPS-v2.1-COMPREHENSIVE.md](./MBPS-v2.1-COMPREHENSIVE.md)
- [ERROR-HANDLING-PATTERNS.md](./ERROR-HANDLING-PATTERNS.md)
- [STDIO-PROTOCOL-GUIDELINES.md](./STDIO-PROTOCOL-GUIDELINES.md)