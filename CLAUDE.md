# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repository Is

This is the **Blockchain MCP Standard v3.0 (BMCPS v3.0) (MCP Blockchain Server Standard) Standards Documentation Repository**. It contains the unified architectural and tooling standards for building blockchain MCP servers. This is NOT a server implementation—it's a standards reference and factory tooling system.

## Key Concepts

### Blockchain MCP Standard v3.0 (BMCPS v3.0) Unified Standard
- **Combines** architecture (architecture standard (v1.0)) + tool requirements (tool requirements (v2.1)) into one standard
- **Defines** 25 mandatory tools every blockchain MCP server must implement
- **Enforces** modular architecture with category-based tool organization
- **Specifies** naming convention: `{prefix}_{action}_{resource}` (e.g., `eth_get_balance`)

### The 25 Mandatory Tools
Every compliant server must implement these exact tools (with blockchain-specific prefix):
1. Core (5): `get_chain_info`, `get_balance`, `get_transaction`, `get_block`, `validate_address`
2. Transactions (2): `get_transaction_history`, `send_transaction`
3. Wallet (3): `create_wallet`, `import_wallet`, `generate_address`
4. Network (3): `get_network_info`, `set_network`, `get_gas_price`
5. Fees (2): `estimate_fees`, `get_mempool_info`
6. Account (2): `get_wallet_info`, `get_account_info`
7. Tokens (5): `get_token_balance`, `get_token_info`, `transfer_token`, `approve_token`, `get_token_allowance`
8. Help (3): `help`, `search_tools`, `list_tools_by_category`

### Directory Structure Convention
```
{blockchain}-{network}-mcp-server/
├── src/
│   ├── index.ts              # <300 lines entry point
│   ├── tool-definitions.ts   # Tool registry & schemas
│   ├── client.ts             # Blockchain client wrapper
│   └── tools/                # Tool implementations
│       ├── core/             # Required: blockchain fundamentals
│       ├── wallet/           # Required: wallet operations
│       ├── network/          # Required: network management
│       ├── tokens/           # Required: token operations
│       ├── help/             # Required: help system
│       ├── account/          # Optional: account features
│       ├── nft/              # Optional: NFT operations
│       ├── defi/             # Optional: DeFi protocols
│       └── [others]/         # Optional categories as needed
```

## Essential Commands

### Factory System (Node.js Scripts)
```bash
# Generate new Blockchain MCP Standard v3.0 (BMCPS v3.0) compliant server
node bmcps-factory.js --blockchain eth --network testnet

# Validate server compliance
node bmcps-validation.js /path/to/server

# Testing framework setup
node bmcps-testing-framework.js /path/to/server
```

### Implementation Templates
```bash
# Generate tool implementation stubs
node implementation-templates.js --blockchain eth --tools all
```

## Document Hierarchy (Read in Order)

### For New Server Development
1. **01-Blockchain-MCP-Standard-v3.0-UNIFIED-STANDARD.md** - Read first: Complete spec
2. **03-QUICK-START-GUIDE.md** - Follow Option A: New server from scratch
3. **04-NETWORK-CONFIGURATIONS.md** - Configure RPC endpoints
4. **06-ERROR-HANDLING-PATTERNS.md** - Implement error patterns
5. **07-HELP-SYSTEM-IMPLEMENTATION.md** - Add help tools
6. **05-TESTING-STANDARD.md** - Write tests
7. **08-README-TEMPLATE.md** - Document server

### For Server Migration
1. **01-Blockchain-MCP-Standard-v3.0-UNIFIED-STANDARD.md** - Understand target architecture
2. **03-QUICK-START-GUIDE.md** - Follow Option B: Migration path
3. **06-ERROR-HANDLING-PATTERNS.md** - Refactor error handling
4. **05-TESTING-STANDARD.md** - Add comprehensive tests

### For Troubleshooting
- Jump to **09-TROUBLESHOOTING.md** directly

## Blockchain Prefix Registry

| Blockchain | Prefix | Example Tool |
|------------|--------|--------------|
| Ethereum | `eth_` | `eth_get_balance` |
| Bitcoin | `btc_` | `btc_create_wallet` |
| Solana | `sol_` | `sol_send_transaction` |
| Polygon | `poly_` | `poly_get_gas_price` |
| Avalanche | `avax_` | `avax_estimate_fees` |
| XRP | `xrp_` | `xrp_get_account_info` |
| Cosmos | `cosmos_` | `cosmos_get_validators` |
| Osmosis | `osmo_` | `osmo_get_pools` |
| BNB Chain | `bnb_` | `bnb_swap_tokens` |
| Arbitrum | `arb_` | `arb_get_network_info` |
| Base | `base_` | `base_validate_address` |
| NEAR | `near_` | `near_get_staking_info` |
| Sui | `sui_` | `sui_get_objects` |
| TRON | `tron_` | `tron_get_energy` |
| World Chain | `world_` | `world_verify_world_id` |

