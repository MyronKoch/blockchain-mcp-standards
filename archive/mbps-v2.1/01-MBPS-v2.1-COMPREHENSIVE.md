# MCP Blockchain Protocol Standard (MBPS) v2.1 - Comprehensive Edition

## The Complete Standard for Professional Blockchain MCP Servers

**Version**: 2.1  
**Date**: January 2025  
**Author**: Myron Koch - AI Director & Protocol Architect  
**Status**: ACTIVE COMPREHENSIVE STANDARD

---

## Executive Summary

MBPS v2.1 extends the foundational v1.0 standard with comprehensive requirements for production-ready blockchain MCP servers. This includes modular architecture, extended tool sets, standardized help systems, and enterprise-grade deployment patterns.

## Core Architecture Standards

### Two-Server Model (NEW)
Each blockchain MUST have separate servers:
- **Testnet Server**: `{blockchain}-testnet-mcp-server/` (development, testing)
- **Mainnet Server**: `{blockchain}-mainnet-mcp-server/` (production, real funds)

**Benefits:**
- No accidental mainnet transactions
- Clear environment separation  
- Simplified configuration
- Enhanced security

### Modular File Structure (NEW)
```
src/
├── index.ts          # Main entry point (<300 lines)
├── client.ts         # Blockchain client abstraction
├── config/           # Network configurations
│   └── network.ts
├── tools/            # Organized by functional domain
│   ├── account/      # Balance, history, validation
│   ├── chain/        # Blockchain queries, blocks
│   ├── staking/      # Validator operations
│   ├── governance/   # Proposal operations
│   ├── defi/         # DEX, lending operations
│   ├── nft/          # NFT operations
│   ├── help/         # Help system tools
│   └── wallet/       # Wallet management
├── types/            # TypeScript definitions
└── utils/            # Shared utilities
```

## MBPS v2.1 Core Tools (STANDARDIZED - 25 TOOLS REQUIRED)

⚠️ **MANDATORY STANDARD**: These 25 tools represent the STANDARDIZED MINIMUM FUNCTIONAL SET for all production-ready blockchain MCP servers. This comprehensive tool set has been established as the industry standard based on analysis of 14+ blockchain servers and their production implementations.

**ALL SERVERS MUST COMPLY** - Every blockchain MCP server must implement these exact 25 tools using the specified naming conventions and functionality.

Every server MUST implement these 25 standardized core tools AS THE BASELINE:

### 1. `{prefix}_get_chain_info`
Comprehensive blockchain information
```typescript
interface ChainInfo {
  network: string;
  chainId: number;
  blockHeight: number;
  gasPrice?: string;
  validators?: number;
  totalSupply?: string;
}
```

### 2. `{prefix}_get_balance`
Native token balance for address
```typescript
interface BalanceResult {
  address: string;
  balance: string;        // Formatted (e.g., "1.5 ETH")
  balanceRaw: string;     // Raw units (e.g., "1500000000000000000")
  symbol: string;
}
```

### 3. `{prefix}_get_transaction`
Transaction details by hash
```typescript
interface TransactionResult {
  hash: string;
  status: 'success' | 'failed' | 'pending';
  blockNumber?: number;
  from: string;
  to: string;
  value: string;
  gasUsed?: string;
}
```

### 4. `{prefix}_get_block`
Block information by number/hash
```typescript
interface BlockResult {
  number: number;
  hash: string;
  timestamp: number;
  transactions: number;
  gasUsed?: string;
  gasLimit?: string;
}
```

### 5. `{prefix}_validate_address`
Address format validation
```typescript
interface AddressValidation {
  address: string;
  isValid: boolean;
  format?: string;        // e.g., "bech32", "hex"
  network?: string;
}
```

### Core Tools (6-11) - Standardized Set

### 6. `{prefix}_get_transaction_history`
Transaction history for an address
- **Parameters**: `address: string`, `limit?: number` (default: 10, max: 100)
- **Returns**: Array of recent transactions for address
- **Implementation**: Use block scanning, REST APIs, or indexing services

### 7. `{prefix}_create_wallet`
Generate new wallet with address and private key
- **Parameters**: None (generates random wallet)
- **Returns**: Address, private key, mnemonic (if applicable)
- **Security**: For development/testing only, warn about testnet usage

### 8-10. Help System (3 TOOLS)
**8.** `{prefix}_help` - Interactive help with contextual guidance
**9.** `{prefix}_search_tools` - Search tools by keyword/category
**10.** `{prefix}_list_tools_by_category` - Browse organized tool catalog

