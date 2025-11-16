# 🚀 Pre-Flight Checklist for MBPS v2.1 Refactoring

## Before You Start

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] npm or yarn available
- [ ] Git repository initialized
- [ ] Working in a feature branch (not main)

### 2. Locate Your Resources
- [ ] Original server directory identified
- [ ] Standards documents folder found (`new standards/`)
- [ ] Scripts folder accessible (`scripts/`)
- [ ] Solana reference example located

### 3. Required Reading Completed
- [ ] `00-AGENT-HANDOFF-README.md` - THE CRITICAL RULES
- [ ] `02-MIGRATION-REQUIREMENTS.md` - ALL tools requirement
- [ ] `18-REFACTORING-PROMPT-TEMPLATE.md` - Step-by-step guide
- [ ] `01-MBPS-v2.1-COMPREHENSIVE.md` - The standard

## During Refactoring

### Phase 1: Analysis (30 mins)
- [ ] Count original tools: `grep -c "name: '" src/index.ts`
- [ ] Run extraction helper: `node scripts/extract-tools.js . eth`
- [ ] Identify tool categories
- [ ] List missing MBPS tools
- [ ] Plan aliasing strategy

### Phase 2: Setup (15 mins)
- [ ] Create refactor directory: `cp -r server server-refactor`
- [ ] Initialize new structure:
  ```bash
  mkdir -p src/tools/{core,wallet,token,network,defi,utility}
  mkdir -p src/{config,types,utils}
  ```
- [ ] Update package.json with MBPS version
- [ ] Configure TypeScript for strict mode

### Phase 3: Core Implementation (2 hours)
- [ ] Extract blockchain client to `src/client.ts`
- [ ] Create network config in `src/config/network.ts`
- [ ] Implement 5 core MBPS tools first:
  - [ ] `{prefix}_get_chain_info`
  - [ ] `{prefix}_get_balance`
  - [ ] `{prefix}_get_transaction`
  - [ ] `{prefix}_get_block`
  - [ ] `{prefix}_validate_address`
- [ ] Verify these work with MCP Inspector

### Phase 4: Tool Migration (3-4 hours)
- [ ] Migrate tools by category:
  - [ ] Core tools (MBPS mandatory)
  - [ ] Wallet tools
  - [ ] Token tools
  - [ ] Transaction tools
  - [ ] Network tools
  - [ ] DeFi tools (if applicable)
  - [ ] NFT tools (if applicable)
  - [ ] Utility tools
- [ ] Create tool index files for each category
- [ ] Update main tool registry

### Phase 5: Aliasing (30 mins)
- [ ] Create alias map for missing MBPS tools
- [ ] Implement alias resolution in handler
- [ ] Test all 25 MBPS tools work (direct or aliased)

### Phase 6: Cleanup (1 hour)
- [ ] Remove ALL console.log/error statements
- [ ] Ensure index.ts < 500 lines
- [ ] Fix all TypeScript errors
- [ ] Update imports to use `.js` extensions

### Phase 7: Testing (1 hour)
- [ ] Run build: `npm run build`
- [ ] Run validation: `./scripts/validate-refactor.sh . eth`
- [ ] Test with MCP Inspector
- [ ] Run test suite: `npm test`
- [ ] Fix any failing tests

## Post-Refactoring

### Validation
- [ ] All original tools present (count matches)
- [ ] 25 MBPS tools accessible
- [ ] No console output in code
- [ ] Build succeeds
- [ ] Tests pass
- [ ] MCP Inspector shows all tools

### Documentation
- [ ] Update README with new structure
- [ ] Document any custom aliases
- [ ] Note any chain-specific features
- [ ] Update tool count in docs

### Final Checks
```bash
# Run these commands to verify:
npm run build
npm test
./scripts/validate-refactor.sh . eth
npx @modelcontextprotocol/inspector node dist/index.js
```

## Time Estimates

- **Small server (30-40 tools)**: 4-5 hours
- **Medium server (40-60 tools)**: 5-7 hours
- **Large server (60+ tools)**: 7-9 hours

## Red Flags to Avoid

❌ **DON'T** skip reading the critical docs
❌ **DON'T** implement only 25 tools (need ALL)
❌ **DON'T** leave console.log statements
❌ **DON'T** ignore TypeScript errors
❌ **DON'T** skip testing

## Green Flags for Success

✅ **DO** migrate every single tool
✅ **DO** use aliasing for MBPS compliance
✅ **DO** follow the modular structure
✅ **DO** test frequently during refactoring
✅ **DO** use validation scripts

---

**Remember**: Quality over speed. A properly refactored server can be reused as a template for future blockchain MCPs!