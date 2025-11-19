# Blockchain MCP Standard (BMCPS) v3.0
## The Complete Unified Standard for Blockchain MCP Servers

**Version**: 3.0  
**Date**: January 2025  
**Author**: Myron Koch - AI Director & Protocol Architect  
**Status**: ACTIVE UNIFIED STANDARD  
**Supersedes**: tool requirements (v2.1) and architecture standard (v1.0)

---

## Executive Summary

The Blockchain MCP Standard (BMCPS) v3.0 unifies architecture and tool requirements into a single comprehensive standard for all blockchain MCP servers. This standard ensures consistency, scalability, and production readiness across the entire blockchain MCP ecosystem.

## Table of Contents
1. [Core Principles](#core-principles)
2. [Part 1: Architecture Requirements](#part-1-architecture-requirements)
3. [Part 2: Tool Requirements](#part-2-tool-requirements)
4. [Part 3: Implementation Guide](#part-3-implementation-guide)
5. [Part 4: Compliance Verification](#part-4-compliance-verification)
6. [Part 5: Reference Implementations](#part-5-reference-implementations)

---

## Core Principles

### Unified Standard Benefits
- **Single Source of Truth**: One standard for both architecture and functionality
- **Clear Compliance Path**: One checklist covering all requirements
- **Scalability**: Support from 25 to 500+ tools per blockchain
- **Maintainability**: Modular architecture with clear organization
- **Consistency**: Same patterns across all blockchain servers

### Key Requirements Summary
1. **Architecture**: Modular file structure with standardized categories
2. **Tools**: 25 mandatory core tools with specific functionality
3. **Naming**: `{prefix}_{action}_{resource}` convention
4. **Testing**: All tools must be functional via MCP Inspector
5. **Documentation**: Comprehensive README and inline documentation

---

## Part 1: Architecture Requirements

### Mandatory Directory Structure
```
{blockchain}-{network}-mcp-server/
├── src/
│   ├── index.ts                 # Main entry point (<300 lines)
│   ├── tool-definitions.ts      # Tool registry and schemas
│   ├── client.ts                # Blockchain client wrapper (optional)
│   ├── constants.ts             # ABIs, addresses, configs (optional)
│   ├── logger.ts                # Logging configuration (optional)
│   ├── types.ts                 # TypeScript definitions (optional)
│   └── tools/                   # Tool implementations (REQUIRED)
│       ├── core/                # Blockchain fundamentals (REQUIRED)
│       ├── wallet/              # Wallet operations (REQUIRED)
│       ├── network/             # Network management (REQUIRED)
│       ├── tokens/              # Token operations (REQUIRED)
│       ├── help/                # Help system (REQUIRED)
│       ├── account/             # Account management
│       ├── nft/                 # NFT operations
│       ├── defi/                # DeFi protocols
│       ├── staking/             # Staking operations
│       ├── governance/          # Governance operations
│       ├── contracts/           # Smart contract operations
│       ├── bridge/              # Cross-chain bridging
│       ├── analytics/           # Analytics and monitoring
│       ├── security/            # Security and audit tools
│       ├── events/              # Event logs and monitoring
│       └── advanced/            # Advanced/specialized tools
├── dist/                        # Compiled output
├── tests/                       # Test suites
│   ├── smoke.test.ts           # Basic functionality
│   ├── integration/            # Integration tests
│   └── unit/                   # Unit tests
├── scripts/                     # Utility scripts
├── docs/                        # Documentation
├── package.json
├── tsconfig.json
├── jest.config.js              # Test configuration
└── README.md
```

### Category Definitions

#### Required Categories (MUST have)
1. **`core/`** - Blockchain fundamentals (get_balance, get_transaction, etc.)
2. **`wallet/`** - Wallet creation and management
3. **`network/`** - Network information and switching
4. **`tokens/`** - Token operations and queries
5. **`help/`** - Help system tools

#### Optional Categories (as needed)
6. **`account/`** - Extended account operations
7. **`nft/`** - Non-fungible token operations
8. **`defi/`** - DeFi protocol interactions
9. **`staking/`** - Validator and staking operations
10. **`governance/`** - Proposal and voting operations
11. **`contracts/`** - Smart contract interactions
12. **`bridge/`** - Cross-chain bridging operations
13. **`analytics/`** - Analytics and monitoring tools
14. **`security/`** - Security and audit operations
15. **`events/`** - Event logs and monitoring
16. **`advanced/`** - Chain-specific advanced features

### File Naming Convention
```
src/tools/{category}/{prefix}-{action}_{resource}.ts

Examples:
src/tools/core/xrp-get_balance.ts
src/tools/tokens/xrp-transfer_token.ts
src/tools/nft/xrp-mint_nft.ts
```

### Tool Implementation Template
```typescript
import { z } from 'zod';
import { Client } from 'xrpl'; // or appropriate client
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

// Input validation schema
const schema = z.object({
  address: z.string().describe('Wallet address'),
  // ... other parameters
});

// Tool handler function
export async function handle{Action}{Resource}(
  args: any,
  client?: Client // optional client parameter
): Promise<{ content: Array<{ type: string; text: string }> }> {
  try {
    // Validate inputs
    const parsed = schema.parse(args);
    
    // Perform operation
    const result = await performOperation(parsed);
    
    // Return formatted response
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Invalid parameters: ${error.errors.map(e => e.message).join(', ')}`
      );
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
```

---

## Part 2: Tool Requirements

### 25 Mandatory Core Tools

Every blockchain MCP server MUST implement these exact 25 tools:

#### Blockchain Operations (5 tools)
1. **`{prefix}_get_chain_info`** - Comprehensive blockchain information
2. **`{prefix}_get_balance`** - Native token balance for address
3. **`{prefix}_get_transaction`** - Transaction details by hash
4. **`{prefix}_get_block`** - Block information by number/hash
5. **`{prefix}_validate_address`** - Address format validation

#### Transaction Operations (2 tools)
6. **`{prefix}_get_transaction_history`** - Recent transactions for address
7. **`{prefix}_send_transaction`** - Send native tokens

#### Wallet Management (3 tools)
8. **`{prefix}_create_wallet`** - Generate new wallet
9. **`{prefix}_import_wallet`** - Import from private key/mnemonic
10. **`{prefix}_generate_address`** - Generate new address formats

#### Network Management (3 tools)
11. **`{prefix}_get_network_info`** - Network status and config
12. **`{prefix}_set_network`** - Switch between networks
13. **`{prefix}_get_gas_price`** - Current gas/fee pricing

#### Fee Management (2 tools)
14. **`{prefix}_estimate_fees`** - Fee estimation for transactions
15. **`{prefix}_get_mempool_info`** - Mempool statistics

#### Account Information (2 tools)
16. **`{prefix}_get_wallet_info`** - Comprehensive wallet details
17. **`{prefix}_get_account_info`** - Account metadata and status

#### Token Operations (5 tools)
18. **`{prefix}_get_token_balance`** - Token balance queries
19. **`{prefix}_get_token_info`** - Token metadata
20. **`{prefix}_transfer_token`** - Send tokens
21. **`{prefix}_approve_token`** - Approve token spending
22. **`{prefix}_get_token_allowance`** - Check spending allowances

#### Help System (3 tools)
23. **`{prefix}_help`** - Interactive help and guidance
24. **`{prefix}_search_tools`** - Search tools by keyword
25. **`{prefix}_list_tools_by_category`** - Browse organized catalog

### Tool Naming Convention
```
{prefix}_{action}_{resource}

Where:
- prefix: Blockchain identifier (eth, btc, sol, xrp, etc.)
- action: Operation verb (get, send, create, validate, etc.)
- resource: Target object (balance, transaction, wallet, etc.)

Examples:
✅ eth_get_balance
✅ btc_create_wallet
✅ sol_send_transaction
❌ getBalance         (wrong format)
❌ ETH_GET_BALANCE    (wrong case)
```

### Extended Tools (Optional)

Servers may implement additional tools based on blockchain capabilities:

#### DeFi Operations
- `{prefix}_swap_tokens`
- `{prefix}_add_liquidity`
- `{prefix}_remove_liquidity`
- `{prefix}_get_pool_info`

#### NFT Operations
- `{prefix}_mint_nft`
- `{prefix}_transfer_nft`
- `{prefix}_get_nft_metadata`
- `{prefix}_create_nft_collection`

#### Staking Operations
- `{prefix}_stake_tokens`
- `{prefix}_unstake_tokens`
- `{prefix}_get_staking_rewards`
- `{prefix}_get_validators`

#### Cross-Chain Bridge Operations
- `{prefix}_bridge_tokens` - Bridge tokens to another chain
- `{prefix}_get_bridge_info` - Bridge status and supported chains
- `{prefix}_estimate_bridge_fees` - Bridge fee estimation
- `{prefix}_get_bridge_history` - Bridge transaction history

#### Analytics & Monitoring
- `{prefix}_get_analytics` - Network and account analytics
- `{prefix}_get_performance_metrics` - Performance statistics
- `{prefix}_monitor_transaction` - Transaction monitoring
- `{prefix}_get_usage_stats` - Usage statistics and patterns

#### Security & Audit
- `{prefix}_audit_transaction` - Transaction security audit
- `{prefix}_validate_security` - Security validation checks
- `{prefix}_get_security_status` - Security status and alerts
- `{prefix}_check_compliance` - Regulatory compliance checks

#### Events & Logs
- `{prefix}_get_events` - Blockchain event logs
- `{prefix}_subscribe_events` - Event subscription
- `{prefix}_get_logs` - Transaction and contract logs
- `{prefix}_search_logs` - Log search and filtering

---

## Part 3: Implementation Guide

### Step 1: Initialize Project
```bash
# Create project structure
mkdir {blockchain}-{network}-mcp-server
cd {blockchain}-{network}-mcp-server
npm init -y

# Install dependencies
npm install @modelcontextprotocol/sdk zod
npm install -D typescript @types/node jest @types/jest ts-jest

# Create directory structure
mkdir -p src/tools/{core,wallet,network,tokens,help,account,nft,defi,staking,governance,contracts,bridge,analytics,security,events,advanced}
mkdir -p tests/{unit,integration} scripts docs
```

### Step 2: Configure TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Step 3: Create Main Index File
```typescript
// src/index.ts
#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode
} from '@modelcontextprotocol/sdk/types.js';

// Import tool definitions
import { TOOL_DEFINITIONS } from './tool-definitions.js';

// Import tool handlers (organized by category)
// Core tools
import { handleGetChainInfo } from './tools/core/{prefix}-get_chain_info.js';
import { handleGetBalance } from './tools/core/{prefix}-get_balance.js';
// ... import all 25+ tools

// Initialize server
const server = new Server(
  {
    name: '{blockchain}-{network}-mcp-server',
    version: '3.0.0', // Blockchain MCP Standard v3.0 (BMCPS v3.0) compliant
  },
  {
    capabilities: { tools: {} },
  }
);

// Register tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOL_DEFINITIONS };
});

// Route tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      // Core tools
      case '{prefix}_get_chain_info':
        return await handleGetChainInfo(args);
      case '{prefix}_get_balance':
        return await handleGetBalance(args);
      // ... handle all tools
      
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) throw error;
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error}`
    );
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[Blockchain MCP Standard v3.0 (BMCPS v3.0)] {Blockchain} MCP Server running');
  console.error(`[Blockchain MCP Standard v3.0 (BMCPS v3.0)] Total tools: ${TOOL_DEFINITIONS.length}`);
}

main().catch(console.error);
```