### 11. `{prefix}_send_transaction`
Send native tokens between addresses
- **Parameters**: `to: string`, `amount: string`, `privateKey?: string`
- **Returns**: Transaction hash and status
- **Security**: Private key handling must be optional/external

### Core Tools (12-25) - Standardized Set

**Network Management (2 tools):**
### 12. `{prefix}_get_network_info`
Get network status and configuration
- **Parameters**: None
- **Returns**: Network details, health, RPC endpoints, block time
- **Implementation**: Network status, RPC health, configuration details

### 13. `{prefix}_set_network`
Switch between networks (testnet/mainnet)
- **Parameters**: `network: string` (required)
- **Returns**: Current network confirmation
- **Implementation**: Network switching capability

**Gas/Fee Management (3 tools):**
### 14. `{prefix}_get_gas_price`
Get current gas/fee pricing
- **Parameters**: None
- **Returns**: Gas price, fee estimates, priority fees
- **Implementation**: Fee estimation for different confirmation times

### 15. `{prefix}_get_mempool_info`
Get mempool statistics and congestion
- **Parameters**: None
- **Returns**: Mempool size, transaction counts, fee analysis
- **Implementation**: Network congestion monitoring

### 16. `{prefix}_estimate_fees`
Estimate fees for transaction types
- **Parameters**: `transactionType: string`, `confirmationTarget?: number`
- **Returns**: Fee estimates for different scenarios
- **Implementation**: Smart fee calculation

**Wallet Management (4 tools):**
### 17. `{prefix}_import_wallet`
Import wallet from private key/mnemonic
- **Parameters**: `privateKey?: string`, `mnemonic?: string`
- **Returns**: Address, public key, validation status
- **Security**: Secure key handling, validation only

### 18. `{prefix}_get_wallet_info`
Get comprehensive wallet/account details
- **Parameters**: `address: string`
- **Returns**: Account info, balances, nonce, transaction count
- **Implementation**: Account metadata and status

### 19. `{prefix}_get_account_info`
Get account details and metadata
- **Parameters**: `address: string`
- **Returns**: Account balances, transaction history summary, status
- **Implementation**: Account analytics and overview

### 20. `{prefix}_generate_address`
Generate new address (multiple formats)
- **Parameters**: `format?: string`, `derivationPath?: string`
- **Returns**: Address, format, derivation details
- **Implementation**: Address generation for different use cases

**Token Operations (5 tools):**
### 21. `{prefix}_get_token_balance`
Get token balance for any address
- **Parameters**: `tokenAddress: string`, `walletAddress: string`
- **Returns**: Token balance, formatted and raw values, decimals
- **Implementation**: Multi-token balance queries

### 22. `{prefix}_get_token_info`
Get token metadata and details
- **Parameters**: `tokenAddress: string`
- **Returns**: Token name, symbol, decimals, total supply, contract details
- **Implementation**: Token metadata retrieval

### 23. `{prefix}_transfer_token`
Send tokens between addresses
- **Parameters**: `tokenAddress: string`, `to: string`, `amount: string`, `privateKey?: string`
- **Returns**: Transaction hash and status
- **Security**: Optional private key handling

### 24. `{prefix}_approve_token`
Approve token spending for DeFi protocols
- **Parameters**: `tokenAddress: string`, `spender: string`, `amount: string`, `privateKey?: string`
- **Returns**: Approval transaction hash and status
- **Security**: Optional private key handling

### 25. `{prefix}_get_token_allowance`
Check approved token spending
- **Parameters**: `tokenAddress: string`, `owner: string`, `spender: string`
- **Returns**: Current allowance amount and status
- **Implementation**: Allowance checking for DeFi operations

## MBPS v2.1 Extended Tools (REVISED - SPECIALIZED FUNCTIONALITY)

**IMPORTANT**: These tools provide specialized functionality beyond core operations. Servers should implement these based on their blockchain's specific features.

### DeFi Operations
- `{prefix}_swap_tokens` - DEX token swaps
- `{prefix}_get_pool_info` - Liquidity pool details
- `{prefix}_add_liquidity` - Add to liquidity pools
- `{prefix}_remove_liquidity` - Remove from pools
- `{prefix}_get_token_price` - Token price from DEX/market data
- `{prefix}_find_arbitrage` - Find arbitrage opportunities
- `{prefix}_execute_arbitrage` - Execute arbitrage trades

