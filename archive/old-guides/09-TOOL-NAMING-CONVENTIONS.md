# Tool Naming Conventions for Blockchain MCP Servers

## Overview
Standardized tool naming ensures consistency, discoverability, and prevents conflicts across the MCP ecosystem. All tools MUST follow these naming conventions.

## Core Naming Pattern

### Format: `{prefix}_{action}_{resource}`

- **prefix**: Chain/network identifier (3-5 characters)
- **action**: Verb describing the operation
- **resource**: Noun describing what is being acted upon

### Examples
- `eth_get_balance` - Ethereum, get action, balance resource
- `sol_create_wallet` - Solana, create action, wallet resource
- `btc_validate_address` - Bitcoin, validate action, address resource

## Prefix Standards

### Mainnet Prefixes
| Blockchain | Prefix | Example |
|------------|--------|---------|
| Ethereum | `eth_` | `eth_get_transaction` |
| Bitcoin | `btc_` | `btc_get_block` |
| Solana | `sol_` | `sol_get_balance` |
| Polygon | `poly_` | `poly_get_chain_info` |
| Cosmos Hub | `cosmos_` | `cosmos_get_validators` |
| Osmosis | `osmo_` | `osmo_get_pools` |
| Arbitrum | `arb_` | `arb_get_gas_price` |
| Avalanche | `avax_` | `avax_get_subnet_info` |
| BNB Chain | `bnb_` | `bnb_get_token_balance` |
| Base | `base_` | `base_get_network_info` |
| Near | `near_` | `near_get_account` |
| Sui | `sui_` | `sui_get_object` |
| Tron | `tron_` | `tron_get_account` |
| XRP | `xrp_` | `xrp_get_ledger` |
| World Chain | `world_` | `world_get_identity` |

### Special Cases
- Use same prefix for testnet and mainnet
- Add network switching via parameters, not prefix changes

## Action Verbs

### Standard Actions (MBPS v2.1 Required)
| Action | Usage | Example |
|--------|-------|---------|
| `get` | Retrieve data | `get_balance`, `get_block` |
| `create` | Generate new items | `create_wallet`, `create_token` |
| `send` | Transfer assets | `send_transaction`, `send_token` |
| `validate` | Verify correctness | `validate_address`, `validate_signature` |
| `list` | Return multiple items | `list_tools_by_category`, `list_transactions` |
| `search` | Find specific items | `search_tools`, `search_blocks` |
| `help` | Provide assistance | `help` (standalone) |

### Extended Actions
| Action | Usage | Example |
|--------|-------|---------|
| `estimate` | Calculate predictions | `estimate_gas`, `estimate_fee` |
| `sign` | Cryptographic signing | `sign_message`, `sign_transaction` |
| `verify` | Check authenticity | `verify_signature`, `verify_proof` |
| `deploy` | Deploy contracts | `deploy_contract`, `deploy_token` |
| `mint` | Create tokens/NFTs | `mint_token`, `mint_nft` |
| `burn` | Destroy tokens | `burn_token`, `burn_nft` |
| `stake` | Lock for rewards | `stake_tokens`, `stake_validator` |
| `delegate` | Assign voting power | `delegate_tokens`, `delegate_votes` |
| `swap` | Exchange assets | `swap_tokens`, `swap_exact` |
| `bridge` | Cross-chain transfer | `bridge_tokens`, `bridge_to_mainnet` |

## Resource Nouns

### Core Resources (MBPS v2.1)
- `chain_info` - Network information
- `balance` - Account balance
- `transaction` - Transaction data
- `block` - Block information
- `address` - Address validation
- `transaction_history` - Historical transactions
- `wallet` - Wallet operations
- `tools` - Tool discovery

### Common Resources
- `account` - Account information
- `token` - Token operations
- `gas` / `fee` - Transaction costs
- `contract` - Smart contracts
- `validator` - Network validators
- `pool` - Liquidity pools
- `proposal` - Governance proposals
- `delegation` - Staking delegations

## Special Naming Rules

### 1. Compound Resources
Use underscores for multi-word resources:
- ✅ `get_transaction_history`
- ✅ `get_token_balance`
- ❌ `get_transactionHistory`
- ❌ `get_token-balance`

