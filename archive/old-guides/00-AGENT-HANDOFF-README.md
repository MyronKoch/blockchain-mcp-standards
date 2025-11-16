# 🚨 AGENT HANDOFF - START HERE

## Your Mission: Refactor a Blockchain MCP Server to MBPS v2.1

### ⚠️ THE #1 RULE - DO NOT MISS THIS

**YOU MUST MIGRATE 100% OF THE EXISTING TOOLS, NOT JUST 25!**

- If the original server has 50 tools → Your refactor has 50+ tools
- If the original server has 72 tools → Your refactor has 72+ tools  
- If the original server has 100 tools → Your refactor has 100+ tools

The 25 MBPS v2.1 tools are the MINIMUM baseline. You need ALL existing tools PLUS the 25 standard ones.

## Quick Start Process

1. **COUNT the original tools first**
   ```bash
   grep -c "name: '" src/index.ts  # or wherever they are
   ```
   Write this number down. Your refactor MUST have at least this many tools.

2. **Read these documents IN ORDER:**
   - `02-MIGRATION-REQUIREMENTS.md` - Explains the ALL tools requirement
   - `18-REFACTORING-PROMPT-TEMPLATE.md` - Step-by-step guide
   - `01-MBPS-v2.1-COMPREHENSIVE.md` - The standard itself
   - `10-MSAS.md` - Aliasing system for compliance

3. **Use the Solana example as reference**
   ```bash
   servers/testnet/solana-devnet-mcp-server-refactor/
   ```
   This server has:
   - ✅ 54 original tools (ALL migrated)
   - ✅ 25 MBPS tools (via aliasing)
   - ✅ Modular architecture
   - ✅ Full test coverage

## Common Mistakes (AVOID THESE!)

❌ **WRONG**: "I'll implement the 25 MBPS tools and I'm done"
✅ **RIGHT**: "I'll migrate ALL existing tools AND ensure 25 match MBPS names"

❌ **WRONG**: "MBPS v2.1 means we only need 25 tools total"
✅ **RIGHT**: "MBPS v2.1 means 25 mandatory tools PLUS all existing functionality"

❌ **WRONG**: "I can leave some tools in the old monolithic file"
✅ **RIGHT**: "Every single tool must be extracted and modularized"

## Success Checklist

Before you declare success, verify:

- [ ] **Tool Count**: Original had X tools, refactor has X+ tools
- [ ] **MBPS Compliance**: 25 tools with exact MBPS names (or aliased)
- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **Tests Pass**: `npm test` runs successfully
- [ ] **MCP Inspector**: Can see and test all tools
- [ ] **No Console Output**: No console.log/error in production code
- [ ] **Modular Structure**: index.ts is under 500 lines

## File Structure You'll Create

```
src/
├── index.ts              # Main entry (< 500 lines)
├── client.ts             # Blockchain client
├── config/
│   └── network.ts        # Network configuration
└── tools/
    ├── mbps-core-tools.ts   # 25 MBPS tools or aliases
    ├── core/                # Core blockchain tools
    ├── wallets/             # Wallet management
    ├── tokens/              # Token operations
    ├── network/             # Network utilities
    ├── transactions/        # Transaction handling
    ├── utility/             # Helper tools
    └── [other-categories]/  # ALL other existing tools
```

## Aliasing Example

If a tool exists but has a different name, create an alias:

```typescript
// In index.ts
const toolAliases: Record<string, string> = {
  'sol_get_network_info': 'sol_get_cluster_info',  // MBPS name -> existing name
  'sol_generate_address': 'sol_derive_wallet',
  // ... more aliases
};

// In handler
const actualToolName = toolAliases[name] || name;
const handler = allToolHandlers[actualToolName];
```

## Final Verification

Run this to verify all tools are present:
```bash
# Count tools in refactored version
grep -r "name: '" src/tools/ | wc -l

# Should be >= original tool count
```

## Questions?

If unclear about ANY requirement, check:
1. `02-MIGRATION-REQUIREMENTS.md` - Has explicit "EVERY TOOL MUST BE MIGRATED" statement
2. The Solana refactor example - Shows 54 tools migrated + MBPS compliance
3. `10-MSAS.md` - Shows aliasing approach for compliance without breaking existing tools

---

**Remember**: The goal is 100% backward compatibility PLUS MBPS v2.1 compliance. Not one or the other - BOTH!