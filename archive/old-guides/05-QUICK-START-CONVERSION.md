# Quick Start: Converting Existing MCP Server to MBPS v2.1

## 🚀 30-Minute Conversion Guide

This guide helps you convert any existing blockchain MCP server to MBPS v2.1 compliance (25 core tools).

## Prerequisites
- Existing MCP server with monolithic architecture
- Node.js 18+, TypeScript 5+
- 1-2 hours for full conversion

## Step 1: Assess Current State (5 min)

```bash
# Count existing tools
grep -c "name:" src/index.ts

# Check file size (target: <500 lines)
wc -l src/index.ts

# List all tool names
grep "name:" src/index.ts | sed "s/.*name: '//" | sed "s/',.*//"
```

**Document findings:**
- Current tool count: ___
- Current file size: ___ lines
- Missing MBPS tools: ___

## Step 2: Create Modular Structure (5 min)

```bash
# Create MBPS-compliant directory structure
mkdir -p src/tools/{core,tokens,network,transactions,wallets,utility,help}
mkdir -p src/types
mkdir -p src/utils
mkdir -p tests/{unit,integration}

# Create base files
touch src/tools/core/mbps-core-tools.ts
touch src/tools/index.ts
touch src/types/index.ts
touch src/utils/validation.ts
```

## Step 3: Extract Core MBPS Tools (10 min)

### Create `src/tools/mbps-core-tools.ts`

```typescript
import { z } from 'zod';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

// Tool definitions for 25 MBPS v2.1 core tools in src/tools/core/
export const mbpsCoreTools = [
  // Network Info (2 tools)
  {
    name: '{prefix}_get_chain_info',
    description: 'Get comprehensive blockchain information',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: '{prefix}_get_network_info',
    description: 'Get network status and configuration',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  
  // Core Operations (4 tools)
  {
    name: '{prefix}_get_balance',
    description: 'Get native token balance',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Wallet address' }
      },
      required: ['address']
    }
  },
  {
    name: '{prefix}_get_transaction',
    description: 'Get transaction details',
    inputSchema: {
      type: 'object',
      properties: {
        hash: { type: 'string', description: 'Transaction hash' }
      },
      required: ['hash']
    }
  },
  {
    name: '{prefix}_get_block',
    description: 'Get block information',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'number', description: 'Block number' }
      },
      required: []
    }
  },
  {
    name: '{prefix}_validate_address',
    description: 'Validate blockchain address',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Address to validate' }
      },
      required: ['address']
    }
  },
  
  // Add remaining 19 tools following pattern...
];

// Handler implementations
export async function handleGetChainInfo(args: any, provider: any) {
  // Move implementation from index.ts
}

export async function handleGetBalance(args: any, provider: any) {
  // Move implementation from index.ts
}

// ... continue for all 25 handlers
```

## Step 4: Extract Existing Tools by Category (10 min)

### Pattern for Tool Extraction

1. **Identify tool category** (tokens, network, DeFi, etc.)
2. **Create category file** `src/tools/{category}/index.ts`
3. **Move tool definition and handler**

```typescript
// src/tools/tokens/index.ts
export const toolDefinitions = [
  {
    name: '{prefix}_get_token_balance',
    description: 'Get token balance',
    inputSchema: { /* ... */ }
  },
  // ... other token tools
];

export const toolHandlers = {
  '{prefix}_get_token_balance': handleGetTokenBalance,
  // ... other handlers
};

async function handleGetTokenBalance(args: any, provider: any) {
  // Implementation moved from index.ts
}
```

## Step 5: Update Main Index File (5 min)

