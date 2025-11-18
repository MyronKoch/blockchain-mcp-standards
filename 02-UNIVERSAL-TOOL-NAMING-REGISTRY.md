# Universal Tool Naming Registry v1.0
## Comprehensive Cross-Blockchain Tool Naming Standard

**Created**: January 24, 2025  
**Version**: 1.0  
**Standard**: Blockchain MCP Standard v3.0 (BMCPS v3.0) Compliant  
**Scope**: All blockchain MCP servers in ecosystem  

---

## 🎯 Purpose

This registry standardizes tool naming across ALL blockchain MCP servers to ensure:
- **Consistency** - Same functionality = same name across all chains
- **Predictability** - Developers know what `{prefix}_get_balance` does everywhere
- **Scalability** - Easy to add new blockchains following patterns
- **Automation** - Factory system can auto-generate tool names

---

## 📋 Naming Convention

**Format**: `{prefix}_{action}_{resource}`

Where:
- **prefix**: Blockchain identifier (eth, btc, sol, ada, etc.)
- **action**: Operation verb (get, send, create, validate, etc.)  
- **resource**: Target object (balance, transaction, wallet, etc.)

---

## 🏗️ Core Categories (Required for ALL chains)

### **Category: core/** (Blockchain Fundamentals)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_get_chain_info` | Network status and metrics | Chain metadata | ✅ |
| `{prefix}_get_balance` | Native token balance | Balance data | ✅ |
| `{prefix}_get_transaction` | Transaction details by hash | Transaction data | ✅ |
| `{prefix}_get_block` | Block information | Block data | ✅ |
| `{prefix}_validate_address` | Address format validation | Boolean + details | ✅ |
| `{prefix}_get_transaction_history` | Recent transactions | Transaction list | ✅ |
| `{prefix}_send_transaction` | Send native tokens | Transaction hash | ✅ |
| `{prefix}_get_account_info` | Account metadata | Account details | ✅ |

### **Category: wallet/** (Wallet Management)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_create_wallet` | Generate new wallet | Wallet data | ✅ |
| `{prefix}_import_wallet` | Import from key/mnemonic | Wallet data | ✅ |
| `{prefix}_generate_address` | Create new addresses | Address data | ✅ |
| `{prefix}_get_wallet_info` | Wallet details | Wallet metadata | ✅ |
| `{prefix}_derive_wallet` | HD wallet derivation | Derived wallet | Optional |
| `{prefix}_sign_message` | Message signing | Signature | Optional |
| `{prefix}_verify_signature` | Signature verification | Boolean | Optional |

### **Category: network/** (Network Operations)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_get_network_info` | Network configuration | Network data | ✅ |
| `{prefix}_set_network` | Switch networks | Confirmation | ✅ |
| `{prefix}_get_gas_price` | Current gas/fee pricing | Price data | ✅ |
| `{prefix}_estimate_fees` | Fee estimation | Fee estimates | ✅ |
| `{prefix}_get_mempool_info` | Mempool statistics | Mempool data | ✅ |
| `{prefix}_get_node_info` | Node status | Node metadata | Optional |
| `{prefix}_get_peers` | Network peers | Peer list | Optional |

### **Category: tokens/** (Token Operations)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_get_token_balance` | Token balance queries | Token balance | ✅ |
| `{prefix}_get_token_info` | Token metadata | Token details | ✅ |
| `{prefix}_transfer_token` | Send tokens | Transaction hash | ✅ |
| `{prefix}_approve_token` | Approve spending | Transaction hash | ✅ |
| `{prefix}_get_token_allowance` | Check allowances | Allowance data | ✅ |
| `{prefix}_get_token_supply` | Total/circulating supply | Supply data | Optional |
| `{prefix}_get_token_holders` | Token holder list | Address list | Optional |
| `{prefix}_get_token_transfers` | Token transfer history | Transfer list | Optional |

### **Category: help/** (Help System)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_help` | Interactive help | Help content | ✅ |
| `{prefix}_search_tools` | Search by keyword | Tool list | ✅ |
| `{prefix}_list_tools_by_category` | Browse catalog | Organized tools | ✅ |

---

## 🔧 Extended Categories (Optional but Standardized)