### NFT Operations
- `{prefix}_deploy_nft_collection` - Deploy NFT collection contract
- `{prefix}_mint_nft` - Mint NFT with metadata
- `{prefix}_get_nft_info` - Get NFT metadata and ownership
- `{prefix}_get_nft_owner` - Get NFT owner information
- `{prefix}_create_nft_offer` - Create NFT sale offers
- `{prefix}_accept_nft_offer` - Accept NFT offers

### Staking & Governance
- `{prefix}_get_validators` - List network validators
- `{prefix}_get_staking_info` - Validator staking information
- `{prefix}_stake_tokens` - Stake tokens with validators
- `{prefix}_unstake_tokens` - Unstake tokens from validators
- `{prefix}_claim_staking_rewards` - Claim staking rewards
- `{prefix}_get_governance_proposals` - List governance proposals
- `{prefix}_vote_proposal` - Vote on governance proposals

### Advanced Operations
- `{prefix}_get_contract_info` - Smart contract information
- `{prefix}_call_contract` - Call contract read/write functions
- `{prefix}_get_logs` - Get contract event logs
- `{prefix}_subscribe` - Subscribe to blockchain events
- `{prefix}_get_ledger_entry` - Get specific ledger entries
- `{prefix}_get_account_objects` - Get account-owned objects

### Bitcoin-Specific (BTC servers only)
- `{prefix}_get_inscriptions` - Bitcoin ordinals/inscriptions
- `{prefix}_create_inscription` - Create Bitcoin inscriptions
- `{prefix}_get_runes` - Runes protocol operations
- `{prefix}_get_stamps` - Bitcoin stamps
- `{prefix}_get_lightning_info` - Lightning Network data
- `{prefix}_create_lightning_invoice` - Lightning invoices

### Cosmos-Specific (ATOM, OSMO servers only)
- `{prefix}_get_ibc_channels` - IBC channel information
- `{prefix}_get_ibc_transfers` - IBC transfer history
- `{prefix}_get_superfluid_assets` - Superfluid staking
- `{prefix}_get_gamm_pools` - Gamm liquidity pools
- `{prefix}_get_concentrated_liquidity` - Concentrated liquidity positions
- `{prefix}_get_epoch_info` - Epoch information

## Quality Standards

### TypeScript Compliance (REQUIRED)
- All servers MUST compile without errors
- Strict TypeScript configuration
- Zod validation for runtime type safety
- Comprehensive error handling

### Performance Standards
- Response time: <5 seconds for standard operations
- Graceful timeout handling (30s default)
- Proper rate limiting awareness
- Efficient RPC usage

### Security Standards (CRITICAL)
- **No private key storage** in server code
- User-controlled transaction signing
- Input validation with Zod schemas
- Network isolation (testnet/mainnet separation)
- Environment variable configuration

## Chain Prefix Registry

| Blockchain | Testnet Prefix | Mainnet Prefix | Network |
|------------|----------------|----------------|---------|
| Ethereum | `eth_` | `eth_` | Sepolia / Mainnet |
| Polygon | `poly_` | `poly_` | Amoy / Mainnet |
| Arbitrum | `arb_` | `arb_` | Sepolia / One |
| Avalanche | `avax_` | `avax_` | Fuji / C-Chain |
| Base | `base_` | `base_` | Sepolia / Mainnet |
| BNB Chain | `bnb_` | `bnb_` | Testnet / Mainnet |
| World Chain | `world_` | `world_` | Sepolia / Mainnet |
| Solana | `sol_` | `sol_` | Devnet / Mainnet |
| Bitcoin | `btc_` | `btc_` | Testnet / Mainnet |
| NEAR | `near_` | `near_` | Testnet / Mainnet |
| XRP | `xrp_` | `xrp_` | Testnet / Mainnet |
| Sui | `sui_` | `sui_` | Testnet / Mainnet |
| TRON | `tron_` | `tron_` | Shasta / Mainnet |
| Cosmos Hub | `cosmos_` | `cosmos_` | Theta / Hub-4 |
| Osmosis | `osmo_` | `osmo_` | Test-5 / Osmosis-1 |

## Development Workflow Standards

### Build Process
```json
{
  "scripts": {
    "build": "tsc --project .",
    "dev": "tsx src/index.ts",
    "start": "node dist/index.js",
    "test": "npm run test-tools",
    "test-tools": "node test-tools.js"
  }
}
```

### Testing Requirements
- All tools must be testable via MCP Inspector
- Automated test suite for core 25 tools
- Error case testing (invalid addresses, failed transactions)
- Performance benchmarking

