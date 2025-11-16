# Blockchain MCP Server Refactoring Instructions

You are about to refactor a blockchain MCP server to meet our ecosystem standards. Follow these standards documents precisely:

## 📚 Standards Documents Overview

### 1. **MBPS v2.1** (`MBPS-v2.1-COMPREHENSIVE.md`)
**Purpose**: Defines the complete MCP Blockchain Protocol Standard
**Key Requirements**:
- **25 MANDATORY tools** with exact names:
  - `{prefix}_get_chain_info` - Comprehensive blockchain information
  - `{prefix}_get_balance` - Native token balance for address
  - `{prefix}_get_transaction` - Transaction details by hash
  - `{prefix}_get_block` - Block information by number/hash
  - `{prefix}_validate_address` - Address format validation
  - `{prefix}_get_transaction_history` - Transaction history for address
  - `{prefix}_create_wallet` - Generate new wallet/address
  - `{prefix}_help` - Interactive help system
  - `{prefix}_search_tools` - Tool discovery by keyword
  - `{prefix}_list_tools_by_category` - Tools organized by category
  - `{prefix}_send_transaction` - Send native tokens
  - `{prefix}_get_network_info` - Network configuration details
  - `{prefix}_set_network` - Switch between testnet/mainnet
  - `{prefix}_get_gas_price` - Current gas price information
  - `{prefix}_get_mempool_info` - Mempool statistics
  - `{prefix}_estimate_fees` - Fee estimation for transactions
  - `{prefix}_import_wallet` - Import wallet from private key/mnemonic
  - `{prefix}_get_wallet_info` - Wallet account information
  - `{prefix}_get_account_info` - Account details and balances
  - `{prefix}_generate_address` - Generate new address for wallet
  - `{prefix}_get_token_balance` - ERC-20/NEP-141 token balance
  - `{prefix}_get_token_info` - Token metadata and details
  - `{prefix}_transfer_token` - Transfer ERC-20/NEP-141 tokens
  - `{prefix}_approve_token` - Approve token spending
  - `{prefix}_get_token_allowance` - Check approved token amount
- Modular architecture with organized tool directories
- TypeScript strict mode with Zod validation
- Consistent error handling

**Prefixes by Chain**:
- Bitcoin: `btc_`
- Ethereum: `eth_`
- Solana: `sol_`
- Polygon: `poly_`
- Arbitrum: `arb_`
- Avalanche: `avax_`
- Base: `base_`
- BNB Chain: `bnb_`
- World Chain: `world_`
- NEAR: `near_`
- Sui: `sui_`
- TRON: `tron_`
- Cosmos: `cosmos_`
- XRP: `xrp_`

### 2. **Testing Standards** (`TESTING-STANDARDIZATION-INSTRUCTIONS.md`)
**Purpose**: Standardized Jest testing across all servers
**Key Requirements**:
- Jest + ts-jest configuration
- Test directory structure: `tests/unit/`, `tests/integration/`, `tests/smoke.test.ts`
- Minimum smoke test that verifies server loads
- Tool count verification test
- MBPS compliance test for 5 core tools

### 3. **Help System Standard** (`MCP-HELP-SYSTEM-STANDARD.md`)
**Purpose**: Interactive help and tool discovery
**Key Requirements**:
- `{prefix}_help` - Contextual assistance
- `{prefix}_search_tools` - Search by keyword
- `{prefix}_list_tools_by_category` - Browse by category
- Rich descriptions with examples

### 4. **Security Standard** (`MSAS.md`)
**Purpose**: Security architecture and best practices
**Key Requirements**:
- No private key storage in server code
- User-controlled transaction signing
- Input validation with Zod schemas
- Environment variable configuration

## ⚠️ CRITICAL REQUIREMENT - READ THIS FIRST

**YOU MUST MIGRATE ALL EXISTING TOOLS, NOT JUST THE 25 MBPS TOOLS!**

If the original server has 50 tools, your refactored version must have ALL 50 tools PLUS ensure 25 of them match MBPS v2.1 names (using aliases if needed).

**Example**: 
- Original server: 72 tools
- After refactor: 72+ tools (all original + any new ones)
- MBPS compliant: 25 tools with standard names