### **Category: contracts/** (Smart Contracts)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_deploy_contract` | Deploy contract | Contract address | Optional |
| `{prefix}_call_contract` | Execute contract function | Function result | Optional |
| `{prefix}_get_contract_info` | Contract metadata | Contract details | Optional |
| `{prefix}_get_contract_code` | Contract bytecode | Code data | Optional |
| `{prefix}_get_logs` | Event logs | Log entries | Optional |
| `{prefix}_estimate_contract_gas` | Gas estimation | Gas estimate | Optional |

### **Category: nft/** (Non-Fungible Tokens)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_mint_nft` | Create NFT | Token ID | Optional |
| `{prefix}_get_nft_info` | NFT metadata | NFT details | Optional |
| `{prefix}_transfer_nft` | Transfer NFT | Transaction hash | Optional |
| `{prefix}_get_nft_owner` | Owner lookup | Owner address | Optional |
| `{prefix}_get_nft_collection` | Collection info | Collection data | Optional |
| `{prefix}_approve_nft` | Approve transfer | Transaction hash | Optional |
| `{prefix}_get_nft_approvals` | Check approvals | Approval list | Optional |

### **Category: defi/** (Decentralized Finance)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_swap_tokens` | Token swaps | Swap result | Optional |
| `{prefix}_add_liquidity` | Add to pools | LP tokens | Optional |
| `{prefix}_remove_liquidity` | Remove from pools | Tokens | Optional |
| `{prefix}_get_pool_info` | Pool details | Pool data | Optional |
| `{prefix}_get_price` | Token prices | Price data | Optional |
| `{prefix}_get_reserves` | Pool reserves | Reserve data | Optional |
| `{prefix}_calculate_slippage` | Slippage calculation | Slippage data | Optional |

### **Category: staking/** (Staking Operations)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_stake_tokens` | Stake tokens | Staking receipt | Optional |
| `{prefix}_unstake_tokens` | Unstake tokens | Unstaking receipt | Optional |
| `{prefix}_get_staking_rewards` | Rewards info | Reward data | Optional |
| `{prefix}_claim_rewards` | Claim rewards | Transaction hash | Optional |
| `{prefix}_get_validators` | Validator list | Validator data | Optional |
| `{prefix}_get_delegations` | Delegation info | Delegation data | Optional |
| `{prefix}_redelegate` | Change validator | Transaction hash | Optional |

### **Category: governance/** (DAO/Governance)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_get_proposals` | Proposal list | Proposals | Optional |
| `{prefix}_vote_proposal` | Cast vote | Vote receipt | Optional |
| `{prefix}_create_proposal` | Submit proposal | Proposal ID | Optional |
| `{prefix}_get_votes` | Vote history | Vote data | Optional |
| `{prefix}_get_governance_info` | Governance stats | Gov metadata | Optional |



### **Category: bridge/** (Cross-Chain Operations)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_bridge_tokens` | Bridge tokens to another chain | Transaction hash | Optional |
| `{prefix}_get_bridge_info` | Bridge status and supported chains | Bridge data | Optional |
| `{prefix}_estimate_bridge_fees` | Bridge fee estimation | Fee estimates | Optional |
| `{prefix}_get_bridge_history` | Bridge transaction history | Transaction list | Optional |

### **Category: analytics/** (Analytics & Monitoring)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_get_analytics` | Network and account analytics | Analytics data | Optional |
| `{prefix}_get_performance_metrics` | Performance statistics | Metrics data | Optional |
| `{prefix}_monitor_transaction` | Transaction monitoring | Monitoring status | Optional |
| `{prefix}_get_usage_stats` | Usage statistics and patterns | Usage data | Optional |

### **Category: security/** (Security & Audit)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_audit_transaction` | Transaction security audit | Audit report | Optional |
| `{prefix}_validate_security` | Security validation checks | Validation status | Optional |
| `{prefix}_get_security_status` | Security status and alerts | Security data | Optional |
| `{prefix}_check_compliance` | Regulatory compliance checks | Compliance report | Optional |

### **Category: events/** (Event Logs)

| Tool Name | Purpose | Returns | Required |
|-----------|---------|---------|----------|
| `{prefix}_get_events` | Blockchain event logs | Event data | Optional |
| `{prefix}_subscribe_events` | Event subscription | Subscription status | Optional |
| `{prefix}_get_logs` | Transaction and contract logs | Log entries | Optional |
| `{prefix}_search_logs` | Log search and filtering | Filtered logs | Optional |
|