### Documentation Standards
- README with tool catalog
- CHANGELOG with version history
- API documentation for all tools
- Setup and configuration guide

## MBPS v2.1 Implementation Requirements

### Phase 1: Standardized Core Implementation
1. ✅ Ensure 25 core MBPS v2.1 tools present
2. ✅ Remove legacy naming
3. ✅ Implement comprehensive help system
4. ✅ Add network management capabilities

### Phase 2: Extended Tool Implementation (RECOMMENDED)
1. 🔄 Extract ALL remaining tools (100% migration required)
2. 🔄 Organize into modular categories
3. 🔄 Test every migrated tool
4. 🔄 Implement blockchain-specific extended tools

### Phase 4: Production Readiness

#### CRITICAL REQUIREMENT - Real Blockchain Testing
**NO SERVER CAN BE CONSIDERED PRODUCTION READY WITHOUT:**
1. ✅ All tools tested against real blockchain (testnet minimum)
2. ✅ Integration test suite with >90% tool coverage
3. ✅ Manual or automated validation of actual blockchain responses
4. ✅ Error handling tested with real network failures

#### Additional Requirements
1. ⏳ Full TypeScript compliance
2. ⏳ Performance optimization
3. ⏳ Security audit
4. ⏳ Enterprise deployment preparation

## Compliance Verification

### Automated Checking
```bash
# Check MBPS compliance
npm run mbps-check

# Test all tools
npm run test-tools

# Verify build
npm run build
```

### Certification Levels

**🥉 MBPS v2.1 Standard**
- 25 core tools implemented
- Consistent naming convention
- Basic error handling

**🥈 MBPS v2.1 Professional**
- 25 standardized core tools + extended functionality
- Modular architecture
- Comprehensive help system implemented
- Full TypeScript compliance
- Advanced network management capabilities

**🥇 MBPS v2.1 Enterprise**
- 25 standardized core tools + comprehensive extended tool suite
- Comprehensive testing (100% coverage)
- Performance optimized
- Security audited
- Advanced DeFi/NFT/Governance features

## MBPS v2.1 Standard Compliance Process

### Verification Steps for MBPS v2.1 Compliance
1. **Tool Inventory Check**: Verify all 25 standardized MBPS v2.1 core tools are present
2. **Build Verification**: Ensure TypeScript compilation succeeds
3. **Functional Testing**: Test each MBPS tool with live blockchain data
4. **Architecture Review**: Confirm modular structure and <300 line index.ts
5. **Help System Testing**: Verify help, search, and category tools work
6. **Documentation Update**: Mark server as MBPS v2.1 compliant in standards

### Common Compliance Issues Found
- Missing tool definitions in tools array (handlers exist but not exposed)
- TypeScript compilation errors in new tools
- Incorrect parameter schemas for blockchain-specific requirements

### Resolution Patterns
- **Missing Tools**: Create tool files following established patterns
- **Type Errors**: Use proper ethers.js/CosmJS types for blockchain operations
- **Handler Gaps**: Add switch cases and imports for new tools

## Future Roadmap

### v2.1 (Q2 2025)
- Cross-chain bridge operations
- Multi-signature wallet support
- Advanced DeFi protocols

### v2.2 (Q3 2025)
- WebSocket subscriptions
- Real-time price feeds
- Event monitoring

### v3.0 (Q4 2025)
- AI-powered analytics
- Automated trading strategies
- Risk management tools

---

## Current Ecosystem Status

**14 Testnet Servers** implementing MBPS v2.1:
- ✅ Transaction history: 6/14 complete
- ✅ Modular refactoring: 5/14 complete (Avalanche ✅, Bitcoin ✅, Ethereum ✅, Solana ✅, XRP ✅)
- ✅ MBPS v2.1 compliance: 0/14 complete (25 standardized tools required)
- 🔄 Additional refactoring: 9/14 servers in progress
- ⏳ Help systems: 5/14 complete

**Completed Refactors**:
- ✅ **Avalanche Fuji**: MBPS v2.1 Standard Compliant (25/25 standardized tools)
- ✅ **Bitcoin Testnet**: MBPS v2.1 Standard Compliant (25/25 standardized tools)
- 🔄 **Ethereum Sepolia**: 12/25 standardized tools implemented
- 🔄 **Solana Devnet**: 51/25+ standardized tools implemented
- 🔄 **XRP Testnet**: 40/25+ standardized tools implemented

**Analysis Results**:
- **25 standardized tools**: Established as the minimum requirement across all servers
- **Comprehensive coverage**: All major blockchain operations included
- **Production standard**: 25 tools required for MBPS v2.1 compliance

