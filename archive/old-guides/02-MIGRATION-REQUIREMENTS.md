# MCP Server Migration Requirements - COMPLETE TOOL MIGRATION

## ⚠️ CRITICAL CLARIFICATION ⚠️

**THE 25 MBPS v2.1 TOOLS ARE THE MINIMUM STARTING POINT, NOT THE END GOAL**

---

## Executive Summary

This document explicitly clarifies the complete migration requirements for all MCP blockchain servers. There has been confusion about the scope of migration work required. This document eliminates that confusion.

## The Complete Migration Requirement

### What MBPS v2.1 Actually Means

1. **25 Tools = MINIMUM BASELINE**
   - These are the absolute minimum tools every server must have
   - They provide comprehensive functionality for production-ready servers
   - They ensure consistent user experience across all chains
   - **THEY ARE NOT THE TOTAL GOAL**

2. **COMPLETE MIGRATION = ALL TOOLS**
   - **EVERY SINGLE TOOL** from the original monolithic file must be migrated
   - Whether a server has 36 tools (BSC) or 51 tools (Solana) or 158 tools (Osmosis)
   - **100% of existing tools must be extracted and modularized**

## Migration Scope by Server

| Server | Original Tools | MBPS v2.1 Minimum | **ACTUAL MIGRATION TARGET** |
|--------|---------------|-------------------|------------------------------|
| BSC Testnet | 36 | 25 | **ALL 36 TOOLS** |
| Solana DevNet | 51 | 25 | **ALL 51 TOOLS** |
| Ethereum Sepolia | ~40 | 25 | **ALL ~40 TOOLS** |
| Polygon Amoy | ~35 | 25 | **ALL ~35 TOOLS** |
| Bitcoin Testnet | ~45 | 25 | **ALL ~45 TOOLS** |
| Avalanche Fuji | ~38 | 25 | **ALL ~38 TOOLS** |
| Arbitrum Sepolia | ~30 | 25 | **ALL ~30 TOOLS** |
| Base Sepolia | ~25 | 25 | **ALL ~25 TOOLS** |
| NEAR Testnet | ~40 | 25 | **ALL ~40 TOOLS** |
| Cosmos Theta | ~35 | 25 | **ALL ~35 TOOLS** |
| World Chain | ~20 | 25 | **ALL ~20 TOOLS** |
| Sui Testnet | ~25 | 25 | **ALL ~25 TOOLS** |
| TRON Testnet | ~20 | 25 | **ALL ~20 TOOLS** |
| XRP Testnet | ~45 | 25 | **ALL ~45 TOOLS** |

## The Complete Migration Process

### Step 1: Implement MBPS v2.1 Minimum (25 Tools)
✅ Start with the 25 required tools for baseline compliance
- This ensures basic functionality works
- Provides foundation for testing
- **THIS IS JUST THE BEGINNING**

### Step 2: Extract and Migrate ALL Remaining Tools
🔄 **THIS IS THE MAIN WORK**
- Extract every remaining tool from the monolithic file
- Organize into appropriate categories:
  - `/tools/tokens/` - All token operations
  - `/tools/nft/` - All NFT operations
  - `/tools/defi/` - All DeFi operations (swaps, liquidity, staking)
  - `/tools/wallet/` - All wallet operations
  - `/tools/governance/` - All governance operations
  - `/tools/validators/` - All validator operations
  - `/tools/utility/` - All utility operations

### Step 3: Test ALL Migrated Tools
- Every single tool must have tests
- Not just the 25 MBPS tools
- **100% of migrated tools need test coverage**

### Step 4: Documentation
- Document all migrated tools
- Update tool counts
- Maintain comprehensive tool catalog

## Example: Solana DevNet Reality Check

**Current Status (INCORRECT UNDERSTANDING):**
- ✅ 25 MBPS tools implemented
- ❌ 40 tools "not needed"
- Status: "Complete"

**ACTUAL REQUIREMENT:**
- ✅ 25 MBPS tools implemented (Step 1 done)
- 🔄 40 remaining tools TO BE MIGRATED
- Status: **49% Complete (25/51 tools)**