## 🎯 Refactoring Checklist

### Phase 1: Core Structure
- [ ] Create modular file structure:
  ```
  src/
  ├── index.ts          # <300 lines
  ├── client.ts         # Blockchain client
  ├── config/
  │   └── network.ts
  ├── tools/
  │   ├── core/         # 5 MBPS tools
  │   ├── help/         # Help system
  │   ├── wallet/       # Wallet operations
  │   ├── tokens/       # Token operations
  │   ├── defi/         # DeFi operations
  │   └── [category]/   # Other categories
  ├── types/
  └── utils/
  ```

### Phase 2: MBPS Core Tools (MANDATORY)
Create these 5 tools with EXACT names:

1. **`{prefix}_get_chain_info`**
   - File: `src/tools/core/{prefix}-get-chain-info.ts`
   - Returns: network, chainId, blockHeight, gasPrice, validators

2. **`{prefix}_get_balance`**
   - File: `src/tools/core/{prefix}-get-balance.ts`
   - Returns: address, balance, balanceRaw, symbol

3. **`{prefix}_get_transaction`**
   - File: `src/tools/core/{prefix}-get-transaction.ts`
   - Returns: hash, status, blockNumber, from, to, value

4. **`{prefix}_get_block`**
   - File: `src/tools/core/{prefix}-get-block.ts`
   - Returns: number, hash, timestamp, transactions, gasUsed

5. **`{prefix}_validate_address`**
   - File: `src/tools/core/{prefix}-validate-address.ts`
   - Returns: address, isValid, format, network

### Phase 3: Help System (REQUIRED)
- [ ] Implement `{prefix}_help` tool
- [ ] Implement `{prefix}_search_tools` tool
- [ ] Implement `{prefix}_list_tools_by_category` tool

### Phase 4: Testing
- [ ] Add Jest configuration (`jest.config.js`)
- [ ] Create `tests/smoke.test.ts`
- [ ] Verify all 5 MBPS tools work
- [ ] Document tool count in README

### Phase 5: Documentation
- [ ] Update README with MBPS compliance badge
- [ ] List 5 core MBPS tools prominently
- [ ] Update CHANGELOG with refactor details
- [ ] Ensure accurate tool count

## ⚠️ Common Mistakes to Avoid

1. **Wrong tool names**: 
   - ❌ `{prefix}_get_wallet_balance`
   - ✅ `{prefix}_get_balance`

2. **Wrong tool names**:
   - ❌ `{prefix}_get_block_info`
   - ✅ `{prefix}_get_block`

3. **Missing tool definitions**: Handler exists but tool not in tools array

4. **TypeScript errors**: Use proper blockchain library types (ethers.js, web3.js, etc.)

5. **Monolithic index.ts**: Must be <300 lines with modular imports

## 📋 Verification Steps

After refactoring, verify:

1. **Build succeeds**: `npm run build`
2. **MBPS tools present**: All 5 with correct names
3. **Tests pass**: `npm test`
4. **MCP Inspector works**: `npx @modelcontextprotocol/inspector node dist/index.js`
5. **Each MBPS tool returns data**: Test with real blockchain

## 🎖️ Success Criteria

Your refactor is complete when:
- ✅ **100% of original tools migrated** (count them!)
- ✅ All 25 MBPS v2.1 tools implemented with exact names (or aliased)
- ✅ Modular architecture (<500 line index.ts)
- ✅ TypeScript compiles without errors
- ✅ Jest tests configured and passing
- ✅ Help system implemented (help, search_tools, list_tools_by_category)
- ✅ Documentation updated with accurate tool count
- ✅ No tools left in monolithic file

## 📝 Example: Avalanche Refactor

Reference the successful Avalanche refactor at:
`servers/testnet/avalanche-fuji-mcp-server-refactor/`

Key files to study:
- `src/index.ts` - Clean, modular entry point
- `src/tools/core/avax-get-chain-info.ts` - MBPS tool example
- `src/tools/help/` - Help system implementation

---

**Remember**: MBPS compliance is mandatory. The 5 core tools must have the exact names specified. This ensures compatibility with voice interfaces, testing frameworks, and cross-chain operations.