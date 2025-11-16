# Complete Step-by-Step Guide: Build a Blockchain MCP Server

## 🎯 From Zero to Production in 2 Hours

This guide walks through creating a complete MBPS v2.1 compliant blockchain MCP server from scratch. Follow each step exactly.

---

## Step 0: Prerequisites Check

- [ ] **Node.js 18+** installed (`node --version`)
- [ ] **npm 9+** installed (`npm --version`)
- [ ] **Git** installed (`git --version`)
- [ ] **Choose blockchain** (Ethereum, Polygon, BSC, Solana, Bitcoin, XRP, Cosmos)
- [ ] **Choose prefix** (eth_, poly_, bnb_, sol_, btc_, xrp_, osmo_)

## Step 1: Project Setup (5 minutes)

### 1.1 Create Project Directory
```bash
# Terminal
mkdir {blockchain}-testnet-mcp-server
cd {blockchain}-testnet-mcp-server

# Replace {blockchain} with your choice:
# ethereum-testnet-mcp-server
# polygon-testnet-mcp-server
# bsc-testnet-mcp-server
# solana-devnet-mcp-server
# bitcoin-testnet-mcp-server
# xrp-testnet-mcp-server
# osmosis-testnet-mcp-server
```

### 1.2 Initialize Package.json
```bash
# Copy from COMMON-CONFIGURATIONS.md
cat > package.json << 'EOF'
{
  "name": "{blockchain}-testnet-mcp-server",
  "version": "1.0.0",
  "description": "MBPS v2.1 compliant MCP server for {Blockchain} testnet",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "jest",
    "inspect": "npx @modelcontextprotocol/inspector node dist/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.6.0",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.0",
    "ts-jest": "^29.1.0"
  }
}
EOF
```

### 1.3 Create Configuration Files
```bash
# TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# Environment template
cat > .env.example << 'EOF'
NETWORK=testnet
RPC_URL=https://rpc.testnet.{blockchain}.com
CHAIN_ID=12345
EOF
```

## Step 2: Directory Structure (2 minutes)

```bash
# Create MBPS standard directory structure
mkdir -p src/{tools/{core,tokens,network,transactions,wallets,utility,help},types,utils,config}
mkdir -p tests/{unit,integration,smoke}

# Create essential files
touch src/index.ts
touch src/client.ts
touch src/config/network.ts
touch src/types/index.ts
touch src/utils/validation.ts
touch src/tools/core/mbps-core-tools.ts
touch src/tools/help/index.ts
```

## Step 3: Network Configuration (5 minutes)

### 3.1 Create Network Config
```typescript
// src/config/network.ts
export interface NetworkConfig {
  name: string;
  chainId: number | string;
  rpcUrl: string;
  symbol: string;
  blockTime: number;
  consensus: string;
  explorer: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  mainnet: {
    name: '{Blockchain} Mainnet',
    chainId: 1,
    rpcUrl: 'https://rpc.{blockchain}.com',
    symbol: 'TOKEN',
    blockTime: 10,
    consensus: 'Proof of Stake',
    explorer: 'https://explorer.{blockchain}.com'
  },
  testnet: {
    name: '{Blockchain} Testnet',
    chainId: 12345,
    rpcUrl: 'https://rpc.testnet.{blockchain}.com',
    symbol: 'tTOKEN',
    blockTime: 10,
    consensus: 'Proof of Stake',
    explorer: 'https://testnet.explorer.{blockchain}.com'
  }
};

export function getCurrentNetwork(): NetworkConfig {
  const network = process.env.NETWORK || 'testnet';
  return NETWORKS[network] || NETWORKS.testnet;
}
```

### 3.2 Create Blockchain Client
```typescript
// src/client.ts
import { NetworkConfig, getCurrentNetwork } from './config/network.js';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

export class BlockchainClient {
  protected network: NetworkConfig;

  constructor() {
    this.network = getCurrentNetwork();
  }

  // Core blockchain operations (implement based on your blockchain)
  async getBlockNumber(): Promise<number> {
    // Implementation
    return 0;
  }

  async getBalance(address: string): Promise<bigint> {
    // Implementation
    return BigInt(0);
  }

  async getTransaction(hash: string): Promise<any> {
    // Implementation
    return {};
  }

  async getBlock(blockNumber: string | number): Promise<any> {
    // Implementation
    return {};
  }

  // Validation methods
  isValidAddress(address: string): boolean {
    // Implementation
    return false;
  }

  isValidTxHash(hash: string): boolean {
    // Implementation
    return false;
  }

  formatBalance(balance: bigint): string {
    // Implementation
    return '0';
  }

  async getNetwork(): Promise<NetworkConfig> {
    return this.network;
  }
}
```

## Step 4: Implement 25 MBPS Core Tools (45 minutes)

