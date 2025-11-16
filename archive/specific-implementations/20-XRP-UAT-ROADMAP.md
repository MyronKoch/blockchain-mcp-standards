# XRP Testnet UAT Roadmap
## Complete Test Sequence for 40 Tools

### Test Execution Order

```javascript
// XRP Testnet MCP Server - User Acceptance Test Roadmap
// Tests all 40 tools in logical dependency order

const XRP_UAT_SEQUENCE = {
  "Phase 1: Discovery & Network Info (5 tools)": [
    { 
      tool: "xrp_get_chain_info", 
      purpose: "Verify testnet connection",
      expectedFields: ["network", "current_ledger", "fees"]
    },
    { 
      tool: "xrp_help", 
      params: { topic: "getting-started" },
      purpose: "Test help system"
    },
    { 
      tool: "xrp_list_tools_by_category", 
      purpose: "Discover all 40 tools",
      validate: "Should return 9+ categories"
    },
    { 
      tool: "xrp_search_tools", 
      params: { query: "wallet" },
      validate: "Should find wallet-related tools"
    },
    { 
      tool: "xrp_get_conversation_guidance", 
      params: { operation: "payment" },
      purpose: "Test AI guidance system"
    }
  ],

  "Phase 2: Wallet Setup (5 tools)": [
    { 
      tool: "xrp_create_wallet", 
      save: "walletA", 
      purpose: "Primary test wallet",
      validate: "Returns address and seed"
    },
    { 
      tool: "xrp_create_wallet", 
      save: "walletB", 
      purpose: "Secondary wallet for interactions"
    },
    { 
      tool: "xrp_validate_address", 
      params: { address: "{walletA.address}" },
      expectedResult: { valid: true }
    },
    { 
      tool: "xrp_validate_address", 
      params: { address: "{walletB.address}" }
    },
    { 
      tool: "xrp_import_wallet", 
      params: { seed: "sEdSJHS4oiAdz7w2X2ni1gFiqtbJHqE" }, 
      purpose: "Test wallet import",
      save: "importedWallet"
    }
  ],

  "Phase 3: Funding (5 tools)": [
    { 
      tool: "xrp_fund_testnet_account", 
      params: { address: "{walletA.address}" }, 
      critical: true,
      wait: 5000,
      purpose: "Fund primary wallet with 10,000 XRP"
    },
    { 
      tool: "xrp_get_balance", 
      params: { address: "{walletA.address}" },
      validate: "Balance should be ~10,000 XRP minus reserve"
    },
    { 
      tool: "xrp_get_account_info", 
      params: { address: "{walletA.address}" },
      save: "accountInfoA"
    },
    { 
      tool: "xrp_fund_testnet_account", 
      params: { address: "{walletB.address}" }, 
      critical: true,
      wait: 5000
    },
    { 
      tool: "xrp_get_balance", 
      params: { address: "{walletB.address}" }
    }
  ],

  "Phase 4: Basic Transactions (5 tools)": [
    { 
      tool: "xrp_send_transaction", 
      params: { 
        privateKey: "{walletA.seed}", 
        to: "{walletB.address}", 
        amount: "5" 
      },
      save: "txHash1",
      wait: 5000
    },
    { 
      tool: "xrp_get_balance", 
      params: { address: "{walletB.address}" },
      validate: "Balance increased by ~5 XRP"
    },
    { 
      tool: "xrp_get_transaction_history", 
      params: { address: "{walletA.address}", limit: 5 },
      save: "txHistory"
    },
    { 
      tool: "xrp_get_transaction", 
      params: { hash: "{txHash1}" },
      validate: "Transaction details match sent amount"
    },
    { 
      tool: "xrp_get_block", 
      params: { blockNumber: "validated" },
      purpose: "Get latest validated ledger"
    }
  ],

  "Phase 5: Account Settings (1 tool)": [
    { 
      tool: "xrp_set_account_settings", 
      params: { 
        privateKey: "{walletA.seed}",
        domain: "test.xrp.uat",
        require_dest_tag: false
      },
      wait: 5000
    }
  ],

  "Phase 6: Token/Trustline Operations (4 tools)": [
    { 
      tool: "xrp_create_trustline", 
      params: {
        privateKey: "{walletB.seed}",
        currency: "TST",
        issuer: "{walletA.address}",
        limit: "1000000"
      },
      wait: 5000,
      purpose: "B trusts A to issue TST tokens"
    },
    { 
      tool: "xrp_get_trustlines", 
      params: { address: "{walletB.address}" },
      validate: "Should show TST trustline"
    },
    { 
      tool: "xrp_send_token", 
      params: {
        privateKey: "{walletA.seed}",
        destination: "{walletB.address}",
        currency: "TST",
        issuer: "{walletA.address}",
        amount: "100"
      },
      wait: 5000,
      purpose: "A issues 100 TST to B"
    },
    { 
      tool: "xrp_remove_trustline", 
      params: {
        privateKey: "{walletB.seed}",
        currency: "TST",
        issuer: "{walletA.address}"
      },
      wait: 5000,
      expectError: true,
      purpose: "Should fail - has balance"
    }
  ],

  "Phase 7: NFT Operations (7 tools)": [
    { 
      tool: "xrp_generate_nft_image", 
      params: { 
        prompt: "Abstract geometric test pattern",
        style: "minimalist",
        aspectRatio: "1:1"
      },
      save: "imageUrl",
      purpose: "Generate image for NFT"
    },
    { 
      tool: "xrp_mint_nft_with_ipfs", 
      params: {
        privateKey: "{walletA.seed}",
        name: "UAT Test NFT #1",
        description: "Automated test NFT with IPFS",
        imageUrl: "{imageUrl}",
        transferFee: 1000,
        flags: 8
      },
      save: "nftId1",
      wait: 5000
    },
    { 
      tool: "xrp_mint_nft", 
      params: {
        privateKey: "{walletA.seed}",
        uri: "https://example.com/uat-nft-2.json",
        flags: 8,
        taxon: 1
      },
      save: "nftId2",
      wait: 5000
    },
    { 
      tool: "xrp_get_nfts", 
      params: { address: "{walletA.address}" },
      validate: "Should show 2 NFTs"
    },
    { 
      tool: "xrp_create_nft_offer", 
      params: {
        privateKey: "{walletA.seed}",
        nft_id: "{nftId1}",
        amount: "1000000",
        flags: 1
      },
      save: "offerId",
      wait: 5000,
      purpose: "Create sell offer for 1 XRP"
    },
    { 
      tool: "xrp_accept_nft_offer", 
      params: {
        privateKey: "{walletB.seed}",
        offer_id: "{offerId}"
      },
      wait: 5000,
      purpose: "B buys NFT from A"
    },
    { 
      tool: "xrp_burn_nft", 
      params: {
        privateKey: "{walletB.seed}",
        nft_id: "{nftId1}"
      },
      wait: 5000,
      purpose: "B burns the purchased NFT"
    }
  ],

  "Phase 8: Escrow Operations (4 tools)": [
    { 
      tool: "xrp_create_escrow", 
      params: {
        privateKey: "{walletA.seed}",
        destination: "{walletB.address}",
        amount: "2",
        finish_after: "{timestamp+3600}"
      },
      save: "escrowSeq",
      wait: 5000,
      purpose: "Create 1-hour time-locked escrow"
    },
    { 
      tool: "xrp_get_escrows", 
      params: { address: "{walletA.address}" },
      validate: "Should show pending escrow"
    },
    { 
      tool: "xrp_finish_escrow", 
      params: {
        privateKey: "{walletB.seed}",
        owner: "{walletA.address}",
        escrow_sequence: "{escrowSeq}"
      },
      expectError: true,
      purpose: "Should fail - not yet time"
    },
    { 
      tool: "xrp_cancel_escrow", 
      params: {
        privateKey: "{walletA.seed}",
        owner: "{walletA.address}",
        escrow_sequence: 999999
      },
      expectError: true,
      purpose: "Should fail - invalid sequence"
    }
  ],

  "Phase 9: DEX Operations (4 tools)": [
    { 
      tool: "xrp_place_order", 
      params: {
        privateKey: "{walletA.seed}",
        taker_gets: { currency: "XRP", value: "1000000" },
        taker_pays: { 
          currency: "USD", 
          issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", 
          value: "10" 
        }
      },
      save: "orderSeq",
      wait: 5000,
      purpose: "Place order: Buy 1 XRP for 10 USD"
    },
    { 
      tool: "xrp_get_offers", 
      params: { address: "{walletA.address}" },
      validate: "Should show open offer"
    },
    { 
      tool: "xrp_get_order_book", 
      params: {
        taker_gets: { currency: "XRP" },
        taker_pays: { 
          currency: "USD", 
          issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" 
        }
      },
      purpose: "Check XRP/USD order book"
    },
    { 
      tool: "xrp_cancel_order", 
      params: {
        privateKey: "{walletA.seed}",
        offer_sequence: "{orderSeq}"
      },
      wait: 5000
    }
  ],

  "Phase 10: AMM & Advanced (5 tools)": [
    { 
      tool: "xrp_get_amm_info", 
      params: {
        asset1: { currency: "XRP" },
        asset2: { 
          currency: "USD", 
          issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" 
        }
      },
      purpose: "Check AMM pool (may not exist on testnet)"
    },
    { 
      tool: "xrp_get_ledger_entry", 
      params: { 
        account_root: "{walletA.address}" 
      },
      purpose: "Get raw ledger entry"
    },
    { 
      tool: "xrp_get_account_objects", 
      params: { 
        address: "{walletA.address}" 
      },
      validate: "Should show offers, escrows, etc."
    },
    { 
      tool: "xrp_subscribe", 
      params: {
        streams: ["ledger"],
        accounts: ["{walletA.address}"]
      },
      expectError: true,
      purpose: "WebSocket not available in req/res mode"
    },
    { 
      tool: "xrp_decode_transaction", 
      params: {
        tx_blob: "1200002280000000240000016861D4838D7EA4C6800000000000000000000000000055534400000000004B4E9C06F24296074F7BC48F92A97916C6DC5EA9684000000000002710732103AB40A0490F9B7ED8DF29D246BF2D6269820A0EE7742ACDD457BEA7C7D0931EDB7447304502210090D7ED27A3DCD4ACEDAB963AB"
      },
      expectError: true,
      purpose: "Test transaction decoder"
    }
  ],

  "Phase 11: Final Verification (3 tools)": [
    { 
      tool: "xrp_get_balance", 
      params: { address: "{walletA.address}" },
      purpose: "Final balance check A"
    },
    { 
      tool: "xrp_get_balance", 
      params: { address: "{walletB.address}" },
      purpose: "Final balance check B"
    },
    { 
      tool: "xrp_get_transaction_history", 
      params: { address: "{walletA.address}", limit: 20 },
      purpose: "Complete transaction audit"
    }
  ]
};

// Expected Results Summary
const EXPECTED_RESULTS = {
  total_tools: 40,
  test_operations: 50,
  expected_passes: 46,
  expected_failures: 4,
  critical_operations: ["funding"],
  
  cost_estimate: {
    base_reserve: "2 XRP",
    transaction_fees: "~0.1 XRP",
    total_needed: "20,000.1 XRP (testnet)"
  },
  
  time_estimate: "5-10 minutes",
  
  success_criteria: {
    minimum: "95% tools passing",
    production: "100% coverage, graceful error handling"
  }
};
```