### 2. Abbreviations
Avoid abbreviations except well-known ones:
- ✅ `nft` (Non-Fungible Token)
- ✅ `dex` (Decentralized Exchange)
- ❌ `tx` (use `transaction`)
- ❌ `addr` (use `address`)

### 3. Parameter vs Tool Names
Tool names should be generic; use parameters for specifics:
- ✅ Tool: `get_balance`, Parameter: `token_address`
- ❌ Tool: `get_usdc_balance`

### 4. Network-Specific Features
Include chain name for unique features:
- `sol_get_program_accounts` (Solana-specific)
- `eth_get_logs` (Ethereum-specific)
- `osmo_get_superfluid_positions` (Osmosis-specific)

## Validation Rules

### Tool Name Validation Regex
```typescript
const VALID_TOOL_NAME = /^[a-z]+_[a-z]+(_[a-z]+)*$/;

// Examples
VALID_TOOL_NAME.test('eth_get_balance');           // ✅ true
VALID_TOOL_NAME.test('eth_get_transaction_history'); // ✅ true
VALID_TOOL_NAME.test('ETH_GET_BALANCE');           // ❌ false (uppercase)
VALID_TOOL_NAME.test('eth-get-balance');           // ❌ false (hyphens)
VALID_TOOL_NAME.test('ethGetBalance');             // ❌ false (camelCase)
```

## Migration Guide

### Converting Existing Tools
1. **Identify non-compliant names**:
   ```typescript
   // Old format
   'getBalance'
   'GetTransaction'
   'fetch-block'
   
   // New format
   'eth_get_balance'
   'eth_get_transaction'
   'eth_get_block'
   ```

2. **Update tool definitions**:
   ```typescript
   // Before
   { name: 'getBalance', ... }
   
   // After
   { name: 'eth_get_balance', ... }
   ```

3. **Maintain backward compatibility** (optional):
   ```typescript
   // Alias old names during transition
   const aliases = {
     'getBalance': 'eth_get_balance',
     // ... other mappings
   };
   ```

## Examples by Category

### MBPS v2.1 Core Tools
```
eth_get_chain_info
eth_get_balance
eth_get_transaction
eth_get_block
eth_validate_address
eth_get_transaction_history
eth_create_wallet
eth_help
eth_search_tools
eth_list_tools_by_category
eth_send_transaction
eth_get_network_info
eth_set_network
eth_get_gas_price
eth_get_mempool_info
eth_estimate_fees
eth_import_wallet
eth_get_wallet_info
eth_get_account_info
eth_generate_address
eth_get_token_balance
eth_get_token_info
eth_transfer_token
eth_approve_token
eth_get_token_allowance
```

### Token Operations
```
eth_get_token_balance
eth_send_token
eth_approve_token
eth_get_token_info
eth_create_token
eth_mint_token
eth_burn_token
```

### DeFi Operations
```
eth_swap_tokens
eth_add_liquidity
eth_remove_liquidity
eth_stake_tokens
eth_claim_rewards
```

## Enforcement

### Automated Validation
All PRs must pass tool naming validation:

```typescript
function validateToolName(name: string): boolean {
  const pattern = /^[a-z]+_[a-z]+(_[a-z]+)*$/;
  const validPrefixes = ['eth', 'btc', 'sol', 'poly', 'cosmos', ...];
  const validActions = ['get', 'create', 'send', 'validate', ...];
  
  if (!pattern.test(name)) return false;
  
  const [prefix, action] = name.split('_');
  return validPrefixes.includes(prefix) && validActions.includes(action);
}
```

### CI/CD Integration
```yaml
# .github/workflows/validate-tools.yml
- name: Validate Tool Names
  run: npm run validate:tool-names
```

## References

- MBPS v2.1 Comprehensive: ./MBPS-v2.1-COMPREHENSIVE.md
- Migration Requirements: ./MIGRATION-REQUIREMENTS.md
- Testing Standards: ./TESTING-STANDARDIZATION-INSTRUCTIONS.md

---

**Last Updated**: September 2024
**Version**: 1.0.0
**Status**: Active Standard
**Enforcement**: Required for all new servers