## Compliance Levels

### 🥉 Bronze (Minimum Viable)
- ✅ 25 core tools implemented
- ✅ Basic modular structure
- ✅ TypeScript compiles

### 🥈 Silver (Production Ready)
- ✅ All Bronze requirements
- ✅ 40+ tools implemented
- ✅ Full MBSS architecture compliance
- ✅ Comprehensive test suite
- ✅ Complete documentation

### 🥇 Gold (Enterprise Grade)
- ✅ All Silver requirements
- ✅ 100+ tools organized
- ✅ Performance optimized
- ✅ Security audited
- ✅ Production deployed

## Architecture Principles

### Modular Tool Organization
- **One tool per file**: `src/tools/{category}/{prefix}-{tool-name}.ts`
- **Category-based**: Group related tools (`core/`, `wallet/`, `tokens/`, etc.)
- **Shared definitions**: Extract schemas to `tool-definitions.ts`
- **Clean routing**: Keep `index.ts` under 300 lines

### Tool Implementation Pattern
```typescript
import { z } from 'zod';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

// Define input schema
const schema = z.object({
  address: z.string().describe('Wallet address')
});

// Implement handler
export async function handleGetBalance(args: any, client?: BlockchainClient) {
  try {
    const { address } = schema.parse(args);
    const result = await client.getBalance(address);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(ErrorCode.InvalidParams, `Validation error: ${error.message}`);
    }
    throw new McpError(ErrorCode.InternalError, `Operation failed: ${error.message}`);
  }
}
```

### Error Handling Pattern
- **Use McpError** from `@modelcontextprotocol/sdk/types.js`
- **Validate with Zod** before operations
- **Return structured errors** with proper error codes
- **Never expose** private keys or sensitive data in errors

## Reference Implementations

### Example Servers (in parent directories)
- **xrp-testnet-mcp-server/** - 40 tools, Blockchain MCP Standard v3.0 (BMCPS v3.0) compliant
- **avalanche-fuji-mcp-server/** - 25+ tools, Silver tier
- **BLOCKCHAIN-MCP-FACTORY-SERVER/** - Meta-server for generating new servers

## Common Tasks

### Validate a Server
```bash
# Check Blockchain MCP Standard v3.0 (BMCPS v3.0) compliance
node bmcps-validation.js ../xrp-testnet-mcp-server

# Expected output: Architecture, tools, naming, testing scores
```

### Generate New Server
```bash
# Create compliant server structure
node bmcps-factory.js --blockchain eth --network testnet

# Generates complete directory structure + 25 tool stubs
```

### Check Tool Naming
```bash
# Verify tool names follow convention
grep -r "name:" 01-Blockchain-MCP-Standard-v3.0-UNIFIED-STANDARD.md | grep "_"
```

## Important Notes

### What This Repo Is NOT
- ❌ Not a blockchain server implementation
- ❌ Not executable MCP server code
- ❌ Not meant to handle blockchain transactions directly

### What This Repo IS
- ✅ Standards documentation repository
- ✅ Factory tooling for server generation
- ✅ Validation scripts for compliance checking
- ✅ Reference guide for all blockchain MCP servers

## Version History

- **v3.0** (Jan 2025) - Unified MBSS standard (this version)
- **v2.1** (Dec 2024) - MBPS tool requirements
- **v1.0** (Sep 2024) - MSAS architecture standard

## Related Resources

- **02-UNIVERSAL-TOOL-NAMING-REGISTRY.md** - Complete tool naming reference
- **10-CONSOLIDATION-PLAN.md** - Historical context for v3.0 unification
- **RELEASE-NOTES.md** - Changelog for Blockchain MCP Standard v3.0 (BMCPS v3.0)
- **llm.txt** - Quick reference for LLM context

## Working with This Repository

### When Adding New Standards
1. Edit the appropriate numbered document (01-09)
2. Update cross-references in other docs
3. Test changes against reference implementations
4. Update RELEASE-NOTES.md

### When Updating Factory Scripts
1. Modify `bmcps-factory.js` or related scripts
2. Test generation against all blockchain types
3. Validate output with `bmcps-validation.js`
4. Update Quick Start Guide if CLI changes

### Archive Policy
- Old standards → `archive/` directory
- Keep for historical reference only
- Do not use for new development