```typescript
// src/index.ts (NEW - should be <500 lines)
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Import modular tools
import { mbpsCoreTools, handlers as coreHandlers } from './tools/core/mbps-core-tools.js';
import { toolDefinitions as tokenTools, toolHandlers as tokenHandlers } from './tools/tokens/index.js';
import { toolDefinitions as networkTools, toolHandlers as networkHandlers } from './tools/network/index.js';

class BlockchainMCPServer {
  private server: Server;
  private provider: any; // Your blockchain provider
  
  constructor() {
    // Combine all tools
    const allTools = [
      ...mbpsCoreTools,
      ...tokenTools,
      ...networkTools,
      // ... other categories
    ];
    
    this.server = new Server(
      { name: '{blockchain}-mcp-server', version: '2.0.0' },
      { capabilities: { tools: {} } }
    );
    
    this.setupHandlers();
  }
  
  private setupHandlers() {
    // Register tool list handler
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: allTools
    }));
    
    // Register tool call handler
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      // Route to appropriate handler
      const allHandlers = {
        ...coreHandlers,
        ...tokenHandlers,
        ...networkHandlers,
        // ... other handlers
      };
      
      const handler = allHandlers[name];
      if (!handler) {
        throw new Error(`Tool ${name} not found`);
      }
      
      return await handler(args, this.provider);
    });
  }
  
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // NO console.error here! (STDIO compliance)
  }
}

const server = new BlockchainMCPServer();
server.run().catch(console.error);
```

## Step 6: Validation Checklist (5 min)

Run these checks:

```bash
# 1. Build successfully
npm run build

# 2. Check STDIO compliance (no console output)
echo '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' | node dist/index.js 2>/tmp/err.log
[ -s /tmp/err.log ] && echo "❌ STDIO issues" || echo "✅ STDIO clean"

# 3. Count tools (should be 25+)
npm run inspect
# Manually count or grep tool list

# 4. Test core tools
npm run test:mbps-core

# 5. Check file sizes
wc -l src/index.ts  # Should be <500 lines
find src/tools -name "*.ts" | xargs wc -l  # Modular files
```

## Common Conversion Patterns

### Pattern 1: Tool Name Migration
```typescript
// OLD
'getBalance'
// NEW  
'{prefix}_get_balance'
```

### Pattern 2: Error Handling
```typescript
// OLD
throw new Error('Invalid address');
// NEW
throw new McpError(ErrorCode.InvalidParams, 'Invalid address format');
```

### Pattern 3: Response Format
```typescript
// OLD
return { balance: result };
// NEW
return {
  content: [{
    type: 'text',
    text: JSON.stringify({ balance: result }, null, 2)
  }]
};
```

## Troubleshooting

### Issue: "Tool not found" errors
**Solution**: Ensure tool is in both definitions array AND handlers object

### Issue: TypeScript compilation errors
**Solution**: Check imports use .js extension, verify all types

### Issue: Console output breaking MCP
**Solution**: Remove ALL console.log/error except in catch blocks

### Issue: Missing MBPS tools
**Solution**: Copy implementations from reference servers (Solana, BSC)

## Migration Timeline

- **Hour 1**: Structure setup, core tool extraction
- **Hour 2**: Category extraction, testing
- **Day 1**: Full testing, documentation
- **Week 1**: Production deployment

## Reference Implementations

Study these fully compliant servers:
- `servers/testnet/bsc-testnet-mcp-server-refactor` (36 tools)
- `servers/testnet/solana-devnet-mcp-server-refactor` (52 tools)

## Next Steps

1. ✅ Complete 25 MBPS core tools
2. ✅ Migrate all existing tools
3. ✅ Add comprehensive tests
4. ✅ Update README
5. ✅ Deploy to production

---

**Need Help?** Check:
- Full standard: [MBPS-v2.1-COMPREHENSIVE.md](./MBPS-v2.1-COMPREHENSIVE.md)
- Migration details: [MIGRATION-REQUIREMENTS.md](./MIGRATION-REQUIREMENTS.md)
- Testing guide: [TESTING-STANDARDIZATION-INSTRUCTIONS.md](./TESTING-STANDARDIZATION-INSTRUCTIONS.md)