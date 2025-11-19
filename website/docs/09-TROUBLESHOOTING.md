# Troubleshooting Guide for tool requirements (v2.1) Refactoring

## Common Errors and Solutions

### 1. TypeScript Compilation Errors

**Error**: `Cannot find module './logger'`
```typescript
// ❌ WRONG
import logger from './logger';
logger.error('Something failed');

// ✅ CORRECT - Remove all logging
// Simply remove the logger import and usage
```

**Error**: `Property does not exist on type`
```typescript
// Check you're using the correct blockchain library version
// ethers v6 vs v5 have different APIs
```

### 2. Tool Count Mismatches

**Problem**: "I have 50 tools but MCP Inspector only shows 25"

**Solution**: Check your tool registration:
```typescript
// In src/tools/index.ts
export const TOOL_HANDLERS = \{
  ...coreHandlers,      // 25 BMCPS v3.0 tools
  ...walletHandlers,    // Original wallet tools
  ...tokenHandlers,     // Original token tools
  ...defiHandlers,      // Original DeFi tools
  // ... ALL other handlers must be spread here
\};
```

### 3. Aliasing Not Working

**Problem**: "BMCPS v3.0 tools not found even though I aliased them"

**Solution**: Ensure aliases are checked BEFORE throwing error:
```typescript
// In src/index.ts
const actualToolName = toolAliases[toolName] || toolName;
const handler = TOOL_HANDLERS[actualToolName];

if (!handler) \{
  throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: $\{toolName\}`);
\}
```

### 4. Console Output Breaking MCP

**Problem**: "Claude Desktop shows configuration error"

**Solution**: Search and remove ALL console statements:
```bash
# Find all console statements
grep -r "console\." src/ --exclude-dir=node_modules

# Remove them all - no exceptions!
```

### 5. Tests Failing

**Problem**: "Tests fail with mock errors"

**Solution**: Update your test mocks:
```typescript
// tests/integration/tool-execution.test.ts
jest.mock('../../src/client', () => (\{
  getProvider: jest.fn().mockReturnValue(\{
    getBalance: jest.fn().mockResolvedValue(BigInt('1000000000000000000')),
    // Use BigInt for ethers v6
  \})
\}));
```

### 6. Build Succeeds but Runtime Fails

**Problem**: "npm run build works but server crashes"

**Common Causes**:
1. Missing environment variables
2. Incorrect import paths after refactoring
3. Circular dependencies

**Debug Steps**:
```bash
# Test with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js

# Check for runtime errors
node dist/index.js 2>&1 | head -20
```

### 7. Tool Definitions Not Found

**Problem**: "Tool definitions file is missing"

**Solution**: Ensure tool-definitions.ts exports correctly:
```typescript
// src/tool-definitions.ts
import \{ coreTools \} from './tools/core/index.js';
import \{ walletTools \} from './tools/wallets/index.js';
// ... import all tool categories

export const TOOL_DEFINITIONS = [
  ...coreTools,
  ...walletTools,
  // ... spread all tools
];
```

### 8. Modular Structure Issues

**Problem**: "My index.ts is still 2000 lines"

**Solution**: Extract everything possible:
```typescript
// src/index.ts should ONLY have:
// 1. Server initialization
// 2. Handler registration
// 3. Alias mapping
// 4. Main function

// Everything else goes in:
// - src/client.ts (blockchain client)
// - src/config/ (configuration)
// - src/tools/ (all tool logic)
// - src/utils/ (utilities)
// - src/types/ (TypeScript types)
```

## Quick Fixes Checklist

- [ ] Remove ALL console.log/error statements
- [ ] Check all imports use `.js` extensions for ESM
- [ ] Verify package.json has `"type": "module"`
- [ ] Ensure tsconfig.json targets ES2020+
- [ ] Test with `node dist/index.js` directly
- [ ] Verify all original tools are migrated
- [ ] Check aliases map to existing handlers
- [ ] Confirm build output is in correct directory

## Still Stuck?

1. Compare with working example:
   ```bash
   diff -r your-server-refactor/ solana-devnet-mcp-server-refactor/
   ```

2. Validate with script:
   ```bash
   ./scripts/validate-refactor.sh your-server eth
   ```

3. Check the core standards:
   - `01-Blockchain-MCP-Standard-v3.0.md` - Complete BMCPS v3.0 specification
   - `02-UNIVERSAL-TOOL-NAMING-REGISTRY.md` - Tool naming conventions
   - `03-QUICK-START-GUIDE.md` - Implementation guide