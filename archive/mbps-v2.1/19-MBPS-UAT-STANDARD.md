# MBPS v2.1 User Acceptance Testing (UAT) Standard

## Overview
Every blockchain MCP server MUST include a comprehensive User Acceptance Test (UAT) sequence that validates ALL tools in logical dependency order, ensuring real-world functionality beyond simple unit tests.

## Core Principle: Sequential Dependency Testing
Tools must be tested in an order that respects dependencies, builds state progressively, and mimics actual user workflows.

## Universal Test Pattern

### Phase 1: Discovery & Setup (Read-Only)
- **Chain Info** - Verify network connection and status
- **Network Stats** - Get current fees, block height, reserves
- **Price Info** - Check token prices (if applicable)
- **Help System** - Test all help/discovery tools

### Phase 2: Account Creation & Funding
- **Create Wallet A** (Primary test wallet)
- **Create Wallet B** (Secondary for interactions)
- **Validate Addresses** - Confirm both wallets are valid
- **Fund Wallet A** - Request testnet tokens (MUST be automatic)
- **Check Balance A** - Verify funding succeeded
- **Get Account Info A** - Full account details

### Phase 3: Basic Transactions
- **Send Native Token** - A → B small amount
- **Check Balance B** - Verify receipt
- **Transaction History** - Both wallets
- **Get Transaction Details** - Lookup specific tx

### Phase 4: Asset Creation
- **Create Token/NFT** - Using Wallet A
- **Query Created Assets** - Verify creation
- **Set Permissions/Settings** - Modify asset properties

### Phase 5: Asset Operations
- **Transfer Assets** - Between wallets
- **Trade/Exchange** - If DEX available
- **Stake/Lock** - If staking available
- **Burn/Destroy** - Clean up test assets

### Phase 6: Advanced Features
- **Smart Contracts** - Deploy/interact if available
- **Multi-sig** - Test group operations
- **Escrow** - Time-locked operations
- **Governance** - Voting/proposals if available

### Phase 7: Cleanup & Reporting
- **Return Funds** - If possible
- **Document Results** - Success/failure matrix
- **Calculate Costs** - Total fees spent

## Test Implementation Requirements

### 1. Test Runner Script
Each server MUST include a `test-uat.js` script that:
- Executes all tools in dependency order
- Preserves state between operations
- Handles both success and expected failures
- Generates a comprehensive report

### 2. State Management
```javascript
class UATContext {
  constructor() {
    this.wallets = {};
    this.transactions = {};
    this.assets = {};
    this.results = { passed: 0, failed: 0, skipped: 0 };
  }
  
  save(key, value) {
    // Store values for later use
  }
  
  use(reference) {
    // Retrieve stored values
  }
}
```

### 3. Critical Gates
Some operations are marked as **critical** - the test cannot proceed if they fail:
- Wallet funding
- Initial setup operations
- Network connectivity

### 4. Expected Failures
Some tests SHOULD fail to verify error handling:
- Re-funding already funded accounts
- Invalid transactions
- Insufficient balance operations
- Malformed parameters

## Reporting Format

```
=============================
UAT COMPLETE: [Chain Name] [Network]
=============================
Date: 2024-01-23 14:30:00
Duration: 5 minutes 32 seconds

Total Tools: 40
Tests Run: 45 (some tools tested multiple times)
Passed: 43 (95.6%)
Failed: 2
Critical Failures: 0

Phase Results:
✅ Discovery & Setup: 5/5 passed
✅ Account Creation: 6/6 passed
✅ Basic Transactions: 4/4 passed
✅ Asset Creation: 3/3 passed
⚠️ Asset Operations: 6/7 passed
✅ Advanced Features: 4/4 passed
✅ Cleanup: 2/2 passed

Failed Tests:
- xrp_subscribe: WebSocket not supported in request/response mode
- xrp_re_fund: Expected failure - account already funded

Cost Summary:
- Total Fees: 0.0012 XRP
- Gas Used: N/A
- Transactions: 15

VERDICT: ✅ PRODUCTION READY
```

## Chain-Specific Considerations

### Ethereum-based (ETH, Polygon, Arbitrum, etc.)
- Test gas estimation before transactions
- Include ERC-20 token operations
- Test smart contract deployment
- Verify event logs

### UTXO-based (Bitcoin, Litecoin)
- Test UTXO management
- Include SegWit addresses
- Test fee estimation
- Verify transaction confirmation

### Account-based (XRP, Stellar)
- Test reserve requirements
- Include trustline operations
- Test path finding for payments
- Verify account settings

### Cosmos-based (ATOM, OSMO)
- Test staking operations
- Include governance voting
- Test IBC transfers
- Verify delegation

### Solana
- Test SPL token operations
- Include NFT minting
- Test program deployment
- Verify rent exemption

## Success Criteria

### Minimum Requirements
- ✅ 95% of tools must pass
- ✅ All critical operations must succeed
- ✅ All read operations must work
- ✅ Basic transactions must complete

### Production Ready
- ✅ 100% tool coverage achieved
- ✅ All expected failures handled gracefully
- ✅ State preserved correctly between operations
- ✅ Complete end-to-end workflows functional

## Implementation Timeline

1. **Development Phase**: Create UAT during server development
2. **Testing Phase**: Run UAT after each major change
3. **Release Phase**: UAT must pass before version release
4. **Maintenance**: Update UAT when adding new tools

## Example Implementation

See `/test-uat-example.js` for a complete reference implementation that can be adapted for any blockchain MCP server.

---

*This standard ensures that every blockchain MCP server is not just technically functional, but provides a complete, working solution for real-world blockchain interactions.*