### 4.1 Create Core Tools File
```typescript
// src/tools/core/mbps-core-tools.ts
import { z } from 'zod';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { BlockchainClient } from '../../client.js';

// Validation schemas
const AddressSchema = z.object({
  address: z.string().min(1, 'Address required')
});

const TransactionHashSchema = z.object({
  hash: z.string().min(1, 'Transaction hash required')
});

// 1. Get Chain Info
const GetChainInfoSchema = z.object({});
export async function handleGetChainInfo(args: any, client: BlockchainClient) {
  try {
    const network = await client.getNetwork();
    const blockNumber = await client.getBlockNumber();

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          network: network.name,
          chainId: network.chainId,
          blockHeight: blockNumber,
          symbol: network.symbol
        }, null, 2)
      }]
    };
  } catch (error: any) {
    throw new McpError(ErrorCode.InternalError, error.message);
  }
}

// 2. Get Balance
const GetBalanceSchema = z.object({
  address: z.string().min(1, 'Address required')
});
export async function handleGetBalance(args: any, client: BlockchainClient) {
  try {
    const { address } = GetBalanceSchema.parse(args);

    if (!client.isValidAddress(address)) {
      throw new McpError(ErrorCode.InvalidParams, 'Invalid address');
    }

    const balance = await client.getBalance(address);
    const formatted = client.formatBalance(balance);
    const network = await client.getNetwork();

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          address,
          balance: formatted,
          balanceRaw: balance.toString(),
          symbol: network.symbol
        }, null, 2)
      }]
    };
  } catch (error: any) {
    if (error instanceof McpError) throw error;
    throw new McpError(ErrorCode.InternalError, error.message);
  }
}

// ... Continue with all 25 tools using the same pattern
```

### 4.2 Tool Definitions Array
```typescript
// Add to mbps-core-tools.ts
export const toolDefinitions = [
  {
    name: '{prefix}_get_chain_info',
    description: 'Get comprehensive blockchain information',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: '{prefix}_get_balance',
    description: 'Get native token balance for address',
    inputSchema: {
      type: 'object',
      properties: { address: { type: 'string' } },
      required: ['address']
    }
  },
  // ... all 25 tools
];

export const toolHandlers = {
  '{prefix}_get_chain_info': handleGetChainInfo,
  '{prefix}_get_balance': handleGetBalance,
  // ... all 25 handlers
};
```

## Step 5: Main Server Implementation (10 minutes)

```typescript
// src/index.ts
#!/usr/bin/env node
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';
import { BlockchainClient } from './client.js';
import {
  toolDefinitions,
  toolHandlers
} from './tools/core/mbps-core-tools.js';

class BlockchainMCPServer {
  private server: Server;
  private client: BlockchainClient;

  constructor() {
    this.client = new BlockchainClient();
    this.server = new Server(
      {
        name: '{blockchain}-testnet-mcp-server',
        version: '1.0.0'
      },
      {
        capabilities: { tools: {} }
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: toolDefinitions
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      const handler = toolHandlers[name];

      if (!handler) {
        throw new McpError(ErrorCode.MethodNotFound, `Tool not found: ${name}`);
      }

      return await handler(args || {}, this.client);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // NO console output here
  }
}

const server = new BlockchainMCPServer();
server.run().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
```

## Step 6: Install Dependencies & Build (5 minutes)

```bash
# Install dependencies
npm install

# Install blockchain-specific libraries
npm install ethers@^6.0.0  # For EVM chains
# OR
npm install @solana/web3.js@^1.87.0  # For Solana
# OR
npm install @cosmjs/stargate@^0.32.0  # For Cosmos
# OR
npm install xrpl@^2.12.0  # For XRP
# OR
npm install bitcoinjs-lib@^6.1.0  # For Bitcoin

# Build the server
npm run build

# Test build
node dist/index.js --version 2>/dev/null || echo "Build successful"
```

## Step 7: Create Help System (15 minutes)

```typescript
// src/tools/help/index.ts
import { z } from 'zod';
import { BlockchainClient } from '../../client.js';

const HelpSchema = z.object({
  topic: z.string().optional()
});

const SearchToolsSchema = z.object({
  query: z.string().min(1, 'Search query required')
});

const ListToolsByCategorySchema = z.object({
  category: z.string().optional()
});

export const helpToolDefinitions = [
  {
    name: '{prefix}_help',
    description: 'Get help and usage information',
    inputSchema: {
      type: 'object',
      properties: { topic: { type: 'string' } },
      required: []
    }
  },
  {
    name: '{prefix}_search_tools',
    description: 'Search available tools',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query']
    }
  },
  {
    name: '{prefix}_list_tools_by_category',
    description: 'List tools by category',
    inputSchema: {
      type: 'object',
      properties: { category: { type: 'string' } },
      required: []
    }
  }
];

export async function handleHelp(args: any, client: BlockchainClient) {
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

For more help:
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
```