### Step 4: Implement Core Tools

Start with the 25 mandatory tools, one file per tool:

```typescript
// src/tools/core/{prefix}-get_balance.ts
import { z } from 'zod';

const schema = z.object({
  address: z.string().describe('Wallet address to check balance')
});

export async function handleGetBalance(args: any) {
  const { address } = schema.parse(args);
  
  // Implementation here
  const balance = await fetchBalance(address);
  
  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        address,
        balance: balance.formatted,
        balanceRaw: balance.raw,
        symbol: 'ETH' // or appropriate symbol
      }, null, 2)
    }]
  };
}
```

---

## Part 4: Compliance Verification

### Blockchain MCP Standard v3.0 (BMCPS v3.0) Compliance Checklist

#### Architecture Requirements ✓
- [ ] Project follows mandatory directory structure
- [ ] Tools organized in category folders
- [ ] One tool per file pattern
- [ ] Index.ts under 300 lines
- [ ] Tool definitions in separate file

#### Tool Requirements ✓
- [ ] All 25 mandatory core tools implemented
- [ ] Tool naming follows `{prefix}_{action}_{resource}`
- [ ] All tools have proper input schemas
- [ ] Help system fully functional
- [ ] Network switching capability

#### Code Quality ✓
- [ ] TypeScript compiles without errors
- [ ] Zod validation on all inputs
- [ ] Comprehensive error handling
- [ ] Consistent response format
- [ ] No private keys in code