### Remaining Solana Tools to Migrate:
1. Token Operations (15 tools)
   - sol_get_token_accounts
   - sol_get_token_balance
   - sol_send_token
   - sol_create_token_account
   - sol_get_token_supply
   - sol_create_mint
   - sol_mint_tokens
   - sol_burn_tokens
   - sol_close_token_account
   - sol_approve_token
   - sol_revoke_token_approval
   - sol_freeze_token_account
   - sol_thaw_token_account
   - sol_get_token_metadata
   - sol_update_token_metadata

2. Network Operations (8 tools)
   - sol_set_network
   - sol_get_cluster_info
   - sol_get_version
   - sol_get_health
   - sol_get_identity
   - sol_get_inflation_rate
   - sol_get_slot
   - sol_get_block_height

3. Transaction Operations (7 tools)
   - sol_simulate_transaction
   - sol_get_recent_blockhash
   - sol_get_signature_for_address
   - sol_get_confirmed_signatures
   - sol_get_fee_for_message
   - sol_get_minimum_balance_for_rent_exemption
   - sol_get_recent_prioritization_fees

4. Wallet Operations (3 tools)
   - sol_import_wallet
   - sol_derive_wallet
   - sol_wallet_info

5. Utility Operations (5 tools)
   - sol_request_airdrop
   - sol_get_testnet_tokens
   - sol_lamports_to_sol
   - sol_to_lamports
   - sol_base58_encode
   - sol_base58_decode

6. Advanced Operations (3 tools)
   - sol_get_block_production
   - sol_get_epoch_info
   - sol_get_associated_token_address

## Success Criteria

A server is considered **FULLY MIGRATED** when:

1. ✅ All 25 MBPS v2.1 minimum tools are implemented
2. ✅ **100% of original tools are extracted and modularized**
3. ✅ All tools have test coverage
4. ✅ TypeScript compilation succeeds
5. ✅ Index.ts is under 500 lines
6. ✅ Tools are organized in logical categories

## Common Misunderstandings to Avoid

❌ **WRONG**: "25 tools are all we need"
✅ **RIGHT**: "25 tools are the minimum baseline, we need ALL tools"

❌ **WRONG**: "MBPS v2.1 compliance means 25 tools"
✅ **RIGHT**: "MBPS v2.1 compliance means 25 tools PLUS complete modularization of ALL tools"

❌ **WRONG**: "We can leave the other tools in the monolithic file"
✅ **RIGHT**: "Every tool must be extracted into the modular structure"

❌ **WRONG**: "Testing the 25 MBPS tools is enough"
✅ **RIGHT**: "All migrated tools need test coverage"

## Migration Priority

1. **Priority 1**: MBPS v2.1 25 tools (baseline functionality)
2. **Priority 2**: Most commonly used tools (tokens, transactions, wallets)
3. **Priority 3**: DeFi and advanced features
4. **Priority 4**: Utility and helper tools

## Tracking Progress

Use this template for tracking:

```markdown
## [Server Name] Migration Progress

**Total Tools**: XX
**Migrated**: YY/XX (ZZ%)

### MBPS v2.1 Core (25 tools)
- [x] get_chain_info
- [x] get_balance
- [x] get_transaction
- [x] get_block
- [x] validate_address
- [x] get_transaction_history
- [x] create_wallet
- [x] help
- [x] search_tools
- [x] list_tools_by_category
- [x] send_transaction
- [x] get_network_info
- [x] set_network
- [x] get_gas_price
- [x] get_mempool_info
- [x] estimate_fees
- [x] import_wallet
- [x] get_wallet_info
- [x] get_account_info
- [x] generate_address
- [x] get_token_balance
- [x] get_token_info
- [x] transfer_token
- [x] approve_token
- [x] get_token_allowance

### Token Operations (X tools)
- [ ] Tool 1
- [ ] Tool 2
...

### NFT Operations (X tools)
- [ ] Tool 1
- [ ] Tool 2
...
```

## The Bottom Line

**EVERY TOOL MUST BE MIGRATED. NO EXCEPTIONS.**

The goal is 100% extraction and modularization of all existing functionality, not just implementing 25 baseline tools.

---

*This document supersedes any conflicting interpretations. When in doubt, migrate everything.*

**Last Updated**: January 2025
**Authority**: MCP Blockchain Ecosystem Standards Committee