---

## 🔗 Chain-Specific Extensions

### **Bitcoin-Specific** (`btc_` prefix)

| Category | Tool Name | Purpose |
|----------|-----------|---------|
| **inscriptions/** | `btc_create_inscription` | Create Ordinals inscription |
| **inscriptions/** | `btc_get_inscription_info` | Inscription metadata |
| **runes/** | `btc_mint_rune` | Mint Rune token |
| **runes/** | `btc_transfer_rune` | Transfer Rune |
| **psbt/** | `btc_create_psbt` | Create PSBT |
| **psbt/** | `btc_sign_psbt` | Sign PSBT |

### **Ethereum-Specific** (`eth_` prefix)

| Category | Tool Name | Purpose |
|----------|-----------|---------|
| **ens/** | `eth_resolve_ens` | Resolve ENS name |
| **ens/** | `eth_reverse_ens` | Reverse ENS lookup |
| **eip/** | `eth_estimate_eip1559_fees` | EIP-1559 gas estimation |
| **layer2/** | `eth_get_l2_bridge_info` | Layer 2 bridge data |

### **Solana-Specific** (`sol_` prefix)

| Category | Tool Name | Purpose |
|----------|-----------|---------|
| **programs/** | `sol_get_program_accounts` | Program account data |
| **programs/** | `sol_deploy_program` | Deploy Solana program |
| **spl/** | `sol_create_spl_token` | Create SPL token |
| **spl/** | `sol_mint_spl_token` | Mint SPL tokens |

### **Cosmos-Specific** (`cosmos_` prefix)

| Category | Tool Name | Purpose |
|----------|-----------|---------|
| **ibc/** | `cosmos_ibc_transfer` | IBC token transfer |
| **ibc/** | `cosmos_get_ibc_channels` | IBC channel info |
| **authz/** | `cosmos_grant_authorization` | Grant permissions |
| **feegrant/** | `cosmos_grant_fee_allowance` | Fee allowances |

---

## 📊 Action Verb Registry

### **Query Operations** (Read-only)
- `get_` - Retrieve data (most common)
- `list_` - Get multiple items
- `search_` - Find by criteria
- `check_` - Verify status
- `validate_` - Format validation
- `resolve_` - Name resolution
- `calculate_` - Computations

### **Transaction Operations** (Write)
- `send_` - Transfer native tokens
- `transfer_` - Move tokens/assets
- `create_` - Generate new items
- `deploy_` - Deploy contracts
- `mint_` - Create tokens/NFTs
- `burn_` - Destroy tokens
- `approve_` - Grant permissions
- `revoke_` - Remove permissions

### **Management Operations**
- `import_` - Import existing items
- `export_` - Export data
- `generate_` - Create new items
- `derive_` - HD derivation
- `sign_` - Cryptographic signing
- `verify_` - Signature verification

### **Protocol Operations**
- `stake_` - Staking operations
- `unstake_` - Unstaking operations
- `delegate_` - Delegate to validator
- `vote_` - Governance voting
- `claim_` - Claim rewards
- `swap_` - Token swaps

---

## 🏷️ Resource Object Registry

### **Core Objects**
- `balance` - Token balances
- `transaction` - Transaction data
- `block` - Block information
- `address` - Address operations
- `wallet` - Wallet management
- `account` - Account metadata
- `chain_info` - Blockchain data
- `network_info` - Network config

### **Token Objects**
- `token` - Generic tokens
- `token_balance` - Token balances
- `token_info` - Token metadata
- `token_allowance` - Spending permissions
- `token_supply` - Supply information
- `spl_token` - Solana SPL tokens
- `bep20_token` - BSC tokens

### **Contract Objects**
- `contract` - Smart contracts
- `logs` - Event logs
- `receipt` - Transaction receipts
- `bytecode` - Contract code
- `abi` - Contract interface

### **DeFi Objects**
- `pool` - Liquidity pools
- `reserves` - Pool reserves  
- `price` - Token prices
- `liquidity` - Pool liquidity
- `slippage` - Price impact

### **NFT Objects**
- `nft` - Non-fungible tokens
- `collection` - NFT collections
- `metadata` - NFT metadata
- `owner` - NFT ownership
- `approvals` - NFT permissions

---

## 🔍 Prefix Registry

### Official BMCPS v3.0 Supported Blockchains

| Blockchain | Prefix | Example Tools |
|------------|--------|---------------|
| **Bitcoin** | `btc_` | `btc_get_balance`, `btc_create_inscription` |
| **Ethereum** | `eth_` | `eth_get_balance`, `eth_resolve_ens` |
| **Solana** | `sol_` | `sol_get_balance`, `sol_create_spl_token` |
| **BNB Chain** | `bnb_` | `bnb_get_balance`, `bnb_swap_tokens` |
| **Polygon** | `poly_` | `poly_get_balance`, `poly_bridge_tokens` |
| **Avalanche** | `avax_` | `avax_get_balance`, `avax_create_subnet` |
| **Arbitrum** | `arb_` | `arb_get_balance`, `arb_get_l2_info` |
| **Base** | `base_` | `base_get_balance`, `base_bridge_eth` |
| **Cosmos** | `cosmos_` | `cosmos_get_balance`, `cosmos_ibc_transfer` |
| **Osmosis** | `osmo_` | `osmo_get_balance`, `osmo_swap_tokens` |
| **NEAR** | `near_` | `near_get_balance`, `near_create_account` |
| **Sui** | `sui_` | `sui_get_balance`, `sui_get_objects` |
| **TRON** | `tron_` | `tron_get_balance`, `tron_freeze_tokens` |
| **XRP** | `xrp_` | `xrp_get_balance`, `xrp_create_escrow` |
| **World Chain** | `world_` | `world_get_balance`, `world_verify_world_id` |

### Proposed Future Support

| Blockchain | Prefix | Status |
|------------|--------|--------|
| **Cardano** | `ada_` | Proposed - Not yet implemented |
| **Polkadot** | `dot_` | Proposed - Not yet implemented |
| **Chainlink** | `link_` | Proposed - Not yet implemented |
| **Stellar** | `xlm_` | Proposed - Not yet implemented |
| **Flow** | `flow_` | Proposed - Not yet implemented |
| **Aptos** | `apt_` | Proposed - Not yet implemented |

---

## ✅ Compliance Requirements

### **Blockchain MCP Standard v3.0 (BMCPS v3.0) Mandatory** (25 tools minimum)
Every blockchain server MUST implement these exact tool names:

1. `{prefix}_get_chain_info`
2. `{prefix}_get_balance` 
3. `{prefix}_get_transaction`
4. `{prefix}_get_block`
5. `{prefix}_validate_address`
6. `{prefix}_get_transaction_history`
7. `{prefix}_send_transaction`
8. `{prefix}_create_wallet`
9. `{prefix}_import_wallet`
10. `{prefix}_generate_address`
11. `{prefix}_get_network_info`
12. `{prefix}_set_network`
13. `{prefix}_get_gas_price`
14. `{prefix}_estimate_fees`
15. `{prefix}_get_mempool_info`
16. `{prefix}_get_wallet_info`
17. `{prefix}_get_account_info`
18. `{prefix}_get_token_balance`
19. `{prefix}_get_token_info`
20. `{prefix}_transfer_token`
21. `{prefix}_approve_token`
22. `{prefix}_get_token_allowance`
23. `{prefix}_help`
24. `{prefix}_search_tools`
25. `{prefix}_list_tools_by_category`

### **Extended Tools** (Optional but standardized)
Use this registry for consistency when implementing additional tools beyond the 25 required.

---

## 🚀 Factory System Integration

This registry enables our Blockchain MCP Standard v3.0 (BMCPS v3.0) factory system to:

1. **Auto-generate** tool names for new blockchains
2. **Validate** naming consistency across servers
3. **Scale** rapidly to new blockchain integrations
4. **Maintain** predictable developer experience

**Usage in templates:**
```typescript
// Auto-generated from registry
export const TOOL_NAMES = {
  GET_BALANCE: `${BLOCKCHAIN_PREFIX}_get_balance`,
  GET_TRANSACTION: `${BLOCKCHAIN_PREFIX}_get_transaction`,
  // ... all tools from registry
};
```

---

## 🔄 Version History

- **v1.0** (Jan 2025): Initial comprehensive registry with 200+ standardized tool names
- **v0.1** (Dec 2024): Basic 25-tool naming in tool requirements (v2.1)

---

*This registry ensures consistent, predictable tool naming across the entire blockchain MCP ecosystem, enabling rapid development and seamless developer experience.*