#### Testing Requirements ✓
- [ ] All tools testable via MCP Inspector
- [ ] Smoke tests pass
- [ ] Integration tests for core tools
- [ ] README with setup instructions
- [ ] CHANGELOG maintained

### Compliance Levels

#### 🥉 Blockchain MCP Standard v3.0 (BMCPS v3.0) Bronze
- ✅ 25 core tools implemented
- ✅ Basic modular structure
- ✅ TypeScript compilation works

#### 🥈 Blockchain MCP Standard v3.0 (BMCPS v3.0) Silver
- ✅ All Bronze requirements
- ✅ Full BMCPS v3.0 architecture compliance
- ✅ Extended tools (40+ total)
- ✅ Comprehensive testing suite
- ✅ Documentation complete

#### 🥇 Blockchain MCP Standard v3.0 (BMCPS v3.0) Gold
- ✅ All Silver requirements
- ✅ 100+ tools organized
- ✅ Performance optimized
- ✅ Security audited
- ✅ Production deployed

### Verification Commands
```bash
# Check compilation
npm run build

# Test all tools
npm run test

# Verify with MCP Inspector
npm run inspect

# Check compliance
npm run mbss-check  # Custom script to verify standards
```

---

## Part 5: Reference Implementations

### Gold Standard Examples

