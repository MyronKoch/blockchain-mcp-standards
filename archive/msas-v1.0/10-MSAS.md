# MCP Server Architecture Standard (MSAS) v1.0

## The Universal Standard for MCP Server Code Organization

**Version**: 1.0  
**Date**: September 20, 2025  
**Author**: AI Development Team  
**Status**: ACTIVE STANDARD  
**Companion to**: MBPS v2.1 (comprehensive tool standard)

---

## Executive Summary

The MCP Server Architecture Standard (MSAS) establishes THE definitive code organization pattern for all blockchain MCP servers. This standard enables scalability from 30 tools to 500+ tools per chain, maintainability across large codebases, and consistent development patterns.

## Core Principles

1. **Modular Organization**: One tool per file, organized by functional categories
2. **Scalability**: Support 200-500+ tools per chain without becoming unwieldy
3. **Maintainability**: Easy to locate, modify, and test individual tools
4. **Consistency**: Same patterns across all blockchain servers
5. **Developer Experience**: Clear structure that's intuitive to navigate

## Mandatory File Structure

```
{chain-name}-mcp-server/
├── src/
│   ├── index.ts                 # Main entry point & tool routing
│   ├── client.ts                # Blockchain client wrapper
│   ├── constants.ts             # ABIs, addresses, configs
│   ├── logger.ts                # Logging configuration
│   ├── types.ts                 # TypeScript type definitions
│   └── tools/                   # Tool implementations
│       ├── core/                # Blockchain fundamentals
│       ├── wallet/              # Wallet operations
│       ├── tokens/              # Token operations
│       ├── nft/                 # NFT operations
│       ├── defi/                # DeFi protocols
│       ├── staking/             # Staking operations
│       ├── lending/             # Lending protocols
│       ├── contracts/           # Smart contract ops
│       ├── validators/          # Validator information
│       ├── governance/          # Governance proposals
│       ├── bridge/              # Cross-chain bridging
│       └── analytics/           # Network analytics
├── package.json
├── tsconfig.json
└── README.md
```

## Tool Categories (Standardized)

### 1. `core/` - Blockchain Fundamentals
**Purpose**: Essential blockchain operations
**Examples**:
- `{chain}_get_chain_info.ts`
- `{chain}_get_balance.ts` 
- `{chain}_get_transaction.ts`
- `{chain}_get_block.ts`
- `{chain}_estimate_gas.ts`

### 2. `wallet/` - Wallet Operations  
**Purpose**: Wallet creation and management
**Examples**:
- `{chain}_create_wallet.ts`
- `{chain}_import_wallet.ts`
- `{chain}_validate_address.ts`
- `{chain}_request_faucet.ts`

### 3. `tokens/` - Token Operations
**Purpose**: ERC20/SPL/Native token operations
**Examples**:
- `{chain}_get_token_balance.ts`
- `{chain}_transfer_token.ts`
- `{chain}_approve_token.ts`
- `{chain}_get_token_info.ts`
- `{chain}_deploy_erc20_token.ts`

### 4. `nft/` - NFT Operations
**Purpose**: Non-fungible token operations
**Examples**:
- `{chain}_mint_nft.ts`
- `{chain}_transfer_nft.ts`
- `{chain}_get_nft_metadata.ts`
- `{chain}_deploy_nft_contract.ts`

### 5. `defi/` - DeFi Protocol Operations
**Purpose**: Decentralized finance interactions
**Examples**:
- `{chain}_swap_tokens_dex.ts`
- `{chain}_add_liquidity.ts`
- `{chain}_remove_liquidity.ts`
- `{chain}_get_pool_info.ts`
- `{chain}_find_arbitrage.ts`

### 6. `staking/` - Staking Operations
**Purpose**: Token staking and delegation
**Examples**:
- `{chain}_stake_tokens.ts`
- `{chain}_unstake_tokens.ts`
- `{chain}_get_staking_info.ts`
- `{chain}_claim_rewards.ts`

### 7. `lending/` - Lending Protocol Operations
**Purpose**: Lending and borrowing operations
**Examples**:
- `{chain}_deposit_lending.ts`
- `{chain}_borrow_asset.ts`
- `{chain}_get_lending_position.ts`

### 8. `contracts/` - Smart Contract Operations
**Purpose**: General smart contract interactions
**Examples**:
- `{chain}_deploy_contract.ts`
- `{chain}_call_contract_method.ts`
- `{chain}_get_contract_info.ts`

## File Templates

### Tool File Template
```typescript
import { ethers } from 'ethers';
import { {Chain}Client } from '../../client.js';
import logger from '../../logger.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { REQUIRED_CONSTANTS } from '../../constants.js';

export async function handle{Chain}{Action}{Resource}(
  args: any,
  client: {Chain}Client
): Promise<{ content: Array<{ type: string; text: string }> }> {
  const { param1, param2 } = args as {
    param1: string;
    param2: string;
  };

  try {
    // Implementation here
    const result = await performOperation();

    logger.info('Operation completed successfully', {
      param1,
      result: result.summary
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error('Operation failed:', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
```

### Client Wrapper Template
```typescript
import { ethers } from 'ethers';
import logger from './logger.js';

export class {Chain}Client {
  public provider: ethers.JsonRpcProvider;
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.{CHAIN}_RPC_URL || 'default-rpc-url';
    this.provider = new ethers.JsonRpcProvider(this.apiUrl);
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.provider.getBlockNumber();
      return true;
    } catch {
      return false;
    }
  }
}
```