## Execution Instructions

1. **Start with clean testnet wallets** - No pre-existing state
2. **Run phases sequentially** - Each phase depends on previous
3. **Save all outputs** - Many operations reference previous results
4. **Wait for confirmations** - XRP ledger closes every 3-5 seconds
5. **Expect some failures** - Part of comprehensive testing

## Variable Substitutions

- `{walletA.address}` - Use saved wallet A address
- `{walletA.seed}` - Use saved wallet A seed/private key
- `{txHash1}` - Use saved transaction hash
- `{timestamp+3600}` - Current Unix timestamp + 1 hour
- `{nftId1}` - Use saved NFT token ID

## Success Metrics

✅ **Phase 1-3**: All tools must pass (setup critical)
✅ **Phase 4-6**: 95%+ pass rate expected
⚠️ **Phase 7-9**: Some operations may fail on testnet
✅ **Phase 10**: Expected failures are OK
✅ **Phase 11**: Must complete successfully

## Final Report Format

```
XRP TESTNET UAT COMPLETE
========================
Duration: 7 minutes 23 seconds
Network: Testnet (ID: 1)

Tools Tested: 40/40
Operations: 50
Passed: 46 (92%)
Failed: 4 (8%)

Failures (Expected):
- xrp_subscribe: WebSocket not supported
- xrp_remove_trustline: Has balance
- xrp_finish_escrow: Too early
- xrp_cancel_escrow: Invalid sequence

Cost Summary:
- Starting Balance: 20,000 XRP
- Ending Balance: 19,997.8 XRP  
- Total Fees: 0.2 XRP
- Reserves Locked: 2 XRP

VERDICT: ✅ ALL SYSTEMS OPERATIONAL
```