**Production Template**: Osmosis testnet server (119 tools, comprehensive MBPS v2.1 compliance)

## Comprehensive Tool Overlap Analysis (NEW)

### Methodology
Analyzed 14 blockchain MCP servers across different networks:
- Bitcoin Testnet (101 tools)
- Solana Devnet (51 tools)
- Ethereum Sepolia (12 tools)
- XRP Testnet (40 tools)
- BNB Chain Testnet (40 tools)
- Osmosis Testnet (119 tools)
- Avalanche Fuji (40+ tools)
- Plus 7 additional servers

### Key Findings

#### **Universal Core Tools (100% Overlap)**
These tools appear in every single blockchain server analyzed:

1. **Network Management**: `{prefix}_get_chain_info`, `{prefix}_get_network_info`
2. **Balance Operations**: `{prefix}_get_balance`, `{prefix}_get_token_balance`
3. **Transaction Operations**: `{prefix}_get_transaction`, `{prefix}_get_transaction_history`
4. **Block Operations**: `{prefix}_get_block`
5. **Address Operations**: `{prefix}_validate_address`
6. **Wallet Operations**: `{prefix}_create_wallet`, `{prefix}_import_wallet`, `{prefix}_get_account_info`

#### **Common Extended Tools (85-95% Overlap)**
These tools appear in most blockchain servers:

1. **Token Operations**: `{prefix}_get_token_info`, `{prefix}_transfer_token`, `{prefix}_approve_token`
2. **Fee Management**: `{prefix}_get_gas_price`, `{prefix}_get_mempool_info`
3. **Network Switching**: `{prefix}_set_network`
4. **Advanced Queries**: `{prefix}_get_wallet_info`, `{prefix}_get_validators`

#### **Blockchain-Specific Tools**
Tools that are unique to specific blockchain ecosystems:

1. **Bitcoin**: Inscriptions, Runes, Lightning, Stamps
2. **Ethereum**: Smart contracts, event logs, gas optimization
3. **Solana**: SPL tokens, program accounts, validator operations
4. **Cosmos**: IBC transfers, governance, epochs, concentrated liquidity
5. **XRP**: Escrow, DEX order books, AMM pools

### Tool Implementation Patterns

#### **Consistent Implementation Across Servers**
- **Help System**: 5/14 servers have full help systems implemented
- **Modular Architecture**: 5/14 servers use modular file structure
- **TypeScript**: All servers use TypeScript with Zod validation
- **Error Handling**: Comprehensive error handling in all servers

#### **Tool Coverage Statistics**
- **Average Tools/Server**: 58 tools
- **Range**: 12-119 tools
- **MBPS v2.1 Compliance**: 0/14 servers (0% with 25-tool requirement)

### Requirements for MBPS v2.1

#### **Immediate Actions Required**
1. **Implement Standard Tool Set**: All servers must implement the 25 standardized core tools
2. **Standardize Help Systems**: Require help system in all servers
3. **Implement Network Management**: Require network switching capabilities
4. **Add Token Operations**: Make token operations core requirements

#### **Development Priorities**
1. **High Priority**: Complete help system implementation across all servers
2. **Medium Priority**: Implement missing core tools (14 new tools)
3. **Low Priority**: Add blockchain-specific extended tools

#### **Quality Improvements**
1. **Testing**: All servers need comprehensive test suites
2. **Documentation**: Standardize README format (completed ✅)
3. **Performance**: Add performance monitoring and optimization
4. **Security**: Implement security audits and best practices

### Impact Assessment

**Benefits of MBPS v2.1 Standard:**
- ✅ **Consistency**: All servers will have identical core functionality
- ✅ **Reliability**: Production-ready feature set across all blockchains
- ✅ **Developer Experience**: Predictable tool availability
- ✅ **AI Integration**: Comprehensive tool coverage for AI assistants
- ✅ **Enterprise Readiness**: Professional feature set for business use

**Implementation Effort:**
- 🔄 **5 servers**: Need 14-20 additional core tools
- 🔄 **9 servers**: Need help system implementation
- 🔄 **All servers**: Need documentation updates
- ⏳ **Timeline**: 4-6 weeks for full compliance

**Standard**: All blockchain MCP servers must comply with the MBPS v2.1 standard for consistent, comprehensive tool coverage.

---

*This standard defines the current blockchain MCP ecosystem. All servers must comply.*

**Maintained at**: `github.com/MCP/blockchain-ecosystem/new-standards/MBPS-v2.0.md`