### Index.ts Template
```typescript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

import { {Chain}Client } from './client.js';
import logger from './logger.js';

// Import all tool handlers
import { handle{Chain}GetBalance } from './tools/core/{chain}-get-balance.js';
// ... all other imports

const client = new {Chain}Client();

const server = new Server(
  {
    name: '{chain}_mcp-{chain-name}',
    version: '1.0.0',
  },
  {
    capabilities: { tools: {} },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: '{chain}_get_balance',
        description: 'Get balance for an address',
        inputSchema: {
          type: 'object',
          properties: {
            address: { type: 'string', description: 'Address to check' },
          },
          required: ['address'],
        },
      },
      // ... all other tools
    ],
  };
});

// Tool routing
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case '{chain}_get_balance':
        return await handle{Chain}GetBalance(args, client);
      // ... all other cases
      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (error) {
    logger.error(`Tool execution failed: ${name}`, error);
    throw error;
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info('{Chain} MCP server started');
}

main().catch(console.error);
```

## Migration Process

### From Monolithic to Modular

1. **Create Directory Structure**
   ```bash
   mkdir -p src/tools/{core,wallet,tokens,nft,defi,staking,lending,contracts,validators,governance,bridge,analytics}
   ```

2. **Extract Constants**
   - Move all ABIs, addresses, and configs to `constants.ts`
   - Export individual constants for easy importing

3. **Create Client Wrapper**
   - Abstract provider/connection logic
   - Add health checking capabilities

4. **Extract Tools**
   - One function per file
   - Consistent naming: `handle{Chain}{Action}{Resource}`
   - Proper imports and error handling

5. **Update Index.ts**
   - Import all handlers
   - Clean switch statement for routing
   - Remove all business logic

6. **Build and Test**
   - Ensure TypeScript compilation works
   - Test with MCP inspector
   - Verify all tools function correctly

## Automation Scripts

### Tool Extraction Script (Python)
```python
import re
import os

def extract_tools_from_monolith(file_path, output_dir):
    """Extract individual tools from monolithic file"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Pattern to match tool implementations
    pattern = r'case [\'"](\w+)[\'"]:\s*{([^}]+)}'
    
    matches = re.findall(pattern, content, re.DOTALL)
    
    for tool_name, tool_code in matches:
        # Determine category from tool name
        category = determine_category(tool_name)
        
        # Create tool file
        tool_file = f"{output_dir}/tools/{category}/{tool_name.replace('_', '-')}.ts"
        
        # Generate tool content
        tool_content = generate_tool_file(tool_name, tool_code)
        
        os.makedirs(os.path.dirname(tool_file), exist_ok=True)
        with open(tool_file, 'w') as f:
            f.write(tool_content)
```

## Quality Standards

### Code Quality
- ✅ TypeScript strict mode enabled
- ✅ All tools properly typed
- ✅ Comprehensive error handling
- ✅ Logging for observability

### Testing Standards
- ✅ All tools must build without errors
- ✅ Basic functionality tests via MCP inspector
- ✅ Integration tests for critical paths

### Documentation Standards
- ✅ README with setup instructions
- ✅ Tool descriptions in `listTools` response
- ✅ Parameter schemas for all tools

## Server Size Guidelines

| File Count | Tool Count | Status |
|------------|------------|---------|
| 1 file | 1-20 tools | ❌ Monolithic - REFACTOR |
| 2-10 files | 21-50 tools | ⚠️ Transition - Consider refactor |
| 15+ files | 50+ tools | ✅ Modular - MSAS compliant |

## Compliance Checklist

- [ ] Directory structure follows MSAS pattern
- [ ] All tools in separate files
- [ ] Tools organized by functional categories  
- [ ] Client wrapper abstracts blockchain connection
- [ ] Constants centralized in constants.ts
- [ ] Index.ts contains only routing logic
- [ ] TypeScript builds without errors
- [ ] All tools tested and functional
- [ ] Follows MBPS naming conventions
- [ ] README documents architecture

## Benefits of MSAS Compliance

### For Developers
- **Navigation**: Find any tool in seconds
- **Maintenance**: Modify tools without affecting others
- **Testing**: Test individual tools in isolation
- **Collaboration**: Multiple developers can work simultaneously

### For Operations  
- **Scaling**: Add hundreds of tools without complexity
- **Debugging**: Isolate issues to specific components
- **Performance**: Tree-shaking removes unused tools
- **Deployment**: Selective tool deployment possible

### For Users
- **Reliability**: Fewer cascading failures
- **Performance**: Faster load times
- **Discoverability**: Clear tool categorization
- **Consistency**: Predictable tool organization

## Refactoring Success Metrics

**Avalanche Testnet Server (Reference Implementation)**:
- **Before**: 3,226 lines in 1 file
- **After**: 38 tools in 38 files across 12 categories
- **Index.ts**: 225 lines (89% reduction)
- **Build time**: < 5 seconds
- **All tools**: ✅ Functional

## Version History

- **v1.0** (Sep 2025): Initial standard based on Avalanche refactor

---

*This standard is maintained at: github.com/MCP/01-BLOCKCHAIN-MCP-ECOSYSTEM/new-standards/MSAS.md*

**Build modular. Scale infinitely.**