#### Production Ready (Gold)
- **Osmosis Mainnet**: 119 tools, full modular architecture
- **XRP Testnet**: 40 tools, clean BMCPS v3.0 structure

#### Silver Standard
- **Polygon Testnet**: 29 tools, BMCPS v3.0 compliant
- **Avalanche Testnet**: 25 tools, reference architecture

### Migration Examples

#### From Monolithic (Before)
```typescript
// Everything in one massive index.ts file
switch (toolName) {
  case 'get_balance': // 3000+ lines of cases
    // implementation inline
  case 'send_transaction':
    // implementation inline
  // ... 100+ more cases
}
```

#### To Modular Blockchain MCP Standard v3.0 (BMCPS v3.0) (After)
```typescript
// Clean index.ts with imports
import { handleGetBalance } from './tools/core/eth-get_balance.js';

switch (toolName) {
  case 'eth_get_balance':
    return await handleGetBalance(args);
  // ... clean routing only
}
```

---

## Appendix A: Chain Prefix Registry

| Blockchain | Prefix | Example Tool |
|------------|---------|--------------|
| Ethereum | `eth_` | eth_get_balance |
| Bitcoin | `btc_` | btc_get_transaction |
| Solana | `sol_` | sol_create_wallet |
| Polygon | `poly_` | poly_get_gas_price |
| Avalanche | `avax_` | avax_get_validators |
| Arbitrum | `arb_` | arb_estimate_fees |
| Base | `base_` | base_get_network_info |
| BNB Chain | `bnb_` | bnb_swap_tokens |
| XRP | `xrp_` | xrp_get_escrows |
| NEAR | `near_` | near_get_staking_info |
| Sui | `sui_` | sui_get_objects |
| TRON | `tron_` | tron_get_energy |
| Cosmos | `cosmos_` | cosmos_get_proposals |
| Osmosis | `osmo_` | osmo_get_pools |
| World Chain | `world_` | world_verify_world_id |

---

## Appendix B: Tool Categories Quick Reference

### Always Required
- `core/` - Blockchain fundamentals
- `wallet/` - Wallet management  
- `network/` - Network operations
- `tokens/` - Token operations
- `help/` - Help system

### Common Extensions
- `account/` - Extended account features
- `nft/` - NFT operations
- `defi/` - DeFi protocols
- `staking/` - Staking operations
- `contracts/` - Smart contract interactions
- `bridge/` - Cross-chain bridging operations
- `analytics/` - Analytics and monitoring tools
- `security/` - Security and audit operations
- `events/` - Event logs and monitoring

### Chain-Specific
- `governance/` - DAO/governance (Cosmos, etc.)
- `validators/` - Validator info (PoS chains)
- `programs/` - Programs (Solana)
- `inscriptions/` - Inscriptions (Bitcoin)
- `ibc/` - IBC operations (Cosmos)

---

## Appendix C: Migration Timeline

### Immediate (Now)
- All new servers must follow Blockchain MCP Standard v3.0 (BMCPS v3.0)
- Existing servers should plan migration

### Q1 2025
- All testnet servers Blockchain MCP Standard v3.0 (BMCPS v3.0) compliant
- Migration scripts available

### Q2 2025
- All mainnet servers Blockchain MCP Standard v3.0 (BMCPS v3.0) compliant
- Deprecate tool requirements (v2.1) and architecture standard (v1.0)

### Q3 2025
- BMCPS v3.1 with advanced features
- Cross-chain standards

---

## Version History

- **v3.0** (Jan 2025): Unified tool requirements (v2.1) + architecture standard (v1.0)
- **v2.1** (Dec 2024): MBPS tool requirements
- **v1.0** (Sep 2024): MSAS architecture standard

---

*This unified standard supersedes all previous standards.*

**One Standard. Complete Compliance. Production Ready.**

**Maintained at**: `/servers/testnet/NEW STANDARDS/Blockchain-MCP-Standard-v3.0-UNIFIED-STANDARD.md`