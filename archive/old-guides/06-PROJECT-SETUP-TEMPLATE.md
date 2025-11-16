# MCP Blockchain Server - Project Setup Template

## 🎯 Complete Project Initialization Blueprint

This template provides the exact commands and configurations to create a new blockchain MCP server from scratch.

---

## 1. Project Creation

### Choose Your Blockchain Prefix
Select the appropriate prefix from the MBPS chain registry:

| Blockchain | Testnet Prefix | Example |
|------------|---------------|---------|
| Ethereum | `eth_` | `eth_get_balance` |
| Polygon | `poly_` | `poly_get_balance` |
| BSC | `bnb_` | `bnb_get_balance` |
| Solana | `sol_` | `sol_get_balance` |
| Bitcoin | `btc_` | `btc_get_balance` |
| XRP | `xrp_` | `xrp_get_balance` |
| Osmosis | `osmo_` | `osmo_get_balance` |

### Project Structure
```bash
# Create project directory
mkdir {blockchain}-testnet-mcp-server
cd {blockchain}-testnet-mcp-server

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install @modelcontextprotocol/sdk@^1.0.0
npm install zod@^3.22.0
npm install axios@^1.6.0

# Install blockchain-specific libraries
npm install ethers@^6.0.0              # EVM chains (Ethereum, Polygon, BSC, etc.)
# OR
npm install @solana/web3.js@^1.87.0    # Solana
# OR
npm install @cosmjs/stargate@^0.32.0   # Cosmos SDK chains
# OR
npm install xrpl@^2.12.0              # XRP Ledger
# OR
npm install bitcoinjs-lib@^6.1.0      # Bitcoin
# OR
npm install near-api-js@^2.1.0         # NEAR

# Install development dependencies
npm install -D typescript@^5.3.0
npm install -D @types/node@^20.0.0
npm install -D tsx@^4.6.0
npm install -D jest@^29.7.0
npm install -D @types/jest@^29.5.0
npm install -D ts-jest@^29.1.0
```

## 2. Standard Configuration Files

### package.json Template
```json
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
    "test:watch": "jest --watch",
    "inspect": "npx @modelcontextprotocol/inspector node dist/index.js",
    "test-tools": "node test-tools.js"
  },
  "keywords": [
    "mcp",
    "blockchain",
    "{blockchain}",
    "testnet",
    "mbps",
    "ai-integration"
  ],
  "author": "Your Name",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.22.0",
    "axios": "^1.6.0",
    "{blockchain-library}": "^X.X.X"
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
```

### tsconfig.json Template
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  },
  "include": [
    "src/**/*",
    "tests/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### jest.config.js Template
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
```

### .env.example Template
```env
# Network Configuration
NETWORK=testnet
RPC_URL=https://rpc.testnet.{blockchain}.com
CHAIN_ID=12345

# Optional: Custom RPC endpoint
CUSTOM_RPC_URL=https://your-custom-rpc-endpoint.com

# API Keys (if needed)
API_KEY=your_api_key_here
PRIVATE_KEY=your_private_key_here  # For testing only

# Development
DEBUG=false
LOG_LEVEL=info
```

## 3. Directory Structure Creation

```bash
# Create standard MBPS directory structure
mkdir -p src/{tools/{core,tokens,network,transactions,wallets,utility,help},types,utils,config}
mkdir -p tests/{unit,integration,smoke}
mkdir -p docs
mkdir -p examples

# Create essential files
touch src/index.ts
touch src/client.ts
touch src/config/network.ts
touch src/types/index.ts
touch src/utils/validation.ts
touch src/tools/core/mbps-core-tools.ts
touch src/tools/help/index.ts
touch tests/unit/mbps-tools.test.ts
touch tests/smoke/server.test.ts
touch .env.example
```

## 4. Standard File Templates

### src/index.ts Template
```typescript
#!/usr/bin/env node
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';

import { BlockchainClient } from './client.js';
import {
  toolDefinitions,
  toolHandlers
} from './tools/core/mbps-core-tools.js';

class BlockchainMCPServer {
  private server: Server;
  private client: BlockchainClient;
  private allTools: any[];
  private allHandlers: Record<string, Function>;

  constructor() {
    this.client = new BlockchainClient();

    // Initialize with MBPS core tools
    this.allTools = [...toolDefinitions];
    this.allHandlers = { ...toolHandlers };

    this.server = new Server(
      {
        name: '{blockchain}-testnet-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
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
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Tool not found: ${name}`
        );
      }

      try {
        return await handler(args || {}, this.client);
      } catch (error: any) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // NO console output here (STDIO compliance)
  }
}

// Start server
const server = new BlockchainMCPServer();
server.run().catch((error) => {
  // Log to stderr only for critical errors
  console.error('Server startup failed:', error);
  process.exit(1);
});
```

### src/client.ts Template
```typescript
// Blockchain-specific client initialization
export class BlockchainClient {
  // EVM Chains (Ethereum, Polygon, BSC, etc.)
  private provider: any;

  // Bitcoin
  private rpcClient: any;

  // Solana
  private connection: any;

  // Cosmos SDK
  private stargateClient: any;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    // Implementation depends on blockchain type
    // See BLOCKCHAIN-CLIENT-TEMPLATES.md for examples
  }

  // Common interface methods
  async getBlockNumber(): Promise<number> {
    // Implementation
    return 0;
  }

  async getBalance(address: string): Promise<string> {
    // Implementation
    return '0';
  }

  // Add blockchain-specific methods
}
```

## 5. Next Steps After Setup

1. **Implement MBPS Core Tools** (25 tools required)
   - See TOOL-IMPLEMENTATION-TEMPLATES.md

2. **Add Help System**
   - Implement help, search, and category tools
   - See MCP-HELP-SYSTEM-STANDARD.md

3. **Create Tests**
   - Unit tests for all tools
   - Integration tests for blockchain interactions

4. **Documentation**
   - Update README.md with tool catalog
   - Add usage examples
   - Document configuration

5. **Validation**
   - Test with MCP Inspector
   - Verify all 25 tools work
   - Check STDIO compliance

## 6. Common Issues & Solutions

### ES Module Problems
- ✅ Use `"type": "module"` in package.json
- ✅ Add `.js` extension to TypeScript imports
- ✅ Use `.cjs` extension for config files

### TypeScript Errors
- ✅ Set `"moduleResolution": "NodeNext"`
- ✅ Use `"allowSyntheticDefaultImports": true`
- ✅ Add `"skipLibCheck": true` for blockchain libraries

### RPC Connection Issues
- ✅ Verify testnet RPC endpoints are accessible
- ✅ Check network connectivity
- ✅ Use fallback RPC URLs

### Tool Not Found Errors
- ✅ Ensure tool is in both definitions AND handlers
- ✅ Check import/export statements
- ✅ Verify tool name matches exactly

## 7. Validation Checklist

- [ ] Project structure created correctly
- [ ] Dependencies installed without errors
- [ ] TypeScript compilation successful
- [ ] No console output in production code
- [ ] .env.example file created
- [ ] All configuration files in place
- [ ] Basic client connection works

---

**Next:** Proceed to TOOL-IMPLEMENTATION-TEMPLATES.md for implementing the 25 MBPS core tools.