## Step 8: Testing Setup (10 minutes)

### 8.1 Create Test Files
```typescript
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
    const mockClient = {
      isValidAddress: jest.fn().mockReturnValue(false),
      getBalance: jest.fn(),
      getNetwork: jest.fn()
    };

    await expect(handleGetBalance({}, mockClient))
      .rejects.toThrow('Invalid address');
  });
});
```

### 8.2 Jest Configuration
```javascript
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
```

## Step 9: Documentation (10 minutes)

### 9.1 Create README.md
```markdown
# {Blockchain} Testnet MCP Server

✅ **MBPS v2.1 Compliant** - 25+ tools for {blockchain} integration

## Features
- 25 MBPS core tools implemented
- Full TypeScript support
- Modular architecture
- Help system included
- Network management

## Installation
\`\`\`bash
git clone <your-repo>
cd {blockchain}-testnet-mcp-server
npm install
npm run build
\`\`\`

## Usage

### MCP Inspector (Testing)
\`\`\`bash
npm run inspect
\`\`\`

### Claude Desktop Integration
Add to claude_desktop_config.json:
\`\`\`json
{
  "mcpServers": {
    "{blockchain}-testnet": {
      "command": "node",
      "args": ["path/to/server/dist/index.js"]
    }
  }
}
\`\`\`

## Tools
- **Core**: 25 MBPS tools
- **Total**: 25+ tools

## License
MIT
```

## Step 10: Validation & Testing (10 minutes)

```bash
# 1. Build check
npm run build
echo "✅ Build successful"

# 2. Test execution
npm test
echo "✅ Tests passing"

# 3. MCP Inspector test
npm run inspect &
sleep 2
curl -X POST http://localhost:3000/jsonrpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}' \
  | jq '.result.tools | length'
echo "✅ Inspector shows tools"

# 4. Tool functionality test
# In Inspector, test each core tool manually
```

## Step 11: Production Checklist

- [ ] **25 MBPS core tools** implemented and working
- [ ] **TypeScript compilation** successful
- [ ] **Tests passing** with 80%+ coverage
- [ ] **MCP Inspector** shows all 25+ tools
- [ ] **No console output** in production code
- [ ] **README.md** complete with examples
- [ ] **Help system** functional
- [ ] **Error handling** with McpError types
- [ ] **Network connectivity** verified

## Troubleshooting

### Common Issues

1. **"Cannot find module"**
   - Add `.js` extension to TypeScript imports
   - Check tsconfig.json module settings

2. **"Tool not found"**
   - Ensure tool is in both definitions AND handlers
   - Check tool name matches exactly

3. **"Invalid address"**
   - Implement `isValidAddress()` in client
   - Test with valid testnet addresses

4. **"Connection failed"**
   - Verify RPC endpoint is accessible
   - Check network configuration

### Debug Commands
```bash
# Check TypeScript compilation
npx tsc --noEmit

# Run tests in watch mode
npm run test:watch

# Check for console output
node dist/index.js 2>&1 | head -20

# Verify tool count
grep -c "name:" src/tools/core/mbps-core-tools.ts
```

## Next Steps (Optional)

1. **Add Extended Tools** (tokens, DeFi, NFTs)
2. **Implement Caching** for performance
3. **Add Rate Limiting** for API protection
4. **Create Docker Image** for deployment
5. **Set Up CI/CD** with GitHub Actions

---

## Time Estimate Breakdown

- **Setup**: 5 minutes
- **Structure**: 2 minutes
- **Configuration**: 5 minutes
- **Core Tools**: 45 minutes
- **Server**: 10 minutes
- **Help System**: 15 minutes
- **Testing**: 10 minutes
- **Documentation**: 10 minutes
- **Validation**: 10 minutes

**Total: ~2 hours**

## Reference Servers

Study these for blockchain-specific implementations:
- **Ethereum**: `ethereum-sepolia-mcp-server-refactor`
- **Bitcoin**: `bitcoin-testnet-mcp-server-refactor`
- **Solana**: `solana-devnet-mcp-server-refactor`
- **XRP**: `xrp-testnet-mcp-server-refactor`
- **Osmosis**: `osmosis-testnet-mcp-server`

---

**Questions?** See:
- [MBPS-v2.1-COMPREHENSIVE.md](../MBPS-v2.1-COMPREHENSIVE.md)
- [TOOL-IMPLEMENTATION-TEMPLATES.md](../TOOL-IMPLEMENTATION-TEMPLATES.md)
- [BLOCKCHAIN-CLIENT-TEMPLATES.md](../BLOCKCHAIN-CLIENT-TEMPLATES.md)
- [COMMON-CONFIGURATIONS.md](../COMMON-CONFIGURATIONS.md)
